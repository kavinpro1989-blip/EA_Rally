import { Engine } from './engine.js';
import { Clutch } from './clutch.js';
import { Transmission } from './transmission.js';
import { Differential } from './differential.js';
import { RADS_TO_RPM } from '../math/constants.js';
import { clamp01, smoothstep } from '../math/util.js';

const FL = 0, FR = 1, RL = 2, RR = 3;

/**
 * Complete powertrain: engine(+turbo+ECU) -> clutch -> gearbox -> transfer case / centre
 * differential -> front & rear final drives with LSDs -> four wheels.
 *
 * Layouts: 'AWD' (centre diff splits torque), 'FWD' and 'RWD' (centre path decoupled).
 *
 * The module owns no wheel state. Every tick it receives the wheel speeds, inertias and the
 * non-driveline torque acting on each wheel (tyre reaction, rolling resistance, brakes),
 * and returns the drive torque for each wheel. Wheel integration stays in the chassis.
 */
export class Drivetrain {
  /**
   * @param {object} cfg   drivetrain.json
   * @param {object} engineCfg engine.json
   * @param {{pressure:number,temperature:number}} ambient
   */
  constructor(cfg, engineCfg, ambient) {
    this.cfg = cfg;
    this.layout = cfg.layout;
    if (!['AWD', 'RWD', 'FWD'].includes(this.layout)) throw new RangeError(`drivetrain.layout must be AWD, RWD or FWD (got ${this.layout})`);
    this.engine = new Engine(engineCfg, ambient);
    this.clutch = new Clutch(cfg.clutch);
    this.transmission = new Transmission(cfg.transmission);
    this.centerDiff = new Differential(cfg.centerDiff);
    this.frontDiff = new Differential(cfg.frontDiff);
    this.rearDiff = new Differential(cfg.rearDiff);
    this.fdF = cfg.finalDrive.front;
    this.fdR = cfg.finalDrive.rear;
    this.etaFD = cfg.efficiency.finalDrive;
    this.frontShare = this.layout === 'FWD' ? 1 : this.layout === 'RWD' ? 0 : cfg.centerDiff.baseSplit;
    this.driveTorque = [0, 0, 0, 0];
    this.telemetry = {};
    this.autoPedal = 1;
  }

  reset() {
    this.engine.reset(this.engine.cfg.startRunning !== false);
    this.clutch.reset();
    this.transmission.reset();
    this.centerDiff.reset(); this.frontDiff.reset(); this.rearDiff.reset();
    this.driveTorque = [0, 0, 0, 0];
    this.autoPedal = 1;
  }

  shiftUp() { this.transmission.shiftUp(); }
  shiftDown() { this.transmission.shiftDown(); }
  selectGear(n) { this.transmission.selectGear(n); }

  /** Clutch pedal chosen by the auto-clutch (rpm- and speed-based) when the driver supplies none. */
  _autoClutch(rpm, speed, gear) {
    const a = this.cfg.autoClutch;
    if (gear === 0) return 1;
    const byRpm = smoothstep(a.engageStartRpm, a.engageEndRpm, rpm);
    const bySpeed = smoothstep(a.speedStart, a.speedFull, Math.abs(speed));
    return 1 - Math.max(byRpm, bySpeed);
  }

  /**
   * @param {number} dt
   * @param {object} inp driver inputs: throttle, clutch (0 released..1 pressed, undefined = auto),
   *        ignition, starter, alsSwitch, launchSwitch, centerDiffLock
   * @param {Array<{omega:number,inertia:number,resist:number}>} w wheel states in order FL, FR, RL, RR
   * @param {object} ctx { speed, intercoolerBlockage, powerScale, boostLeakScale, coolantK }
   * @returns {number[]} drive torque per wheel [N m]
   */
  step(dt, inp, w, ctx) {
    const { engine, clutch, transmission: tr } = this;
    const speed = ctx.speed;
    const fdF = this.fdF, fdR = this.fdR, s = this.frontShare;

    // --- kinematics from the wheels ------------------------------------------------
    const wcarF = 0.5 * (w[FL].omega + w[FR].omega);
    const wcarR = 0.5 * (w[RL].omega + w[RR].omega);
    const wcf = fdF * wcarF, wcr = fdR * wcarR;
    const wcd = this.layout === 'AWD' ? s * wcf + (1 - s) * wcr : this.layout === 'FWD' ? wcf : wcr;

    // --- pedals ---------------------------------------------------------------------------
    const rpm = engine.omega * RADS_TO_RPM;
    let clutchCmd = inp.clutch;
    if (clutchCmd === undefined || clutchCmd === null) {
      clutchCmd = this.cfg.autoClutch.enabled ? this._autoClutch(rpm, speed, tr.gear) : 0;
    }
    clutchCmd = clamp01(clutchCmd);

    // --- gearbox, engine --------------------------------------------------------------------
    const trOut = tr.update(dt, {
      clutchPressed: clutchCmd, speed, engineOmega: engine.omega, inputOmegaPerGear: wcd,
      torque: Math.abs(clutch.torque),
    });
    const eOut = engine.update(dt, {
      pedal: inp.throttle ?? 0, clutchPressed: clutchCmd, speed: Math.abs(speed),
      shiftCut: trOut.cutIgnition, blip: trOut.blip, ignition: inp.ignition !== false, starter: !!inp.starter,
      alsSwitch: !!inp.alsSwitch, launchSwitch: !!inp.launchSwitch,
      intercoolerBlockage: ctx.intercoolerBlockage ?? 0, powerScale: ctx.powerScale ?? 1,
      boostLeakScale: ctx.boostLeakScale ?? 1, coolantK: ctx.coolantK ?? 360,
    });

    // --- effective inertias and loads reflected to the gearbox ---------------------------------
    const JF2 = w[FL].inertia + w[FR].inertia;
    const JR2 = w[RL].inertia + w[RR].inertia;
    const JFc = JF2 / (fdF * fdF);   // front axle inertia at the centre-diff output shaft
    const JRc = JR2 / (fdR * fdR);
    let JcdEq;
    if (this.layout === 'FWD') JcdEq = JFc;
    else if (this.layout === 'RWD') JcdEq = JRc;
    else if (this.cfg.centerDiff.type === 'open') JcdEq = 1 / ((s * s) / JFc + ((1 - s) * (1 - s)) / JRc);
    else JcdEq = JFc + JRc;
    const resF = w[FL].resist + w[FR].resist;
    const resR = w[RL].resist + w[RR].resist;
    let extCd = 0;
    if (this.layout !== 'RWD') extCd += resF / fdF;
    if (this.layout !== 'FWD') extCd += resR / fdR;

    const r = trOut.ratio;
    const connected = trOut.connected;
    const wTs = r * wcd;
    let jIn = this.cfg.transmission.inertia;
    let loadTs = 0;
    if (connected) { jIn += JcdEq / (r * r); loadTs = -extCd / r; }

    const tClutch = clutch.solve(dt, {
      pedal: clutchCmd, omegaEngine: engine.omega, omegaInput: wTs,
      engineInertia: engine.inertia, inputInertia: jIn, engineTorque: eOut.torque,
      loadTorque: loadTs, connected,
    });
    engine.integrate(dt, tClutch);

    // --- through the gearbox --------------------------------------------------------------
    const driving = tClutch * wTs >= 0;
    const eta = tr.efficiency();
    const tCd = connected ? tClutch * r * (driving ? eta : 1 / eta) : 0;
    const powerCd = Math.abs(wcd) < 0.5 ? tCd * (r >= 0 ? 1 : -1) >= 0 : tCd * wcd >= 0;

    // --- centre differential ------------------------------------------------------------------
    let tCf = 0, tCr = 0;
    const etaF = this.etaFD;
    if (this.layout === 'AWD') {
      const A = { omega: wcf, g: (etaF * fdF * fdF) / JF2, n: (fdF * resF) / JF2 };
      const B = { omega: wcr, g: (etaF * fdR * fdR) / JR2, n: (fdR * resR) / JR2 };
      const sp = this.centerDiff.split(dt, tCd, s, A, B, powerCd, inp.centerDiffLock ?? 0);
      tCf = sp.tA; tCr = sp.tB;
    } else if (this.layout === 'FWD') { tCf = tCd; this.centerDiff.reset(); }
    else { tCr = tCd; this.centerDiff.reset(); }

    // --- axle differentials ----------------------------------------------------------------------
    const out = this.driveTorque;
    out[FL] = out[FR] = out[RL] = out[RR] = 0;
    if (this.layout !== 'RWD') {
      const powerF = Math.abs(wcarF) < 0.5 ? tCf * (r >= 0 ? 1 : -1) >= 0 : tCf * wcarF >= 0;
      const tIn = tCf * fdF * (powerF ? etaF : 1 / etaF);
      const sp = this.frontDiff.split(dt, tIn, 0.5,
        { omega: w[FL].omega, g: 1 / w[FL].inertia, n: w[FL].resist / w[FL].inertia },
        { omega: w[FR].omega, g: 1 / w[FR].inertia, n: w[FR].resist / w[FR].inertia }, powerF);
      out[FL] = sp.tA; out[FR] = sp.tB;
    } else this.frontDiff.reset();
    if (this.layout !== 'FWD') {
      const powerR = Math.abs(wcarR) < 0.5 ? tCr * (r >= 0 ? 1 : -1) >= 0 : tCr * wcarR >= 0;
      const tIn = tCr * fdR * (powerR ? etaF : 1 / etaF);
      const sp = this.rearDiff.split(dt, tIn, 0.5,
        { omega: w[RL].omega, g: 1 / w[RL].inertia, n: w[RL].resist / w[RL].inertia },
        { omega: w[RR].omega, g: 1 / w[RR].inertia, n: w[RR].resist / w[RR].inertia }, powerR);
      out[RL] = sp.tA; out[RR] = sp.tB;
    } else this.rearDiff.reset();

    this.telemetry = {
      rpm: engine.omega * RADS_TO_RPM, gear: tr.gear, gearName: tr.gearName, shifting: tr.shifting,
      clutchPedal: clutchCmd, clutchTorque: tClutch, clutchSlipRadS: clutch.slipSpeed, clutchSlipping: clutch.slipping,
      driveshaftTorque: tCd, events: tr.events,
    };
    return out;
  }

  getState() {
    return {
      engine: this.engine.getState(), clutch: this.clutch.getState(), transmission: this.transmission.getState(),
      centerDiff: this.centerDiff.getState(), frontDiff: this.frontDiff.getState(), rearDiff: this.rearDiff.getState(),
      driveTorque: this.driveTorque.slice(),
    };
  }
  setState(s) {
    this.engine.setState(s.engine); this.clutch.setState(s.clutch); this.transmission.setState(s.transmission);
    this.centerDiff.setState(s.centerDiff); this.frontDiff.setState(s.frontDiff); this.rearDiff.setState(s.rearDiff);
    this.driveTorque = s.driveTorque.slice();
  }
}

export const WHEEL = { FL, FR, RL, RR };
