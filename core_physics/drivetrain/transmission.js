import { clamp01 } from '../math/util.js';

/**
 * Gearbox state machine supporting sequential dog boxes and H-pattern synchromesh boxes.
 *
 * Gear numbering: -1 reverse, 0 neutral, 1..n forward.
 *
 *  sequential : shiftUp()/shiftDown() step through R, N, 1..n. No clutch needed. Up-shifts
 *               momentarily cut ignition (flat-shift); down-shifts request a throttle blip.
 *  hpattern   : selectGear(n) requires the clutch pedal to be pressed; otherwise the
 *               synchros grind (wear accumulates) and the request is refused.
 *
 * Worn dogs/synchros eventually make the box jump out of gear under load (deterministic:
 * wear above `popOut.wearThreshold` and torque above the wear-reduced holding torque).
 */
export class Transmission {
  /** @param {object} cfg drivetrain.json `transmission` section */
  constructor(cfg) {
    this.cfg = cfg;
    this.type = cfg.type;
    this.ratios = cfg.gearRatios.slice();
    if (!this.ratios.length) throw new RangeError('transmission.gearRatios must not be empty');
    this.reverse = -Math.abs(cfg.reverseRatio);
    this.reset();
  }

  reset(gear = 0) {
    this.gear = gear;
    this.targetGear = gear;
    this.phase = 'engaged';      // 'engaged' | 'shifting'
    this.timer = 0;
    this.cutTimer = 0;
    this.sinceShift = 1e9;
    this.wear = 0;
    this.pending = null;
    this.events = [];
    this.blip = false;
  }

  get gearCount() { return this.ratios.length; }
  get shifting() { return this.phase === 'shifting'; }

  ratioFor(gear) {
    if (gear === 0) return 0;
    if (gear < 0) return this.reverse;
    return this.ratios[gear - 1];
  }

  /** Overall gearbox ratio currently transmitted (0 when neutral or mid-shift). */
  get ratio() { return this.phase === 'engaged' ? this.ratioFor(this.gear) : 0; }
  get connected() { return this.phase === 'engaged' && this.gear !== 0; }

  get gearName() { return this.gear < 0 ? 'R' : this.gear === 0 ? 'N' : String(this.gear); }

  shiftUp() { this.pending = { kind: 'step', dir: +1 }; }
  shiftDown() { this.pending = { kind: 'step', dir: -1 }; }
  selectGear(n) { this.pending = { kind: 'select', gear: Math.max(-1, Math.min(this.gearCount, Math.trunc(n))) }; }

  /**
   * @param {number} dt
   * @param {object} c
   * @param {number} c.clutchPressed 0..1  @param {number} c.speed vehicle speed [m/s] (signed)
   * @param {number} c.engineOmega [rad/s]  @param {number} c.inputOmegaPerGear shaft speed at gearbox input per unit ratio (omega_cd) [rad/s]
   * @param {number} c.torque magnitude of torque through the box [N m]
   * @returns {{ratio:number, connected:boolean, cutIgnition:boolean, blip:boolean}}
   */
  update(dt, c) {
    const cfg = this.cfg;
    this.events.length = 0;
    this.sinceShift += dt;
    this.blip = false;

    if (this.pending && this.phase === 'engaged') {
      const req = this.pending;
      this.pending = null;
      this._startShift(req, c);
    }

    if (this.phase === 'shifting') {
      this.timer -= dt;
      this.blip = this.blipActive;
      if (this.timer <= 0) {
        const from = this.gear;
        this.gear = this.targetGear;
        this.phase = 'engaged';
        this.sinceShift = 0;
        this.blipActive = false;
        this.events.push({ type: 'shift', from, to: this.gear });
      }
    }
    if (this.cutTimer > 0) this.cutTimer -= dt;

    // Worn dog/synchro pop-out
    const p = cfg.popOut;
    if (this.phase === 'engaged' && this.gear > 0 && this.wear > p.wearThreshold) {
      const hold = p.holdTorque * (1.2 - this.wear);
      if (c.torque > hold) {
        this.events.push({ type: 'gear_popout', gear: this.gear });
        this.gear = 0; this.targetGear = 0;
        this.wear = Math.min(1, this.wear + 0.01);
      }
    }
    return { ratio: this.ratio, connected: this.connected, cutIgnition: this.cutTimer > 0, blip: this.blip };
  }

  _startShift(req, c) {
    const cfg = this.cfg;
    let target = req.kind === 'step' ? this.gear + req.dir : req.gear;
    target = Math.max(-1, Math.min(this.gearCount, target));
    if (target === this.gear) return;
    if (this.sinceShift < cfg.minShiftInterval) return;

    const toReverse = target < 0 || this.gear < 0;
    if (toReverse && Math.abs(c.speed) > cfg.reverseLockoutSpeed && target !== 0) {
      this.events.push({ type: 'shift_refused', reason: 'reverse_lockout' });
      return;
    }

    let duration;
    if (this.type === 'sequential') {
      duration = cfg.sequential.shiftTime;
      if (target > this.gear && this.gear > 0) {
        this.cutTimer = cfg.sequential.ignitionCutTime;      // flat-shift on up-shifts
      }
      if (target < this.gear && target > 0) {
        this.blipActive = cfg.sequential.autoBlip;
      }
    } else {
      // H-pattern: needs the clutch
      if (clamp01(c.clutchPressed) < cfg.hPattern.clutchRequired) {
        this.wear = clamp01(this.wear + cfg.hPattern.grindWear);
        this.events.push({ type: 'gear_grind', requested: target });
        return;
      }
      duration = cfg.hPattern.shiftTime;
      // Synchro wear grows with the speed mismatch the synchros must absorb
      const nextRatio = this.ratioFor(target);
      const mismatch = Math.abs(c.engineOmega - Math.abs(c.inputOmegaPerGear) * Math.abs(nextRatio));
      if (target !== 0) this.wear = clamp01(this.wear + cfg.hPattern.syncWearPerRadS * mismatch);
      duration += cfg.hPattern.syncTimePerRadS * mismatch;
    }
    this.targetGear = target;
    this.phase = 'shifting';
    this.timer = target === 0 ? Math.min(duration, 0.05) : duration;
  }

  /** Mechanical efficiency of the selected gear for the power-flow direction. */
  efficiency() {
    const e = this.cfg.efficiency;
    return this.gear === 0 ? 1 : (this.gear === this.gearCount && e.directDrive ? e.directDrive : e.geared);
  }

  getState() {
    return {
      gear: this.gear, targetGear: this.targetGear, phase: this.phase, timer: this.timer, cutTimer: this.cutTimer,
      sinceShift: this.sinceShift, wear: this.wear, pending: this.pending ? { ...this.pending } : null,
      blipActive: !!this.blipActive,
    };
  }
  setState(s) { Object.assign(this, s, { pending: s.pending ? { ...s.pending } : null }); }
}
