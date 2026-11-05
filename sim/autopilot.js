import { clamp } from '../core_physics/math/util.js';

/**
 * Reference driver: pure-pursuit steering along the stage centreline (+ optional lateral offset),
 * curvature-based speed planning with a braking-distance constraint, rpm-based shifting.
 * Used by tests, demos and as a template for AI / ghost cars. Produces the same input object a
 * human controller would give `Simulation.setInputs`.
 */
export class Autopilot {
  /**
   * @param {object} [o]
   * @param {number} [o.lateralAccel] design lateral acceleration [m/s^2]
   * @param {number} [o.brakeDecel] design braking deceleration [m/s^2]
   * @param {number} [o.maxSpeed] speed cap [m/s]
   * @param {number} [o.upshiftRpm] @param {number} [o.downshiftRpm]
   * @param {number} [o.lineOffset] lateral offset from the centreline [m]
   */
  constructor(o = {}) {
    this.aLat = o.lateralAccel ?? 6;
    this.aBrake = o.brakeDecel ?? 6;
    this.vMax = o.maxSpeed ?? 60;
    this.upRpm = o.upshiftRpm ?? 6500;
    this.downRpm = o.downshiftRpm ?? 3000;
    this.lineOffset = o.lineOffset ?? 0;
    this.lookMin = o.lookaheadMin ?? 8;
    this.lookGain = o.lookaheadGain ?? 0.55;
    this.speedGain = o.speedGain ?? 0.5;
    this.launch = o.launch ?? true;
    this.slipTarget = o.brakeSlipTarget ?? 0.12;
    this.lastShift = -1;
  }

  /** @param {import('./simulation.js').Simulation} sim @returns {object} inputs */
  compute(sim) {
    const ch = sim.vehicle.chassis, dr = sim.vehicle.drivetrain, sp = sim.stage?.spline;
    if (!sp) throw new Error('Autopilot needs a stage');
    const speed = Math.max(0, ch.forwardSpeed);
    const att = ch.attitude;
    const fwd = { x: Math.sin(att.heading), z: -Math.cos(att.heading) };
    const right = { x: -fwd.z, z: fwd.x };
    const s = sim.runtime.s;

    // steering: pure pursuit
    const Ld = Math.max(this.lookMin, speed * this.lookGain);
    const tp = sp.pointAt(Math.min(sp.length, s + Ld), this.lineOffset);
    const dx = tp.x - ch.position.x, dz = tp.z - ch.position.z;
    const dist = Math.hypot(dx, dz) || 1;
    const sinA = (dx * right.x + dz * right.z) / dist;          // + = target on the right
    const delta = Math.atan((2 * ch.wheelbase * sinA) / dist);
    const lockRad = (sim.config.chassis.steering.maxWheelAngleDeg * Math.PI) / 180;
    const lockScale = 1 - sim.config.chassis.steering.speedReduction * clamp(speed / sim.config.chassis.steering.speedReductionRef, 0, 1);
    const steer = clamp(delta / (lockRad * lockScale), -1, 1);

    // speed plan: v^2 <= v_allow^2 + 2 a d  for every point ahead
    let vLimit = this.vMax;
    const horizon = Math.min(sp.length - s, 25 + (speed * speed) / (2 * this.aBrake) * 1.3);
    const step = 4;
    for (let d = 0; d <= horizon; d += step) {
      const f = sp.sampleAt(Math.min(sp.length, s + d));
      // peak of the lightly and heavily smoothed curvature, looked at over a few metres either side
      let k = 1e-4;
      for (let o = -3; o <= 3; o++) {
        const j = Math.max(0, Math.min(sp.n - 1, f.index + o));
        k = Math.max(k, Math.abs(sp.kappa[j]), Math.abs(sp.kappaRobust[j]));
      }
      const vAllow = Math.min(this.vMax, Math.sqrt(this.aLat / k));
      vLimit = Math.min(vLimit, Math.sqrt(vAllow * vAllow + 2 * this.aBrake * d));
    }
    if (sp.length - s < 40) vLimit = Math.min(vLimit, 10);

    const err = vLimit - speed;
    let throttle = clamp(err * this.speedGain, 0, 1);
    let brake = clamp(-err * 0.4 - 0.05, 0, 1);
    if (err > -0.5) brake = 0;
    // threshold braking: back off when any wheel approaches lock-up (slip ratio is negative under braking)
    if (brake > 0) {
      let worst = 0;
      for (const w of ch.wheels) worst = Math.max(worst, -w.tire.out.kappa);
      brake *= clamp(1 - (worst - this.slipTarget) / this.slipTarget, 0.15, 1);
    }

    // gearbox
    const tr = dr.transmission, rpm = dr.engine.rpm;
    let shiftUp = false, shiftDown = false, gear = null;
    if (tr.gear === 0) gear = 1;
    else if (!tr.shifting && sim.time - this.lastShift > 0.35) {
      if (rpm > this.upRpm && tr.gear < tr.gearCount && throttle > 0.3) { shiftUp = true; this.lastShift = sim.time; }
      else if (rpm < this.downRpm && tr.gear > 1 && speed > 2) { shiftDown = true; this.lastShift = sim.time; }
    }
    const standing = speed < 1.5 && sim.time < 3;
    return {
      throttle, brake, steer, shiftUp, shiftDown, gear, alsSwitch: true,
      launchSwitch: this.launch && standing, clutch: standing && this.launch && throttle > 0.9 && sim.time < 0.8 ? 1 : null,
    };
  }
}
