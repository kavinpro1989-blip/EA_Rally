import { Table1D } from '../../core_physics/math/tables.js';
import { clamp, clamp01, lag, smoothstep } from '../../core_physics/math/util.js';

const SIGMA = 5.670374419e-8;

/**
 * Four-corner brake system with thermal fade.
 *
 *  - disc temperature: heat capacity, speed-dependent convection and T^4 radiation
 *  - pad friction vs temperature (cold bite, plateau, fade) from a lookup table
 *  - brake-fluid temperature lags the disc; above the boiling point the pedal goes soft
 *  - pad wear from dissipated energy; worn pads lose torque capacity
 *
 * Torque magnitude is returned; the chassis applies it opposing wheel rotation.
 */
export class BrakeSystem {
  /**
   * @param {object} brakeCfg chassis.json `brakes` (torque capacities, bias)
   * @param {object} thermalCfg damage.json `brakes` (thermal & wear parameters)
   * @param {number} ambientK
   */
  constructor(brakeCfg, thermalCfg, ambientK) {
    this.cfg = brakeCfg;
    this.t = thermalCfg;
    this.ambientK = ambientK;
    this.padMu = new Table1D(thermalCfg.padFrictionByTemp, { smooth: true, label: 'brakes.padFrictionByTemp' });
    this.reset();
  }

  reset() {
    const a = this.ambientK;
    this.pedal = 0;
    this.discK = [a, a, a, a];
    this.fluidK = [a, a, a, a];
    this.padWear = [0, 0, 0, 0];
    this.torque = [0, 0, 0, 0];
    this.fade = [1, 1, 1, 1];        // overall effectiveness 0..1 relative to a cold-healthy brake
    this.health = [1, 1, 1, 1];      // external multiplier (damage)
    this.power = [0, 0, 0, 0];
  }

  /**
   * @param {number} dt
   * @param {object} u { brake 0..1, handbrake 0..1, bias (front fraction, optional), omega[4], speed }
   * @returns {number[]} brake torque magnitude per wheel [N m]
   */
  update(dt, u) {
    const c = this.cfg, t = this.t;
    this.pedal = lag(this.pedal, clamp01(u.brake), t.pedalResponseTime, dt);
    const b0 = c.frontBias;
    const b = clamp(u.bias ?? b0, 0.3, 0.85);
    const frontScale = b / b0, rearScale = (1 - b) / (1 - b0);
    const maxT = [
      (c.maxTorqueFront / 2) * frontScale, (c.maxTorqueFront / 2) * frontScale,
      (c.maxTorqueRear / 2) * rearScale, (c.maxTorqueRear / 2) * rearScale,
    ];
    const hb = clamp01(u.handbrake ?? 0) * c.handbrakeTorqueRear / 2;
    const v = Math.max(u.speed, 0);
    for (let i = 0; i < 4; i++) {
      const front = i < 2;
      const wearLoss = 0.5 * smoothstep(0.8, 1.0, this.padWear[i]);
      const muRel = this.padMu.eval(this.discK[i]);
      const fluid = 1 - t.fluidFade * smoothstep(t.fluidBoilK - 20, t.fluidBoilK + 25, this.fluidK[i]);
      this.fade[i] = clamp01(muRel * fluid * (1 - wearLoss)) * this.health[i];
      const demand = this.pedal * maxT[i] + (front ? 0 : hb);
      const torque = demand * this.fade[i];
      this.torque[i] = torque;
      const p = torque * Math.abs(u.omega[i]);
      this.power[i] = p;

      const m = front ? t.discMass.front : t.discMass.rear;
      const C = m * t.discSpecificHeat;
      const T = this.discK[i];
      const conv = (t.coolingBase + t.coolingSpeed * Math.pow(v, 0.8)) * (T - this.ambientK);
      const rad = t.radiativeArea * SIGMA * (Math.pow(T, 4) - Math.pow(this.ambientK, 4));
      this.discK[i] = clamp(T + (dt * (p - conv - rad)) / C, this.ambientK - 5, 1400);
      const fTarget = this.ambientK + t.fluidCoupling * (this.discK[i] - this.ambientK);
      this.fluidK[i] = lag(this.fluidK[i], fTarget, t.fluidTimeConstant, dt);
      this.padWear[i] = clamp01(this.padWear[i] + p * dt * t.padWearPerJoule);
    }
    return this.torque;
  }

  getState() {
    return {
      pedal: this.pedal, discK: this.discK.slice(), fluidK: this.fluidK.slice(), padWear: this.padWear.slice(),
      torque: this.torque.slice(), fade: this.fade.slice(), health: this.health.slice(), power: this.power.slice(),
    };
  }
  setState(s) { for (const k of Object.keys(s)) this[k] = Array.isArray(s[k]) ? s[k].slice() : s[k]; }
}
