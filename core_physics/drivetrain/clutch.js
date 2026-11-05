import { clamp, clamp01, lag, smoothstep } from '../math/util.js';

/**
 * Dry friction clutch with thermal fade and wear.
 *
 * Engine and transmission input are coupled with an *impulse-based stick/slip* solve:
 * the torque that would make the slip speed exactly zero at the end of the step is
 * computed from both inertias and the external torques (deadbeat), then clamped to the
 * pack capacity. Below capacity the clutch is locked, at capacity it slips with the
 * kinetic torque. This is unconditionally stable regardless of clutch stiffness / time step.
 */
export class Clutch {
  /** @param {object} cfg drivetrain.json `clutch` section */
  constructor(cfg) {
    this.cfg = cfg;
    this.ambientK = 293.15;
    this.reset();
  }

  reset() {
    this.pedal = 1;            // actuator-filtered pedal, 1 = fully pressed (disengaged)
    this.wear = 0;             // 0 new .. 1 fully worn
    this.temperatureK = this.ambientK;
    this.slipping = false;
    this.torque = 0;
    this.slipSpeed = 0;
    this.slipPower = 0;
    this.capacityValue = 0;
  }

  /** Static torque capacity [N m] for the current pedal position, wear and temperature. */
  capacity() {
    const c = this.cfg;
    const e = 1 - this.pedal;
    const shift = this.wear * c.wear.biteShift;
    const bite = smoothstep(c.biteStart + shift, c.biteEnd + shift, e);
    const t = c.thermal;
    const fade = 1 - (1 - t.fadeMin) * smoothstep(t.fadeStartK, t.fadeEndK, this.temperatureK);
    return c.maxTorque * bite * (1 - c.wear.maxCapacityLoss * this.wear) * fade;
  }

  /**
   * @param {number} dt
   * @param {object} p
   * @param {number} p.pedal      commanded pedal 0 (released) .. 1 (pressed)
   * @param {number} p.omegaEngine [rad/s]  @param {number} p.omegaInput transmission input speed [rad/s]
   * @param {number} p.engineInertia [kg m^2]  @param {number} p.inputInertia reflected downstream inertia [kg m^2]
   * @param {number} p.engineTorque net engine torque [N m]  @param {number} p.loadTorque resisting torque reflected to the input shaft [N m]
   * @param {boolean} p.connected gearbox has a gear engaged
   * @returns {number} torque transmitted from engine to transmission [N m]
   */
  solve(dt, p) {
    const c = this.cfg;
    this.pedal = lag(this.pedal, clamp01(p.pedal), c.pedalResponseTime, dt);
    const capS = p.connected ? this.capacity() : 0;
    this.capacityValue = capS;
    const delta = p.omegaEngine - p.omegaInput;
    let torque = 0;
    if (capS > 1e-6) {
      const gain = 1 / p.engineInertia + 1 / p.inputInertia;
      // Torque that nulls the slip speed after this step given the other torques acting on both shafts
      const stick = (delta / dt + p.engineTorque / p.engineInertia + p.loadTorque / p.inputInertia) / gain;
      if (Math.abs(stick) <= capS) {
        torque = stick; this.slipping = false;
      } else {
        const dir = stick >= 0 ? 1 : -1;
        torque = dir * capS * c.kineticRatio; this.slipping = true;
      }
    } else {
      this.slipping = Math.abs(delta) > 1;
    }
    this.torque = torque;
    this.slipSpeed = delta;
    this.slipPower = this.slipping ? Math.abs(torque * delta) : 0;

    // Thermal + wear bookkeeping
    const t = c.thermal;
    const cooling = (t.coolingCoeff + t.coolingPerRadS * Math.abs(p.omegaEngine)) * (this.temperatureK - this.ambientK);
    this.temperatureK += (dt * (this.slipPower - cooling)) / t.heatCapacity;
    this.temperatureK = clamp(this.temperatureK, this.ambientK, 1300);
    if (this.slipping) {
      const hotFactor = 1 + 2 * smoothstep(t.fadeStartK, t.fadeEndK, this.temperatureK);
      this.wear = clamp01(this.wear + this.slipPower * dt * c.wear.perJoule * hotFactor);
    }
    return torque;
  }

  getState() {
    return {
      pedal: this.pedal, wear: this.wear, temperatureK: this.temperatureK, slipping: this.slipping,
      torque: this.torque, slipSpeed: this.slipSpeed, slipPower: this.slipPower, capacityValue: this.capacityValue,
    };
  }
  setState(s) { Object.assign(this, s); }
}
