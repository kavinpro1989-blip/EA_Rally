/**
 * One axle's worth of suspension parameters plus the force laws for a single corner.
 *
 * Coordinate: z = wheel travel measured as COMPRESSION from full droop [m]
 * (0 = fully extended at the droop stop, `travel` = fully compressed). zdot > 0 is bump.
 * All rates are expressed at the wheel (spring rate * motionRatio^2, damper c * MR^2).
 *
 * Force F_s returned is the force the suspension exerts on the BODY (positive = pushes the body up):
 *   F_s = F_spring(z) + F_damper(zdot) + F_bumpstop(z) + F_strap(z)
 *
 * - Main spring with preload force (N at full droop).
 * - Helper / tender spring in SERIES with the main spring that coil-binds after `bindTravel`
 *   of its own deflection: soft initial rate, then the main spring takes over (continuous force).
 * - Dampers: four-regime curves - slow/fast bump and slow/fast rebound, separated by the
 *   configurable knee velocities.
 * - Progressive bump stop and a stiff droop strap / end stop.
 */
export class AxleSuspension {
  /** @param {object} cfg chassis.json `suspension.front|rear` */
  constructor(cfg) {
    this.cfg = cfg;
    const mr2 = cfg.motionRatio * cfg.motionRatio;
    this.travel = cfg.travel;
    this.kMain = cfg.springRate * mr2;
    this.preload = cfg.preload ?? 0;
    const h = cfg.helper;
    this.helper = h && h.rate > 0 ? { k: h.rate * mr2, bind: h.bindTravel } : null;
    if (this.helper) this.zBind = this.helper.bind * (1 + this.helper.k / this.kMain);
    const d = cfg.damper;
    this.dmp = {
      cBumpSlow: d.bumpSlow * mr2, cBumpFast: d.bumpFast * mr2,
      cReboundSlow: d.reboundSlow * mr2, cReboundFast: d.reboundFast * mr2,
      vKneeBump: d.kneeVelocityBump, vKneeRebound: d.kneeVelocityRebound,
    };
    this.bump = cfg.bumpStop;
    this.kStrap = cfg.strapStiffness ?? 8e5;
    this.cStrap = cfg.strapDamping ?? 4000;
    this.kEnd = cfg.endStopStiffness ?? 2e6;
    this.cEnd = cfg.endStopDamping ?? 15000;
    this.arb = cfg.antiRollBar;
    this.camberGain = ((cfg.camberGainDegPerM ?? 0) * Math.PI) / 180;
    this.toeGain = ((cfg.toeBumpSteerDegPerM ?? 0) * Math.PI) / 180;
    this.staticCamber = ((cfg.staticCamberDeg ?? 0) * Math.PI) / 180;
    this.staticToe = ((cfg.staticToeDeg ?? 0) * Math.PI) / 180;
  }

  /** Spring force from the main + helper stack at compression z (no preload shift below zero). */
  springForce(z) {
    const zc = Math.max(z, 0);
    let f;
    if (this.helper) {
      if (zc < this.zBind) {
        const ks = (this.kMain * this.helper.k) / (this.kMain + this.helper.k);
        f = ks * zc;
      } else f = this.kMain * (zc - this.helper.bind);
    } else f = this.kMain * zc;
    // a (possibly negative) preload shifts the ride height; the spring itself can never pull
    return Math.max(0, this.preload + f);
  }

  /** Local spring rate dF/dz [N/m] at z (for natural-frequency reporting / analysis). */
  springRate(z) {
    if (!this.helper) return this.kMain;
    return z < this.zBind ? (this.kMain * this.helper.k) / (this.kMain + this.helper.k) : this.kMain;
  }

  damperForce(v, health = 1) {
    const d = this.dmp;
    let f;
    if (v >= 0) {
      f = d.cBumpSlow * Math.min(v, d.vKneeBump) + d.cBumpFast * Math.max(0, v - d.vKneeBump);
    } else {
      const a = -v;
      f = -(d.cReboundSlow * Math.min(a, d.vKneeRebound) + d.cReboundFast * Math.max(0, a - d.vKneeRebound));
    }
    return f * health;
  }

  /** Progressive bump stop; `v` (compression velocity) adds hysteresis damping on the way in, like a polyurethane stop. */
  bumpStopForce(z, v = 0) {
    const b = this.bump;
    const x = z - (this.travel - b.length);
    if (x <= 0) return 0;
    return b.rate * x + b.progressive * x * x + (v > 0 ? (b.damping ?? 0) * v : 0);
  }

  endStopForce(z, v = 0) {
    return z > this.travel ? this.kEnd * (z - this.travel) + (v > 0 ? this.cEnd * v : 0) : 0;
  }

  strapForce(z, v) {
    if (z >= 0) return 0;
    return this.kStrap * z + (v < 0 ? this.cStrap * v : 0);
  }

  /**
   * Total force the suspension applies to the body at one corner (excluding anti-roll bar).
   * @returns {{spring:number,damper:number,bump:number,total:number}}
   */
  cornerForce(z, v, damperHealth = 1, out = {}) {
    const spring = this.springForce(z);
    const damper = this.damperForce(v, damperHealth);
    const bump = this.bumpStopForce(z, v) + this.endStopForce(z, v) + this.strapForce(z, v);
    out.spring = spring; out.damper = damper; out.bump = bump; out.total = spring + damper + bump;
    return out;
  }

  /** Anti-roll bar force on the LEFT wheel (the right wheel receives the negative). */
  arbForce(zLeft, zRight) {
    const a = this.arb;
    if (!a || !(a.stiffness > 0)) return 0;
    return (a.stiffness * (zLeft - zRight)) / (a.armLength * a.armLength);
  }

  /** Compression that supports static load `load` [N] on this corner's spring (bisection, monotonic). */
  staticCompression(load) {
    if (load <= this.springForce(0)) return 0;
    let lo = 0, hi = this.travel;
    for (let i = 0; i < 60; i++) {
      const mid = 0.5 * (lo + hi);
      if (this.springForce(mid) + this.bumpStopForce(mid) < load) lo = mid; else hi = mid;
    }
    return 0.5 * (lo + hi);
  }

  camberAt(z, z0) { return this.staticCamber + this.camberGain * (z - z0); }
  toeAt(z, z0) { return this.staticToe + this.toeGain * (z - z0); }
}
