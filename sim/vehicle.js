import { Drivetrain } from '../core_physics/drivetrain/drivetrain.js';
import { Chassis } from '../core_physics/chassis/chassis.js';
import { BrakeSystem } from '../systems/damage/brake_wear.js';

/**
 * Complete vehicle: powertrain + chassis + brakes (+ damage and surface evolution when attached).
 * One `step(dt, input, env)` advances everything by exactly dt and returns nothing; read the
 * state through `chassis`, `drivetrain`, etc. or via the telemetry builder.
 */
export class Vehicle {
  constructor(config, surfaces, ambient, terrain, setup = {}) {
    this.config = config;
    this.surfacesLib = surfaces;
    this.ambient = ambient;
    this.terrain = terrain;
    this.chassis = new Chassis(config.chassis, config.tires.compounds, surfaces, ambient, setup);
    this.drivetrain = new Drivetrain(config.drivetrain, config.engine, ambient);
    this.brakes = new BrakeSystem(config.chassis.brakes, config.damage.brakes, ambient.temperature);
    this.damage = null;            // attached by Simulation
    this.evolution = null;         // attached by Simulation
    this._prev = { shiftUp: false, shiftDown: false, gear: null };
    this.lastInput = {};
    this._wheelStates = [0, 1, 2, 3].map(() => ({ omega: 0, inertia: 1, resist: 0 }));
    this._brakeOmega = [0, 0, 0, 0];
  }

  step(dt, input, env = {}) {
    const ch = this.chassis, dr = this.drivetrain;
    this.lastInput = input;

    // one-shot gearbox requests from level inputs
    if (input.shiftUp && !this._prev.shiftUp) dr.shiftUp();
    if (input.shiftDown && !this._prev.shiftDown) dr.shiftDown();
    if (input.gear !== undefined && input.gear !== null && input.gear !== this._prev.gear) dr.selectGear(input.gear);
    this._prev.shiftUp = !!input.shiftUp; this._prev.shiftDown = !!input.shiftDown; this._prev.gear = input.gear ?? null;

    // 1. forces from the current state
    ch.computeForces(dt, { steer: input.steer ?? 0 }, this.terrain, env);

    // 2. brakes
    for (let i = 0; i < 4; i++) this._brakeOmega[i] = ch.wheels[i].omega;
    const brakeT = this.brakes.update(dt, {
      brake: input.brake ?? 0, handbrake: input.handbrake ?? 0, bias: input.brakeBias,
      omega: this._brakeOmega, speed: ch.speed,
    });

    // 3. drivetrain
    const ws = this._wheelStates;
    for (let i = 0; i < 4; i++) {
      const w = ch.wheels[i];
      ws[i].omega = w.omega;
      ws[i].inertia = w.inertia;
      ws[i].resist = w.resist - brakeT[i] * Math.tanh(w.omega / 1.0);
    }
    const dmg = this.damage;
    const drInput = dmg && dmg.engineSeized ? { ...input, ignition: false } : input;
    const driveT = dr.step(dt, drInput, ws, {
      speed: ch.forwardSpeed,
      intercoolerBlockage: dmg ? dmg.intercoolerBlockage : 0,
      powerScale: dmg ? dmg.enginePowerScale : 1,
      boostLeakScale: dmg ? dmg.boostLeakScale : 1,
      coolantK: dmg ? dmg.coolantK : 360,
    });

    // 4. integrate
    ch.integrate(dt, driveT, brakeT);
    ch.assertFinite(`(after integrate)`);

    // 5. wear / damage / surface evolution
    if (dmg) dmg.update(dt, this, env);
    if (this.evolution) this.evolution.update(dt, this);
  }

  /** Update ambient conditions (altitude / weather) in every component that uses them. */
  setAmbient(pressure, temperature) {
    this.ambient.pressure = pressure; this.ambient.temperature = temperature;
    const eng = this.drivetrain.engine;
    eng.ambient.pressure = pressure; eng.ambient.temperature = temperature;
    eng.turbo.ambient.pressure = pressure; eng.turbo.ambient.temperature = temperature;
    this.chassis.ambient.pressure = pressure; this.chassis.ambient.temperature = temperature;
    for (const w of this.chassis.wheels) w.tire.ambientK = temperature;
  }

  /** Reset dynamic state; keep configuration. */
  resetDrivetrain() { this.drivetrain.reset(); this.brakes.reset(); }

  getState() {
    return {
      chassis: this.chassis.getState(), drivetrain: this.drivetrain.getState(), brakes: this.brakes.getState(),
      prev: { ...this._prev },
    };
  }
  setState(s) {
    this.chassis.setState(s.chassis); this.drivetrain.setState(s.drivetrain); this.brakes.setState(s.brakes);
    this._prev = { ...s.prev };
  }
}

