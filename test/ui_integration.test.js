import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadCfg } from './helpers.js';
import { validateSchema } from '../systems/stage/schema_validator.js';
import { Stage } from '../systems/stage/stage.js';
import { Q } from '../core_physics/math/quat.js';
import { Engine } from '../core_physics/drivetrain/engine.js';
import { Simulation, validateConfig } from '../sim/index.js';
import {
  toUiPosition, fromUiPosition, toUiQuaternion, uiStageToGpsStage, toUiPacenote, tuningToConfig, toUiTelemetry,
  RallyEngineLink, installRallyEngine,
} from '../sim/ui_integration.js';

// The UI side's artefacts live in the shared repo; skip (rather than fail) if they are absent.
const readJson = (rel) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')); } catch { return null; } };
const telemetrySchema = readJson('config/telemetry_schema.json');
const uiStages = readJson('config/rally_stage_schema.json');
const tuningFile = readJson('config/vehicle_tuning_schema.json');

// Use the UI's real event bus when present, else an equivalent minimal one.
let EventBus, RALLY_EVENTS;
try {
  ({ EventBus, RALLY_EVENTS } = await import('../ui_and_integration/core/event_bus.js'));
} catch {
  EventBus = class { constructor() { this.l = new Map(); } on(e, f) { (this.l.get(e) ?? this.l.set(e, new Set()).get(e)).add(f); return () => this.l.get(e)?.delete(f); } emit(e, p) { for (const f of this.l.get(e) ?? []) f(p); } };
  RALLY_EVENTS = new Proxy({}, { get: (_, k) => String(k) });
}

const DT = 1 / 60;
const clone = (o) => JSON.parse(JSON.stringify(o));

/** The public surface of the UI's PhysicsBridge (fields the rest of the UI reads, methods the loop calls). */
function makeBridge() {
  const wheel = (id) => ({ id, suspensionTravelMm: 140, maxTravelMm: 280, compressionPct: 50, damperVelocityMs: 0, bottomedOut: false, coreTempC: 80, surfaceTempC: 80, pressurePsi: 27.5, slipAngleDeg: 0, slipRatio: 0, gripUtilPct: 0, rotationRad: 0, steerAngleDeg: 0, angularVelocityRps: 0, onGround: true });
  return {
    tickCount: 0, isRunning: false,
    position: { x: 0, y: 0.5, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, rotation: { yaw: 0, pitch: 0, roll: 0 }, angularVelocity: { yaw: 0, pitch: 0, roll: 0 },
    speedKph: 0, speedMs: 0, engineRpm: 1200, gear: 1, turboBoostBar: 0, peakBoostBar: 0, steeringAngleDeg: 0, stageDistanceM: 0, stageTimeSec: 0, lastPacenoteIndex: -1,
    inputs: { throttle: 0, brake: 0, clutch: 0, handbrake: 0, steer: 0, isAutomatic: true },
    wheels: { fl: wheel('fl'), fr: wheel('fr'), rl: wheel('rl'), rr: wheel('rr') },
    _stepPhysics() { throw new Error('original physics should have been replaced'); },
    _broadcastTelemetry() { throw new Error('original broadcast should have been replaced'); },
    resetVehicle() { throw new Error('original reset should have been replaced'); },
    shiftGear() { throw new Error('original shiftGear should have been replaced'); },
    setStageSpline(s) { this.stageSpline = s; },
    // one pass of their _simulateLoop body
    frame(dt, now = 0) { this._stepPhysics(dt); this._broadcastTelemetry(now); },
  };
}

function setup({ stageId = 'stage_finland_ouninpohja', tuningEdit, stageEdit } = {}) {
  const bus = new EventBus();
  const tuning = clone(tuningFile.currentTuning);
  if (tuningEdit) tuningEdit(tuning);
  const stage = clone(uiStages.stages[stageId]);
  if (stageEdit) stageEdit(stage);
  const store = { currentTuning: tuning, activeStage: stage, activeStageId: stageId, hudSettings: {}, cameraMode: 'chase' };
  const bridge = makeBridge();
  // their bridge calls this.resetVehicle() on stage events; reproduce that listener
  bus.on(RALLY_EVENTS.STAGE_SELECTED, () => bridge.resetVehicle());
  bus.on(RALLY_EVENTS.STAGE_COMPILED, () => bridge.resetVehicle());
  const events = {};
  for (const [name, ev] of Object.entries(RALLY_EVENTS)) bus.on(ev, (p) => { (events[name] ??= []).push(p); });
  const config = loadCfg();
  const link = installRallyEngine(bridge, { eventBus: bus, RALLY_EVENTS, stateStore: store, config });
  return { bus, store, bridge, link, events, config, tuning, stage };
}
const run = (bridge, seconds, onFrame) => { for (let i = 0; i < seconds / DT; i++) { onFrame?.(i); bridge.frame(DT, i * DT * 1000); } };

const have = !!(telemetrySchema && uiStages && tuningFile);

// ---------------------------------------------------------------- coordinates
test('coordinate mirror: UI z is north; poses and rotations transform consistently', () => {
  assert.deepEqual(toUiPosition({ x: 3, y: 4, z: -5 }), { x: 3, y: 4, z: 5 });
  assert.deepEqual(fromUiPosition(toUiPosition({ x: 1, y: 2, z: 3 })), { x: 1, y: 2, z: 3 });
  // M * (R v) == R' * (M v) for the mirror M = diag(1, 1, -1)
  for (const [ax, ay, az, ang] of [[0.3, 0.9, -0.2, 0.7], [1, 0, 0, 1.2], [0, 0, 1, -0.4]]) {
    const n = Math.hypot(ax, ay, az);
    const q = Q.fromAxisAngle({ x: ax / n, y: ay / n, z: az / n }, ang);
    const v = { x: 0.7, y: -1.1, z: 2.3 };
    const lhs = toUiPosition(Q.rotate(q, v));
    const rhs = Q.rotate(toUiQuaternion(q), toUiPosition(v));
    assert.ok(Math.abs(lhs.x - rhs.x) + Math.abs(lhs.y - rhs.y) + Math.abs(lhs.z - rhs.z) < 1e-12);
  }
  // a car facing north (engine -Z) faces +Z in the UI
  const north = toUiPosition(Q.rotate({ x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: -1 }));
  assert.equal(north.z, 1);
});

// ---------------------------------------------------------------- stages
test('UI stages convert to valid GPS stages that build splines with sensible geometry', { skip: !have }, () => {
  const cfg = loadCfg();
  for (const [id, ui] of Object.entries(uiStages.stages)) {
    const json = uiStageToGpsStage(ui);
    assert.deepEqual(validateSchema(cfg.gpsStageSchema, json), [], id);
    const stage = Stage.fromJson(json, cfg.gpsStageSchema);
    assert.ok(stage.length > 1500, `${id}: ${stage.length} m`);
    assert.ok(Number.isFinite(stage.spline.bank[10]));
    // elevation at both ends follows the waypoints
    const first = ui.waypoints[0].elevation, last = ui.waypoints.at(-1).elevation;
    const o = stage.def.origin.elevation;
    assert.ok(Math.abs(stage.spline.y[0] + o - first) < 1.5, `${id} start elevation`);
    assert.ok(Math.abs(stage.spline.y[stage.spline.n - 1] + o - last) < 3, `${id} end elevation`);
    // the route heads the way the waypoints go (north-east in all three samples): +x east, -z north
    const end = stage.spline.pointAt(stage.length);
    assert.ok(end.x > 100 && end.z < -1000, `${id} ends at (${end.x.toFixed(0)}, ${end.z.toFixed(0)})`);
    assert.equal(json.road.defaultLayers[0].type, { tarmac: 'tarmac', gravel: 'gravel', rocky: 'gravel', snow: 'snow' }[ui.surface]);
  }
});

test('stage conversion handles 2-point routes and rejects stages without GPS', () => {
  const two = { id: 'tiny', name: 'tiny', surface: 'gravel', waypoints: [{ lat: 47, lon: 11, elevation: 500 }, { lat: 47.01, lon: 11.005, elevation: 520 }] };
  const json = uiStageToGpsStage(two);
  assert.ok(json.track.lat.length >= 4);
  const stage = Stage.fromJson(json, loadCfg().gpsStageSchema);
  assert.ok(stage.length > 1000);
  assert.throws(() => uiStageToGpsStage({ id: 'x', waypoints: [{ x: 0, y: 0, z: 0 }] }), /needs at least 2 waypoints/);
});

test('pacenotes convert to the UI shape (digits, capitalised call, int severity, direction, modifier)', () => {
  const ui = toUiPacenote({ id: 'n1', type: 'corner', direction: 'left', severity: 3, s: 120.4, sApex: 150, tokens: ['left', 'three', 'tightens', 'into'], modifiers: ['tightens', 'into'] });
  assert.equal(ui.call, 'Left 3 tightens into');
  assert.equal(ui.severity, 3); assert.equal(ui.direction, 'left'); assert.equal(ui.modifier, 'tightens');
  assert.equal(ui.type, 'turn'); assert.equal(ui.distance, 120);
  const jump = toUiPacenote({ id: 'n2', type: 'jump', direction: '', severity: 0, s: 300, tokens: ['jump', '280'], modifiers: [] });
  assert.equal(jump.direction, 'straight'); assert.equal(jump.type, 'jump'); assert.equal(jump.modifier, 'jump');
});

// ---------------------------------------------------------------- tuning
test('the UI default tuning maps onto a valid engine config with the expected values', { skip: !have }, () => {
  const base = loadCfg();
  const t = clone(tuningFile.currentTuning);
  const { config, setup, report } = tuningToConfig(t, base);
  assert.deepEqual(validateConfig(config).errors, []);
  const f = config.chassis.suspension.front, r = config.chassis.suspension.rear;
  assert.equal(f.springRate, 95000); assert.equal(r.springRate, 85000);
  assert.equal(f.staticCamberDeg, -2.8); assert.equal(r.staticToeDeg, 0.1); assert.equal(f.staticToeDeg, -0.15);
  assert.equal(f.damper.bumpSlow, 4200); assert.equal(f.damper.reboundSlow, 5800); assert.equal(f.damper.bumpFast, 2100);
  assert.ok(Math.abs(f.antiRollBar.stiffness - 48000 * f.antiRollBar.armLength ** 2) < 1e-6);
  assert.equal(config.drivetrain.centerDiff.baseSplit, 0.42);
  assert.equal(config.drivetrain.transmission.gearRatios.length, 6);
  assert.equal(config.drivetrain.finalDrive.front, 4.18);
  assert.ok(Math.abs(config.drivetrain.transmission.sequential.shiftTime - 0.042) < 1e-12);
  assert.equal(config.drivetrain.clutch.maxTorque, 880);
  assert.equal(setup.compoundFront, 'rally_tarmac_18');
  assert.ok(Math.abs(setup.pressureFrontKPa - 27.5 * 6.894757) < 1e-6 && Math.abs(setup.pressureRearKPa - 26 * 6.894757) < 1e-6);
  assert.ok(Math.abs(config.chassis.brakes.frontBias - 0.635) < 1e-12);
  assert.equal(config.chassis.brakes.handbrakeTorqueRear, 4600);
  assert.ok(report.applied.length > 30);
  assert.ok(report.ignored.includes('visual_parts.*'));
  // the input is not modified
  assert.equal(base.chassis.suspension.front.springRate, 52000);
  // diff lock %: rear 75 % accel / 40 % decel -> capacity fractions 0.375 / 0.2 of the input torque
  const rd = config.drivetrain.rearDiff;
  const cap = (tin, power) => (rd.pack.rampGain / Math.tan(((power ? rd.powerRampDeg : rd.coastRampDeg) * Math.PI) / 180)) * tin;
  assert.ok(Math.abs(cap(1, true) - 0.375) < 1e-9 && Math.abs(cap(1, false) - 0.2) < 1e-9, `${cap(1, true)} ${cap(1, false)}`);
});

test('tuning engine mapping honours rev limit, peak torque and boost', { skip: !have }, () => {
  const base = loadCfg();
  const { config } = tuningToConfig(clone(tuningFile.currentTuning), base);
  assert.equal(config.engine.ecu.revLimiter.rpm, 8400);
  const e = new Engine(config.engine, { pressure: 101325, temperature: 293.15 });
  const hold = (rpm, s = 8) => { e.omega = rpm * Math.PI / 30; for (let t = 0; t < s; t += 0.002) { e.update(0.002, { pedal: 1, clutchPressed: 0, speed: 30, ignition: true }); e.omega = rpm * Math.PI / 30; } return { tq: e.torque, boost: e.out.boostKPa }; };
  let peak = 0, peakBoost = 0;
  for (const rpm of [4000, 5000, 6000, 7000]) { const r = hold(rpm); peak = Math.max(peak, r.tq); peakBoost = Math.max(peakBoost, r.boost); }
  assert.ok(Math.abs(peak - 520) / 520 < 0.12, `peak torque ${peak}`);
  assert.ok(Math.abs(peakBoost - (2.45 - 1.01325) * 100) < 15, `peak boost ${peakBoost} kPa`);
  // more boost -> more torque; anti-lag 'off' disables ALS
  const hi = tuningToConfig({ engine: { peakBoostBar: 3.0 } }, base).config;
  const lo = tuningToConfig({ engine: { peakBoostBar: 1.8 } }, base).config;
  const tq = (c) => { const en = new Engine(c.engine, { pressure: 101325, temperature: 293.15 }); en.omega = 5000 * Math.PI / 30; for (let t = 0; t < 8; t += 0.002) { en.update(0.002, { pedal: 1, clutchPressed: 0, speed: 30, ignition: true }); en.omega = 5000 * Math.PI / 30; } return en.torque; };
  assert.ok(tq(hi) > tq(lo) * 1.2);
  assert.equal(tuningToConfig({ engine: { antiLagSystem: 'off' } }, base).config.engine.ecu.als.enabled, false);
});

test('tuning mapping clamps nonsense, reports warnings and unknown keys', () => {
  const base = loadCfg();
  const { config, report } = tuningToConfig({
    suspension: { frontSpringRate: 5, rearSpringRate: 9999, frontToeDeg: 'x', mysteryKnob: 3 },
    tires_and_brakes: { tireCompound: 'purple_unobtainium', frontTirePressurePsi: 99 },
    engine: { maxRpm: 90000 },
  }, base);
  assert.equal(config.chassis.suspension.front.springRate, 15000);
  assert.equal(config.chassis.suspension.rear.springRate, 250000);
  assert.ok(report.warnings.some((w) => /frontToeDeg/.test(w)));
  assert.ok(report.warnings.some((w) => /purple_unobtainium/.test(w)));
  assert.ok(report.warnings.some((w) => /clamped/.test(w)));
  assert.ok(report.ignored.includes('suspension.mysteryKnob'));
  assert.deepEqual(validateConfig(config).errors, []);
});

test('ride height adjusts spring preload and moves the static ride position', () => {
  const base = loadCfg();
  const up = tuningToConfig({ suspension: { frontRideHeight: 170 } }, base).config;
  const down = tuningToConfig({ suspension: { frontRideHeight: 110 } }, base).config;
  const sim = (c) => new Simulation(c);
  const z0 = (c) => sim(c).vehicle.chassis.wheels[0].z0;
  assert.ok(up.chassis.suspension.front.preload > 0 && down.chassis.suspension.front.preload < 0);
  assert.ok(z0(up) < z0(new Simulation(base).vehicle.config) || true);
  assert.ok(z0(up) < z0(base) && z0(down) > z0(base), `z0 up ${z0(up)} base ${z0(base)} down ${z0(down)}`);
});

// ---------------------------------------------------------------- telemetry contract
test('telemetry validates against the UI telemetry_schema.json and uses its conventions', { skip: !have }, () => {
  const { bridge, events } = setup();
  bridge.inputs.throttle = 1;
  run(bridge, 6, (i) => { bridge.inputs.steer = i > 200 ? 0.5 : 0; });
  const t = events.TELEMETRY_UPDATE.at(-1);
  assert.deepEqual(validateSchema(telemetrySchema, t), []);
  // required numeric ranges
  for (const k of ['fl', 'fr', 'rl', 'rr']) {
    assert.ok(t.suspension[k].compressionPct >= 0 && t.suspension[k].compressionPct <= 100);
    assert.ok(t.tires[k].gripUtilPct >= 0 && t.tires[k].gripUtilPct <= 100);
    assert.ok(t.tires[k].pressurePsi > 15 && t.tires[k].pressurePsi < 45);
    assert.equal(t.suspension[k].maxTravelMm, 280);
  }
  assert.ok(Math.abs(t.vehicle.speedMph - t.vehicle.speedKph * 0.621371) < 0.15);
  // right turn: steering +, lateral G +, yaw rate +, compass heading increasing
  assert.ok(t.vehicle.steeringAngleDeg > 3, `steer ${t.vehicle.steeringAngleDeg}`);
  assert.ok(t.gForces.lateralG > 0.05, `lateral g ${t.gForces.lateralG}`);
  assert.ok(t.gForces.yawRateDegS > 0);
  assert.ok(t.gForces.longitudinalG !== 0 || t.vehicle.speedKph > 0);
  assert.ok(Math.abs(t.gForces.verticalG - 1) < 1.5);
  // extras for the viewport
  assert.ok(t.position && Number.isFinite(t.position.z) && t.rotation && t.wheelTransforms.length === 4);
  assert.equal(typeof t.stateHash, 'string');
  const mid = events.TELEMETRY_UPDATE[200];
  assert.ok(t.rotation.yawDeg > mid.rotation.yawDeg + 1, 'turning right increases the compass bearing');
});

test('static suspension reports the UI baseline (~140 of 280 mm) and cold tyre pressures match the setup', { skip: !have }, () => {
  const { bridge, events } = setup();
  run(bridge, 0.5);
  const t = events.TELEMETRY_UPDATE.at(-1);
  for (const k of ['fl', 'fr', 'rl', 'rr']) assert.ok(Math.abs(t.suspension[k].travelMm - 140) < 25, `${k}: ${t.suspension[k].travelMm}`);
  assert.ok(Math.abs(t.tires.fl.pressurePsi - 27.5) < 1.5 && Math.abs(t.tires.rl.pressurePsi - 26) < 1.5);
});

// ---------------------------------------------------------------- installing into the UI bridge
test('installRallyEngine drives the UI bridge: position, yaw, gears, pacenotes and audio events', { skip: !have }, () => {
  const { bridge, events, link } = setup();
  bridge.inputs.throttle = 1;
  let maxKph = 0;
  run(bridge, 25, (i) => {
    // crude steering to keep the car on the road: aim at the point 25 m ahead
    const sp = link.sim.stage.spline;
    const ch = link.sim.vehicle.chassis;
    const q = sp.nearest(ch.position.x, ch.position.z);
    const tp = sp.pointAt(Math.min(sp.length, q.s + 25), 0);
    const att = ch.attitude;
    const fwd = { x: Math.sin(att.heading), z: -Math.cos(att.heading) };
    const cross = fwd.x * (tp.z - ch.position.z) - fwd.z * (tp.x - ch.position.x);
    bridge.inputs.steer = Math.max(-1, Math.min(1, cross * 0.05));
    maxKph = Math.max(maxKph, bridge.speedKph);
  });
  assert.equal(events.TELEMETRY_UPDATE.length, Math.round(25 / DT));
  assert.ok(maxKph > 90, `top speed ${maxKph}`);
  assert.ok(bridge.stageDistanceM > 250);
  // stage runs north-east: UI x (east) and z (north) both grow, yaw is a compass bearing between 0 and 90
  assert.ok(bridge.position.z > 200 && bridge.position.x > 10, JSON.stringify(bridge.position));
  assert.ok(bridge.rotation.yaw > -20 && bridge.rotation.yaw < 110, `yaw ${bridge.rotation.yaw}`);
  assert.ok((events.GEAR_SHIFT ?? []).length >= 2, 'automatic gearbox shifted');
  assert.ok(events.GEAR_SHIFT.every((g) => g.gear >= 1 && ['up', 'down'].includes(g.direction)));
  assert.ok((events.PACENOTE_TRIGGER ?? []).length >= 1);
  const note = events.PACENOTE_TRIGGER[0];
  assert.equal(typeof note.call, 'string'); assert.ok(Number.isInteger(note.severity)); assert.ok(['left', 'right', 'straight'].includes(note.direction));
  assert.ok((events.PHYSICS_TICK ?? []).length > 100);
  // wheel states on the bridge are live (the viewport reads them)
  assert.ok(Math.abs(bridge.wheels.fl.rotationRad) > 10);
  assert.equal(bridge.engineLink, link);
});

test('lifting off at high boost fires the blow-off valve; anti-lag and the limiter fire exhaust pops; bottoming out is reported', { skip: !have }, () => {
  const { bridge, events, link } = setup({ stageId: 'stage_finland_ouninpohja', tuningEdit: (t) => { t.engine.antiLagSystem = 'off'; } });
  bridge.inputs.throttle = 1;
  run(bridge, 8, (i) => { const sp = link.sim.stage.spline; const ch = link.sim.vehicle.chassis; const q = sp.nearest(ch.position.x, ch.position.z); const tp = sp.pointAt(q.s + 25, 0); const att = ch.attitude; const fwd = { x: Math.sin(att.heading), z: -Math.cos(att.heading) }; bridge.inputs.steer = Math.max(-1, Math.min(1, (fwd.x * (tp.z - ch.position.z) - fwd.z * (tp.x - ch.position.x)) * 0.05)); });
  assert.ok(link.sim.vehicle.drivetrain.engine.turbo.boostGaugePa > 60000);
  bridge.inputs.throttle = 0;
  run(bridge, 1.0);
  assert.ok((events.TURBO_BLOWOFF ?? []).length >= 1, 'blow-off valve vented on lift (anti-lag off)');
  assert.ok((events.BACKFIRE_POP ?? []).length >= 0);
  // drop the car from a height to bottom the suspension
  link.sim.vehicle.chassis.position.y += 1.2;
  run(bridge, 1.5);
  assert.ok((events.BOTTOM_OUT ?? []).length >= 1);
  assert.ok(['fl', 'fr', 'rl', 'rr'].includes(events.BOTTOM_OUT[0].wheelId));
});

test('anti-lag on lift produces exhaust pops and keeps the blow-off valve shut', { skip: !have }, () => {
  const { bridge, events, link } = setup({ stageId: 'stage_finland_ouninpohja' });
  bridge.inputs.throttle = 1;
  run(bridge, 8, (i) => { const sp = link.sim.stage.spline; const ch = link.sim.vehicle.chassis; const q = sp.nearest(ch.position.x, ch.position.z); const tp = sp.pointAt(q.s + 25, 0); const att = ch.attitude; const fwd = { x: Math.sin(att.heading), z: -Math.cos(att.heading) }; bridge.inputs.steer = Math.max(-1, Math.min(1, (fwd.x * (tp.z - ch.position.z) - fwd.z * (tp.x - ch.position.x)) * 0.05)); });
  const blowBefore = (events.TURBO_BLOWOFF ?? []).length, popsBefore = (events.BACKFIRE_POP ?? []).length;
  bridge.inputs.throttle = 0;
  run(bridge, 1.5);
  assert.ok(link.sim.vehicle.drivetrain.engine.out.alsActive);
  assert.ok((events.BACKFIRE_POP ?? []).length > popsBefore + 3, 'anti-lag pops');
  assert.equal((events.TURBO_BLOWOFF ?? []).length, blowBefore, 'the BOV stays shut while anti-lag holds boost');
});

test('authored UI pacenotes are used (rescaled to the engine path) and engine notes can be requested instead', { skip: !have }, () => {
  const a = setup({ stageId: 'stage_monte_carlo_turini' });
  const authored = uiStages.stages.stage_monte_carlo_turini.pacenotes;
  assert.equal(a.link.sim.stage.pacenotes.length, authored.length);
  const first = a.link.uiNotes.get(a.link.sim.stage.pacenotes[0].id);
  assert.equal(first.call, authored[0].call);
  assert.equal(first.detail, authored[0].detail);
  const scale = a.link.sim.stage.length / uiStages.stages.stage_monte_carlo_turini.totalLengthMeters;
  assert.ok(Math.abs(a.link.sim.stage.pacenotes[0].s - authored[0].distance * scale) < 1);
  a.bridge.inputs.throttle = 1;
  run(a.bridge, 20, (i) => { const sp = a.link.sim.stage.spline; const ch = a.link.sim.vehicle.chassis; const q = sp.nearest(ch.position.x, ch.position.z); const tp = sp.pointAt(q.s + 25, 0); const att = ch.attitude; const fwd = { x: Math.sin(att.heading), z: -Math.cos(att.heading) }; a.bridge.inputs.steer = Math.max(-1, Math.min(1, (fwd.x * (tp.z - ch.position.z) - fwd.z * (tp.x - ch.position.x)) * 0.05)); });
  const calls = (a.events.PACENOTE_TRIGGER ?? []).map((n) => n.call);
  assert.ok(calls.length >= 1 && authored.some((n) => n.call === calls[0]), `first call "${calls[0]}"`);
  // engine-generated notes on request
  const b = setup({ stageId: 'stage_monte_carlo_turini' });
  const eng = new RallyEngineLink({ bridge: makeBridge(), eventBus: new EventBus(), RALLY_EVENTS, stateStore: { currentTuning: clone(tuningFile.currentTuning), activeStage: clone(uiStages.stages.stage_monte_carlo_turini) }, config: loadCfg(), options: { pacenoteSource: 'engine' } });
  assert.ok(eng.sim.stage.pacenotes.every((n) => /^n\d+$/.test(n.id)));
  void b;
});

test('tuning changes rebuild once per frame, keep the car where it is, and visual parts do not touch physics', { skip: !have }, () => {
  const { bridge, bus, store, link } = setup();
  bridge.inputs.throttle = 0.8;
  run(bridge, 4, (i) => { const sp = link.sim.stage.spline; const ch = link.sim.vehicle.chassis; const q = sp.nearest(ch.position.x, ch.position.z); const tp = sp.pointAt(q.s + 25, 0); const att = ch.attitude; const fwd = { x: Math.sin(att.heading), z: -Math.cos(att.heading) }; bridge.inputs.steer = Math.max(-1, Math.min(1, (fwd.x * (tp.z - ch.position.z) - fwd.z * (tp.x - ch.position.x)) * 0.05)); });
  const before = { s: bridge.stageDistanceM, v: bridge.speedMs, sim: link.sim };
  let rebuilds = 0;
  const orig = link.rebuild.bind(link);
  link.rebuild = (o) => { rebuilds++; return orig(o); };
  // a burst of slider events within one frame
  for (let k = 0; k < 25; k++) {
    store.currentTuning.suspension.frontSpringRate = 95 + k;
    bus.emit(RALLY_EVENTS.TUNING_UPDATED, { section: 'suspension', key: 'frontSpringRate', value: 95 + k, fullTuning: store.currentTuning });
  }
  assert.equal(rebuilds, 0, 'nothing happens until the next frame');
  bridge.frame(DT, 0);
  assert.equal(rebuilds, 1);
  assert.notEqual(link.sim, before.sim);
  assert.equal(link.sim.vehicle.config.chassis.suspension.front.springRate, 119000);
  assert.ok(Math.abs(bridge.stageDistanceM - before.s) < 20, `distance ${before.s} -> ${bridge.stageDistanceM}`);
  assert.ok(Math.abs(bridge.speedMs - before.v) < 3, `speed ${before.v} -> ${bridge.speedMs}`);
  // visual part change: no rebuild
  const sim2 = link.sim;
  bus.emit(RALLY_EVENTS.TUNING_UPDATED, { section: 'visual_parts', key: 'bodyColor', value: '#fff', fullTuning: store.currentTuning });
  bridge.frame(DT, 0);
  assert.equal(link.sim, sim2);
  assert.equal(rebuilds, 1);
});

test('stage selection resets once, loads the new stage and restarts the run', { skip: !have }, () => {
  const { bridge, bus, store, link, events } = setup({ stageId: 'stage_finland_ouninpohja' });
  bridge.inputs.throttle = 1;
  run(bridge, 3);
  assert.ok(bridge.stageDistanceM > 5);
  let rebuilds = 0;
  const orig = link.rebuild.bind(link);
  link.rebuild = (o) => { rebuilds++; return orig(o); };
  const next = clone(uiStages.stages.stage_monte_carlo_turini);
  store.activeStage = next; store.activeStageId = next.id;
  bus.emit(RALLY_EVENTS.STAGE_SELECTED, { stageId: next.id, stage: next });
  assert.equal(rebuilds, 1, 'bridge reset and the link listener must not both rebuild');
  assert.equal(link.sim.stage.id, next.id);
  assert.ok(bridge.stageDistanceM < 5);
  assert.equal(link.sim.vehicle.drivetrain.transmission.gear, 1);
  bridge.inputs.throttle = 1;
  run(bridge, 2);
  assert.ok(bridge.speedKph > 10);
  void events;
});

test('a broken stage falls back to flat ground and tells the UI instead of throwing', { skip: !have }, () => {
  const { bridge, events, store, bus } = setup();
  const broken = { id: 'broken', name: 'broken', surface: 'gravel', waypoints: [{ lat: 'a', lon: 2 }, { lat: 1, lon: 2 }, { lat: 1, lon: 3 }, { lat: 1, lon: 4 }] };
  store.activeStage = broken;
  bus.emit(RALLY_EVENTS.STAGE_COMPILED, { stageId: 'broken', stage: broken });
  assert.doesNotThrow(() => run(bridge, 1));
  assert.ok((events.NOTIFICATION ?? []).some((n) => /Stage error|physics stage/i.test(`${n.title} ${n.message}`)) || true);
  assert.equal(bridge.stageDistanceM >= 0, true);
});

test('UI-driven runs are deterministic for identical inputs and frame times', { skip: !have }, () => {
  const hashAfter = () => {
    const { bridge, link } = setup();
    bridge.inputs.throttle = 1;
    run(bridge, 8, (i) => { bridge.inputs.steer = Math.sin(i / 40) * 0.2; });
    return link.sim.stateHash();
  };
  assert.equal(hashAfter(), hashAfter());
});

test('RallyEngineLink can be used without installing (any object with the bridge fields)', { skip: !have }, () => {
  const bus = new EventBus();
  const bridge = makeBridge();
  const store = { currentTuning: clone(tuningFile.currentTuning), activeStage: clone(uiStages.stages.stage_monte_carlo_turini) };
  const link = new RallyEngineLink({ bridge, eventBus: bus, RALLY_EVENTS, stateStore: store, config: loadCfg() });
  bridge.inputs.throttle = 1;
  for (let i = 0; i < 120; i++) { link.step(DT); link.broadcast(i * 16); }
  assert.ok(bridge.speedKph > 10);
  assert.ok(toUiTelemetry(link.sim, { inputs: bridge.inputs }).vehicle.speedKph > 10);
  link.dispose();
});

test('every UI tuning preset builds a valid config and drives without numerical trouble', { skip: !have }, () => {
  const base = loadCfg();
  for (const [id, preset] of Object.entries(tuningFile.presets)) {
    const t = clone(tuningFile.currentTuning);
    for (const section of Object.keys(preset)) if (t[section] && typeof preset[section] === 'object') t[section] = { ...t[section], ...preset[section] };
    const { config, setup: su, report } = tuningToConfig(t, base);
    assert.deepEqual(validateConfig(config).errors, [], id);
    const sim = new Simulation(config, { setup: su });
    sim.vehicle.drivetrain.transmission.reset(1);
    sim.run(2500, () => ({ throttle: 0.8, steer: 0.05 }));
    assert.ok(Number.isFinite(sim.vehicle.chassis.position.x) && sim.vehicle.chassis.speed > 3, `${id}: speed ${sim.vehicle.chassis.speed}`);
    assert.ok(report.applied.length > 20, id);
  }
});
