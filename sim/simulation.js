import { SurfaceLibrary } from '../core_physics/chassis/surface.js';
import { FlatTerrain } from '../core_physics/chassis/terrain.js';
import { Stage } from '../systems/stage/stage.js';
import { StageRuntime } from '../systems/stage/stage_runtime.js';
import { SurfaceEvolution } from '../systems/surface_evolution/surface_evolution.js';
import { DamageSystem } from '../systems/damage/damage_system.js';
import { hashString, clamp } from '../core_physics/math/util.js';
import { Q } from '../core_physics/math/quat.js';
import { V3 } from '../core_physics/math/vec3.js';
import { Vehicle } from './vehicle.js';
import { assertValidConfig } from './config.js';
import { buildTelemetry, buildRenderState } from './telemetry.js';

export const DEFAULT_INPUTS = Object.freeze({
  throttle: 0, brake: 0, clutch: null, steer: 0, handbrake: 0, shiftUp: false, shiftDown: false, gear: null,
  ignition: true, starter: false, alsSwitch: false, launchSwitch: false, centerDiffLock: 0, brakeBias: null,
});

/**
 * Deterministic simulation facade.
 *
 *   const sim = new Simulation(config, { stage });
 *   sim.setInputs({ throttle: 1, steer: -0.2 });
 *   sim.update(frameDt);                 // fixed-step accumulator, returns ticks run
 *   const t = sim.getTelemetry();        // JSON snapshot for HUD / UI
 *   const r = sim.getRenderState();      // interpolated transforms for Three.js
 *
 * Determinism: the state after N ticks is a pure function of (config, stage, seed, the input
 * values latched at each tick). `stateHash()` condenses the full state so two machines (or a
 * UI replica) can verify they are in sync; `serialize()` / `restore()` snapshot and resume exactly.
 */
export class Simulation {
  /**
   * @param {object} config bundle of the parsed /config/*.json files
   * @param {object} [opts]
   * @param {import('../systems/stage/stage.js').Stage} [opts.stage] a built stage
   * @param {object|string} [opts.stageJson] stage JSON (requires config.gpsStageSchema)
   * @param {object} [opts.setup] tyre / pressure overrides passed to the chassis
   */
  constructor(config, opts = {}) {
    this.warnings = assertValidConfig(config);
    this.config = config;
    const sc = config.simulation;
    this.dt = sc.dt;
    this.maxSteps = sc.maxStepsPerUpdate ?? 100;
    this.surfaces = new SurfaceLibrary(config.surfaces);
    this.baseAmbient = { pressure: sc.ambient.pressure, temperature: sc.ambient.temperature };
    this.ambient = { ...this.baseAmbient };
    this.altitudeCorrection = !!sc.ambient.altitudeCorrection;
    this.wind = { ...(sc.wind ?? { x: 0, y: 0, z: 0 }) };

    if (opts.stage) this.stage = opts.stage;
    else if (opts.stageJson) this.stage = Stage.fromJson(opts.stageJson, config.gpsStageSchema, { surfaces: this.surfaces });
    else this.stage = null;

    this.evolution = null;
    if (this.stage) {
      if (sc.evolution?.enabled) {
        this.evolution = new SurfaceEvolution(this.stage.spline, this.surfaces, { rowSpacing: sc.evolution.rowSpacing, columnSpacing: sc.evolution.columnSpacing });
        this.stage.terrain.setEvolution(this.evolution);
      }
      this.terrain = this.stage.terrain;
      this.runtime = new StageRuntime(this.stage);
      this.pacenotePlayer = this.stage.createPacenotePlayer();
    } else {
      this.terrain = new FlatTerrain(sc.flatTerrain ?? {});
      this.runtime = null; this.pacenotePlayer = null;
    }

    this.vehicle = new Vehicle(config, this.surfaces, this.ambient, this.terrain, opts.setup ?? {});
    this.vehicle.damage = new DamageSystem(config.damage, this.ambient.temperature, { seed: this.stage?.def.seed ?? sc.seed ?? 1 });
    this.vehicle.evolution = this.evolution;

    this.inputs = { ...DEFAULT_INPUTS };
    this.tick = 0;
    this.time = 0;
    this.seq = 0;
    this.odometer = 0;
    this.altitude = 0;
    this.accumulator = 0;
    this.pendingEvents = [];
    this.eventLog = [];
    this.subscribers = [];
    this._prevRender = null;
    this._lastNotifyTick = 0;
    this._originElevation = this.stage ? this.stage.def.origin.elevation ?? 0 : 0;

    // place at the stage start (or the origin of flat ground)
    if (this.stage) this.placeOnStage({ s: 0 });
    else this.placeAt(0, 0, 0);
  }

  // ---------------------------------------------------------------- placement
  /** Place the car at world (x, z) facing compass heading [deg] and let the suspension settle. */
  placeAt(x, z, headingDeg = 0, speed = 0, settleSeconds = 0.5) {
    const ch = this.vehicle.chassis;
    // settle the suspension at rest on the spot, then give the car its initial velocity
    ch.placeOnTerrain(this.terrain, x, z, (headingDeg * Math.PI) / 180, 0);
    if (settleSeconds > 0) ch.settle(this.terrain, settleSeconds, this.dt);
    if (speed !== 0) {
      const fwd = Q.rotate(ch.quaternion, { x: 1, y: 0, z: 0 });
      ch.velocity = V3.scale(fwd, speed);
    }
    for (const w of ch.wheels) { w.omega = speed / w.radius; w.tire.reset(); }
    this._afterPlacement();
  }

  /** Place the car on the stage at distance s [m], lateral offset [m] (right +), initial speed [m/s]. */
  placeOnStage({ s = 0, lateral = 0, speed = 0, settleSeconds = 0.5 } = {}) {
    if (!this.stage) throw new Error('no stage loaded');
    const p = this.stage.startPose(s, lateral);
    this.placeAt(p.x, p.z, (p.heading * 180) / Math.PI, speed, settleSeconds);
    this.runtime.reset();
    this.pacenotePlayer.reset();
    this.pacenotePlayer.next = this.pacenotePlayer.notes.findIndex((n) => n.sEnd >= s - 1);
    if (this.pacenotePlayer.next < 0) this.pacenotePlayer.next = this.pacenotePlayer.notes.length;
  }

  _afterPlacement() {
    this.vehicle.drivetrain.engine.omega = Math.max(this.vehicle.drivetrain.engine.omega, this.vehicle.drivetrain.engine.idleOmega);
    this._snapshotRender();
    this._updateAmbient();
  }

  // ---------------------------------------------------------------- inputs
  /** Merge input values (latched at the start of each tick). Unknown keys throw to catch typos. */
  setInputs(partial) {
    for (const [k, v] of Object.entries(partial)) {
      if (!(k in DEFAULT_INPUTS)) throw new RangeError(`unknown input "${k}"`);
      this.inputs[k] = v;
    }
    const i = this.inputs;
    i.throttle = clamp(i.throttle, 0, 1); i.brake = clamp(i.brake, 0, 1); i.steer = clamp(i.steer, -1, 1);
    i.handbrake = clamp(i.handbrake, 0, 1); i.centerDiffLock = clamp(i.centerDiffLock, 0, 1);
    if (i.clutch !== null && i.clutch !== undefined) i.clutch = clamp(i.clutch, 0, 1);
  }

  /** Replace all inputs (unspecified ones return to their defaults). */
  replaceInputs(inputs) { this.inputs = { ...DEFAULT_INPUTS }; this.setInputs(inputs); }

  // ---------------------------------------------------------------- stepping
  _snapshotRender() {
    const ch = this.vehicle.chassis;
    this._prevRender = {
      position: { ...ch.position }, quaternion: { ...ch.quaternion },
      wheels: ch.wheels.map((w) => ({ z: w.z, steer: w.steer, toe: w.toe, camber: w.camber, angle: w.angle })),
    };
  }

  _updateAmbient() {
    if (!this.altitudeCorrection) return;
    const ch = this.vehicle.chassis;
    const h = Math.max(-200, this._originElevation + ch.position.y - ch.cgHeight);
    this.altitude = h;
    const T = this.baseAmbient.temperature - 0.0065 * h;
    const p = this.baseAmbient.pressure * Math.pow(1 - 2.25577e-5 * h, 5.25588);
    this.vehicle.setAmbient(p, T);
  }

  /** Advance exactly one fixed physics tick. */
  step() {
    const dt = this.dt;
    this._snapshotRender();
    const v = this.vehicle;
    v.step(dt, this.inputs, { wind: this.wind });
    this.tick++;
    this.time = this.tick * dt;
    this.odometer += v.chassis.speed * dt;
    if (this.tick % 100 === 0) this._updateAmbient();

    // stage progress & pacenotes
    if (this.runtime) {
      const evs = this.runtime.update(dt, v.chassis.position, v.chassis.position.y);
      for (const e of evs) this._emit(e);
      if (this.runtime.started) {
        const pe = this.pacenotePlayer.update(dt, this.runtime.s, v.chassis.speed);
        for (const e of pe) this._emit({ type: 'pacenote', id: e.note.id, text: e.note.text, tokens: e.note.tokens, severity: e.note.severity, direction: e.note.direction, kind: e.note.type, duration: e.duration, distanceAhead: e.distanceAhead });
      }
    }
    // component events
    for (const e of v.drivetrain.transmission.events) this._emit(e);
    for (const e of v.drivetrain.engine.events) this._emit(e);
    if (v.damage) for (const e of v.damage.events) this._emit(e);

    this._maybeNotify();
  }

  /**
   * Advance by a render-frame duration using the fixed-step accumulator.
   * @returns {number} number of physics ticks executed
   */
  update(frameDt) {
    this.accumulator += Math.max(0, frameDt);
    let n = 0;
    while (this.accumulator >= this.dt && n < this.maxSteps) {
      this.step();
      this.accumulator -= this.dt;
      n++;
    }
    if (n === this.maxSteps) this.accumulator = 0;     // spiral-of-death guard: drop the backlog
    this.seq++;
    return n;
  }

  /** Run `n` ticks, optionally driving inputs from `fn(tick, sim)` before each tick. */
  run(n, fn) {
    for (let i = 0; i < n; i++) {
      if (fn) { const r = fn(this.tick, this); if (r) this.setInputs(r); }
      this.step();
    }
  }

  // ---------------------------------------------------------------- events & subscribers
  _emit(e) {
    const ev = { tick: this.tick, time: this.time, ...e };
    this.pendingEvents.push(ev);
    this.eventLog.push(ev);
    if (this.eventLog.length > 2000) this.eventLog.splice(0, this.eventLog.length - 2000);
  }

  /** Return and clear events produced since the last call. */
  drainEvents() { const e = this.pendingEvents; this.pendingEvents = []; return e; }

  /**
   * Subscribe to telemetry snapshots at `hz` (default config.simulation.telemetryHz).
   * Snapshots carry a monotonically increasing `seq`, the tick and a state hash.
   * @returns {() => void} unsubscribe
   */
  subscribe(fn, { hz } = {}) {
    const rate = hz ?? this.config.simulation.telemetryHz ?? 60;
    const every = Math.max(1, Math.round(1 / (rate * this.dt)));
    const sub = { fn, every, last: this.tick };
    this.subscribers.push(sub);
    return () => { this.subscribers = this.subscribers.filter((s) => s !== sub); };
  }

  _maybeNotify() {
    if (!this.subscribers.length) return;
    let snapshot = null;
    for (const s of this.subscribers) {
      if (this.tick - s.last < s.every) continue;
      s.last = this.tick;
      snapshot ??= this.getSnapshot();
      try { s.fn(snapshot); } catch (err) { this._emit({ type: 'subscriber_error', message: String(err?.message ?? err) }); }
    }
    if (snapshot) this.pendingEvents = [];
  }

  // ---------------------------------------------------------------- state access
  getTelemetry() { return buildTelemetry(this); }

  /** Telemetry + render state + state hash: the unit a UI replica consumes to stay in sync. */
  getSnapshot() {
    this.seq++;
    return { seq: this.seq, tick: this.tick, time: this.time, hash: this.stateHash(), telemetry: buildTelemetry(this), render: buildRenderState(this, this.accumulator / this.dt) };
  }

  /** Interpolated body/wheel transforms. alpha defaults to the accumulator fraction (render between ticks). */
  getRenderState(alpha = this.accumulator / this.dt) { return buildRenderState(this, alpha); }

  // ---------------------------------------------------------------- persistence
  getState({ surface = true } = {}) {
    return {
      tick: this.tick, time: this.time, odometer: this.odometer, accumulator: this.accumulator, inputs: { ...this.inputs },
      ambient: { ...this.ambient }, altitude: this.altitude,
      vehicle: this.vehicle.getState(), damage: this.vehicle.damage.getState(),
      runtime: this.runtime ? this.runtime.getState() : null,
      pacenotes: this.pacenotePlayer ? this.pacenotePlayer.getState() : null,
      evolution: this.evolution && surface ? this.evolution.getState() : null,
    };
  }

  setState(s) {
    this.tick = s.tick; this.time = s.time; this.odometer = s.odometer; this.accumulator = s.accumulator;
    this.inputs = { ...s.inputs }; this.altitude = s.altitude;
    this.vehicle.setAmbient(s.ambient.pressure, s.ambient.temperature);
    this.vehicle.setState(s.vehicle);
    this.vehicle.damage.setState(s.damage);
    if (this.runtime && s.runtime) this.runtime.setState(s.runtime);
    if (this.pacenotePlayer && s.pacenotes) this.pacenotePlayer.setState(s.pacenotes);
    if (this.evolution && s.evolution) this.evolution.setState(s.evolution);
    this.pendingEvents = [];
    this._snapshotRender();
    this._lastNotifyTick = this.tick;
    for (const sub of this.subscribers) sub.last = this.tick;
  }

  serialize() { return JSON.stringify(this.getState()); }
  restore(json) { this.setState(typeof json === 'string' ? JSON.parse(json) : json); }

  /** Hash of the complete physical state (the evolution grid is hashed from its raw bytes). */
  stateHash({ surface = true } = {}) {
    const s = this.getState({ surface });
    const evo = surface && s.evolution !== undefined && this.evolution ? this.evolution.stateHash() : '';
    s.evolution = null;
    s.accumulator = 0;          // render-timing remainder, not physical state
    return hashString(JSON.stringify(s)) + evo;
  }
}
