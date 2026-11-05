import { clamp } from '../math/util.js';

/**
 * Torque-biasing differential / coupling between two output shafts A and B.
 *
 *   T_A = s_A * T_in - T_c        T_B = s_B * T_in + T_c       (s_A + s_B = 1)
 *
 * T_c is the coupling torque taken from the faster shaft and given to the slower one.
 * Types:
 *   open     : T_c = 0
 *   locked   : spool, T_c is whatever keeps the shafts at the same speed
 *   lsd      : multi-plate clutch pack (Salisbury/ramp style). Capacity
 *                 T_cap = preload + lock_cmd*maxLock + |T_in| * K / tan(theta)
 *              theta is the ramp face angle measured from the clutch plane normal, i.e. axial
 *              thrust = tangential force / tan(theta): 45 deg = 1:1, smaller angle = more lock.
 *              theta_power applies when the input torque drives the shafts, theta_coast on overrun.
 *              K = mu * n * r_clutch / (2 * r_ramp) unless `pack.rampGain` is given.
 *   viscous  : T_c = c * (w_A - w_B), saturated at `viscous.maxTorque`
 *
 * For every type the coupling torque is limited by the deadbeat "stick" torque, i.e. the
 * torque that would equalise the shaft speeds exactly at the end of the step. That makes
 * locking/unlocking unconditionally stable and removes the usual stiff-ODE tuning.
 */
export class Differential {
  /** @param {object} cfg a diff config block */
  constructor(cfg) {
    this.cfg = cfg;
    this.type = cfg.type ?? 'open';
    this.preload = cfg.preload ?? 0;
    this.maxLock = cfg.maxLockTorque ?? 0;
    const pk = cfg.pack ?? {};
    this.rampGain = pk.rampGain ?? (pk.mu && pk.surfaces && pk.meanRadius && pk.rampRadius
      ? (pk.mu * pk.surfaces * pk.meanRadius) / (2 * pk.rampRadius) : 0);
    this.tanPower = Math.tan(((cfg.powerRampDeg ?? 45) * Math.PI) / 180);
    this.tanCoast = Math.tan(((cfg.coastRampDeg ?? 60) * Math.PI) / 180);
    this.viscous = cfg.viscous ?? { coefficient: 0, maxTorque: 0 };
    this.reset();
  }

  reset() {
    this.couplingTorque = 0;
    this.capacity = 0;
    this.locked = false;
    this.powerMode = true;
    this.speedDiff = 0;
  }

  /** Torque capacity of the friction pack for input torque `tIn` (power or coast). */
  capacityFor(tIn, power, lockCmd = 0) {
    const ramp = this.rampGain / (power ? this.tanPower : this.tanCoast);
    return this.preload + clamp(lockCmd, 0, 1) * this.maxLock + Math.abs(tIn) * ramp;
  }

  /**
   * @param {number} dt
   * @param {number} tIn input torque on the diff carrier [N m]
   * @param {number} sA fraction of input torque to output A (0.5 for a symmetric diff)
   * @param {{omega:number,g:number,n:number}} A omega: shaft speed, g: accel per unit torque, n: accel from other torques
   * @param {{omega:number,g:number,n:number}} B same for output B
   * @param {boolean} power true if the input torque is driving (torque and speed share sign)
   * @param {number} [lockCmd] 0..1 controllable lock command
   * @returns {{tA:number,tB:number,tc:number}}
   */
  split(dt, tIn, sA, A, B, power, lockCmd = 0) {
    const sB = 1 - sA;
    const delta = A.omega - B.omega;
    this.speedDiff = delta;
    this.powerMode = power;
    let tc = 0;
    if (this.type !== 'open') {
      const gSum = A.g + B.g;
      const stick = (delta / dt + A.g * sA * tIn + A.n - B.g * sB * tIn - B.n) / gSum;
      switch (this.type) {
        case 'locked':
          tc = stick; this.capacity = Infinity; this.locked = true;
          break;
        case 'lsd': {
          const cap = this.capacityFor(tIn, power, lockCmd);
          this.capacity = cap;
          tc = clamp(stick, -cap, cap);
          this.locked = Math.abs(stick) <= cap;
          break;
        }
        case 'viscous': {
          const v = this.viscous;
          const raw = clamp(v.coefficient * delta, -v.maxTorque, v.maxTorque);
          // never push beyond the equalising torque
          tc = Math.sign(raw) === Math.sign(stick) ? Math.sign(raw) * Math.min(Math.abs(raw), Math.abs(stick)) : 0;
          this.capacity = v.maxTorque; this.locked = false;
          break;
        }
        default:
          throw new RangeError(`unknown differential type "${this.type}"`);
      }
    } else {
      this.capacity = 0; this.locked = false;
    }
    this.couplingTorque = tc;
    return { tA: sA * tIn - tc, tB: sB * tIn + tc, tc };
  }

  getState() {
    return { couplingTorque: this.couplingTorque, capacity: this.capacity === Infinity ? -1 : this.capacity, locked: this.locked, powerMode: this.powerMode, speedDiff: this.speedDiff };
  }
  setState(s) { Object.assign(this, s, { capacity: s.capacity < 0 ? Infinity : s.capacity }); }
}
