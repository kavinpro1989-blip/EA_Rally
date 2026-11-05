import { Table2D } from '../math/tables.js';
import { clamp, clamp01, smoothstep } from '../math/util.js';
import { RADS_TO_RPM } from '../math/constants.js';

/**
 * Engine control unit: maps -> actuator commands.
 *
 *  - throttle map (rpm x pedal -> plate position), idle PI controller
 *  - boost target map (rpm x pedal -> kPa gauge) with feed-forward + PI wastegate duty
 *  - rev limiter (fuel cut with hysteresis), launch control (retard-based rpm hold that builds boost)
 *  - Anti-Lag System: throttle cracked + heavy ignition retard + enrichment + closed wastegate/BOV
 *  - thermal derate and shift cut / downshift blip hooks driven by the gearbox
 */
export class ECU {
  /**
   * @param {object} cfg engine.json `ecu` section
   * @param {object} turboCfg engine.json `turbo` section (for wastegate feed-forward)
   * @param {number} idleRpm
   */
  constructor(cfg, turboCfg, idleRpm) {
    this.cfg = cfg;
    this.idleRpm = idleRpm;
    this.throttleMap = new Table2D(cfg.throttleMap, 'ecu.throttleMap');
    this.boostMap = new Table2D(cfg.boostTargetMap, 'ecu.boostTargetMap');
    this.wgBaseKPa = turboCfg.wastegate.springPressure / 1000;
    this.wgMaxKPa = turboCfg.wastegate.maxControlPressure / 1000;
    this.omegaMaxTurbo = turboCfg.maxShaftSpeed;
    this.reset();
  }

  reset() {
    this.limiterCut = false;
    this.idleIntegral = 0;
    this.boostIntegral = 0;
    this.alsActive = false;
    this.alsTime = 0;
    this.alsCooldown = 0;
    this.launchActive = false;
    this.out = {
      throttleCmd: 0, ignitionRetardDeg: 0, fuelCut: false, boostTargetKPa: 0, wastegateDuty: 0,
      alsActive: false, launchActive: false, limiterActive: false, bovAllowed: true, fuelEnrichment: 1, derate: 1,
    };
  }

  /**
   * @param {number} dt
   * @param {object} s sensor/driver inputs
   * @param {number} s.pedal 0..1  @param {number} s.omega crank speed [rad/s]
   * @param {number} s.speed vehicle speed [m/s]  @param {number} s.clutchPressed 0..1
   * @param {number} s.boostKPa gauge  @param {number} s.turboOmega  @param {number} s.exhaustTempK
   * @param {number} s.coolantK  @param {boolean} s.shiftCut  @param {boolean} s.blip
   * @param {boolean} s.alsSwitch  @param {boolean} s.launchSwitch  @param {boolean} s.running
   */
  update(dt, s) {
    const c = this.cfg;
    const rpm = s.omega * RADS_TO_RPM;
    const o = this.out;
    const pedal = clamp01(s.pedal);

    let throttle = this.throttleMap.eval(rpm, pedal);

    // --- Idle speed control -------------------------------------------------
    if (s.running && pedal < 0.03) {
      const err = this.idleRpm - rpm;
      this.idleIntegral = clamp(this.idleIntegral + err * dt, -150, 250);
      const idleThrottle = clamp(c.idle.kp * err + c.idle.ki * this.idleIntegral + c.idle.baseThrottle, 0, c.idle.maxThrottle);
      throttle = Math.max(throttle, idleThrottle);
    } else {
      this.idleIntegral *= Math.max(0, 1 - 2 * dt);
    }

    // --- Rev limiter ---------------------------------------------------------
    const lim = c.revLimiter;
    let limit = lim.rpm;
    // --- Launch control (standing start): hold rpm by retarding ignition, which also builds boost
    let retard = 0;
    const launchOk = c.launch.enabled && s.launchSwitch && pedal > 0.9 && s.clutchPressed > 0.5 && s.speed < c.launch.maxSpeed;
    this.launchActive = launchOk;
    if (launchOk) {
      retard = c.launch.maxRetardDeg * smoothstep(c.launch.rpm - 150, c.launch.rpm + 100, rpm);
      limit = Math.min(limit, c.launch.rpm + 400);
      throttle = 1;
    }
    if (rpm > limit) this.limiterCut = true;
    else if (rpm < limit - lim.hysteresis) this.limiterCut = false;
    let fuelCut = this.limiterCut || s.shiftCut;

    // --- Boost target and wastegate duty -------------------------------------
    let boostTarget = this.boostMap.eval(rpm, pedal);

    // --- Anti-Lag ---------------------------------------------------------------
    const als = c.als;
    let alsWants = als.enabled && s.alsSwitch && s.running && pedal < als.pedalThreshold && rpm >= als.minRpm &&
                   s.exhaustTempK < als.maxExhaustTempK && this.alsCooldown <= 0 && !s.shiftCut;
    if (alsWants) {
      this.alsTime += dt;
      if (this.alsTime > als.maxDuration) { alsWants = false; this.alsCooldown = als.cooldown; this.alsTime = 0; }
    } else {
      this.alsTime = Math.max(0, this.alsTime - dt * 2);
    }
    if (this.alsCooldown > 0) this.alsCooldown -= dt;
    this.alsActive = alsWants;
    let enrich = 1;
    if (this.alsActive) {
      throttle = Math.max(throttle, als.throttle);
      retard = Math.max(retard, als.retardDeg);
      boostTarget = als.boostTargetKPa;
      enrich = als.fuelMultiplier;
      fuelCut = false;
    }

    if (s.blip && !this.alsActive) throttle = Math.max(throttle, c.blip.throttle);

    const boostKPa = s.boostKPa;
    const ffDuty = clamp01((boostTarget - this.wgBaseKPa) / Math.max(1, this.wgMaxKPa - this.wgBaseKPa));
    const err = boostTarget - boostKPa;
    this.boostIntegral = clamp(this.boostIntegral + err * dt, -c.boostControl.integralLimit, c.boostControl.integralLimit);
    let duty = clamp01(ffDuty * c.boostControl.feedForward + c.boostControl.kp * err + c.boostControl.ki * this.boostIntegral);
    // Overspeed protection: open the gate fully
    if (s.turboOmega > 0.98 * this.omegaMaxTurbo) duty = 0;
    // Overboost cut
    if (boostKPa > c.boostControl.overboostKPa) fuelCut = true;

    // --- Thermal derate ------------------------------------------------------------
    const d = c.overheatDerate;
    const derate = 1 - (1 - d.minPower) * smoothstep(d.startK, d.endK, s.coolantK);

    o.throttleCmd = clamp01(throttle);
    o.ignitionRetardDeg = retard;
    o.fuelCut = fuelCut;
    o.boostTargetKPa = boostTarget;
    o.wastegateDuty = duty;
    o.alsActive = this.alsActive;
    o.launchActive = this.launchActive;
    o.limiterActive = this.limiterCut;
    o.bovAllowed = !this.alsActive && !this.launchActive;
    o.fuelEnrichment = enrich;
    o.derate = derate;
    return o;
  }

  getState() {
    return {
      limiterCut: this.limiterCut, idleIntegral: this.idleIntegral, boostIntegral: this.boostIntegral,
      alsActive: this.alsActive, alsTime: this.alsTime, alsCooldown: this.alsCooldown, launchActive: this.launchActive,
      out: { ...this.out },
    };
  }
  setState(s) { Object.assign(this, s, { out: { ...s.out } }); }
}
