import { R_AIR, RADS_TO_RPM, RPM_TO_RADS, TWO_PI } from '../math/constants.js';
import { Table1D } from '../math/tables.js';
import { clamp01, lag } from '../math/util.js';
import { Turbo } from './turbo.js';
import { ECU } from './ecu.js';

/**
 * Four-stroke turbo engine.
 *
 * Torque is referenced to the measured wide-open-throttle dyno curve:
 *
 *   T_brake = (T_dyno(rpm) + T_fric(rpm)) * rho_man/rho_ref(rpm) * eta_ign - T_fric_total
 *
 * where rho_man is the actual manifold charge density (throttle plate x plenum pressure x
 * intercooled temperature) and rho_ref is the density present during the dyno pull
 * (`dynoBoostKPa`, `dynoIntakeTempK`). At the dyno boost and charge temperature the model
 * reproduces the tabulated curve exactly; boost lag, charge heat-soak, altitude, throttle
 * position and ignition retard then act through the density ratio / efficiency terms.
 */
export class Engine {
  /**
   * @param {object} cfg engine.json (sections: engine, ecu, turbo, intercooler)
   * @param {{pressure:number,temperature:number}} ambient
   */
  constructor(cfg, ambient) {
    const e = cfg.engine;
    this.cfg = e;
    this.ambient = { pressure: ambient.pressure, temperature: ambient.temperature };
    this.displacement = e.displacement;
    this.inertia = e.inertia;
    this.idleOmega = e.idleRpm * RPM_TO_RADS;
    this.stallOmega = e.stallRpm * RPM_TO_RADS;
    this.torqueCurve = new Table1D(e.torqueCurve, { smooth: true, label: 'engine.torqueCurve' });
    this.dynoBoost = new Table1D(e.dynoBoostKPa, { smooth: true, label: 'engine.dynoBoostKPa' });
    this.volEff = new Table1D(e.volumetricEfficiency, { smooth: true, label: 'engine.volumetricEfficiency' });
    this.retardEff = new Table1D(e.ignition.retardEfficiency, { smooth: true, label: 'engine.ignition.retardEfficiency' });
    this.turbo = new Turbo(cfg.turbo, ambient);
    this.ecu = new ECU(cfg.ecu, cfg.turbo, e.idleRpm);
    this.ic = cfg.intercooler;
    this.reset(e.startRunning !== false);
  }

  reset(running = true) {
    this.omega = running ? this.idleOmega : 0;
    this.running = running;
    this.thetaPlate = 0;
    this.torqueIndicated = 0;
    this.intakeTempK = this.ambient.temperature + 25;
    this.manifoldPa = this.ambient.pressure * 0.3;
    this.torque = 0;
    this.exhaustTempK = 900;
    this.mdotAir = 0;
    this.mdotFuel = 0;
    this.ignitionEfficiency = 1;
    this.starterTorque = 0;
    this.stalled = false;
    this.events = [];
    this.ecu.reset();
    this.turbo.reset();
    this.out = { rpm: this.omega * RADS_TO_RPM };
  }

  get rpm() { return this.omega * RADS_TO_RPM; }

  /** Throttle-plate flow function: fraction of plenum pressure seen in the manifold. */
  plateFlow(theta) {
    const t = this.cfg.throttle;
    return t.idleFlowFraction + (1 - t.idleFlowFraction) * (1 - Math.pow(1 - clamp01(theta), t.flowExponent));
  }

  frictionTorque(omega) {
    const f = this.cfg.friction;
    return f.f0 + f.f1 * omega + f.f2 * omega * omega;
  }

  /**
   * Compute torque and thermodynamic state for this tick (does not integrate crank speed).
   * @param {number} dt
   * @param {object} c controls and environment
   * @param {number} c.pedal @param {number} c.clutchPressed @param {number} c.speed [m/s]
   * @param {boolean} c.shiftCut @param {boolean} c.blip @param {boolean} c.ignition @param {boolean} c.starter
   * @param {boolean} c.alsSwitch @param {boolean} c.launchSwitch
   * @param {number} c.intercoolerBlockage 0..1 @param {number} c.powerScale 0..1 (damage)
   * @param {number} c.boostLeakScale 0..1 (1 healthy) @param {number} c.coolantK
   */
  update(dt, c) {
    const e = this.cfg, amb = this.ambient;
    this.events.length = 0;
    const rpm = this.omega * RADS_TO_RPM;

    // ignition / start / stall logic
    if (!c.ignition) this.running = false;
    else if (!this.running && this.omega > 650 * RPM_TO_RADS && !this.stalled) this.running = true;
    if (this.running && this.omega < this.stallOmega) {
      this.running = false; this.stalled = true; this.events.push({ type: 'engine_stall' });
    }
    if (!c.ignition || c.starter) this.stalled = false;
    this.starterTorque = c.starter && c.ignition && this.omega < e.starter.cutoffRpm * RPM_TO_RADS ? e.starter.torque : 0;
    if (c.starter && c.ignition && this.omega > 500 * RPM_TO_RADS && !this.running) this.running = true;

    const ecuOut = this.ecu.update(dt, {
      pedal: c.pedal, omega: this.omega, speed: c.speed, clutchPressed: c.clutchPressed,
      boostKPa: this.turbo.boostGaugePa / 1000, turboOmega: this.turbo.omega, exhaustTempK: this.exhaustTempK,
      coolantK: c.coolantK ?? 360, shiftCut: !!c.shiftCut, blip: !!c.blip,
      alsSwitch: c.alsSwitch !== false, launchSwitch: !!c.launchSwitch, running: this.running,
    });

    // Throttle plate actuator
    this.thetaPlate = lag(this.thetaPlate, ecuOut.throttleCmd, e.throttle.responseTime, dt);
    const flow = this.plateFlow(this.thetaPlate);

    // Intercooler: charge temperature follows compressor outlet temperature
    const blockage = clamp01(c.intercoolerBlockage ?? 0);
    const airflowFactor = this.ic.airflowBase + (1 - this.ic.airflowBase) * clamp01(c.speed / this.ic.airflowSpeed);
    const eff = clamp01(this.ic.effectiveness * airflowFactor * (1 - this.ic.blockageEffect * blockage));
    const tComp = Math.max(amb.temperature, this.turbo.compressorOutTempK);
    const tIcTarget = tComp - eff * (tComp - amb.temperature);
    this.intakeTempK = lag(this.intakeTempK, tIcTarget, this.ic.thermalTimeConstant, dt);
    const dpFactor = 1 - this.ic.pressureDropBase * (1 + this.ic.blockagePressureDrop * blockage);

    // Manifold density
    const pPlenum = this.turbo.pPlenum;
    this.manifoldPa = Math.max(2000, pPlenum * dpFactor * flow);
    const rhoMan = this.manifoldPa / (R_AIR * this.intakeTempK);
    const eta_v = this.volEff.eval(rpm);
    // mdot = rho * eta_v * Vd * N/2 with N in rev/s  =>  rho * eta_v * Vd * omega / (4*pi)
    this.mdotAir = this.running ? rhoMan * eta_v * this.displacement * this.omega / (2 * TWO_PI) : 0;

    // Torque
    const boostRef = this.dynoBoost.eval(rpm) * 1000;
    const rhoRef = (e.dynoAmbientPressure + boostRef) / (R_AIR * e.dynoIntakeTempK);
    const densityRatio = rhoMan / rhoRef;
    const fric = this.frictionTorque(this.omega);
    const ignEff = this.retardEff.eval(ecuOut.ignitionRetardDeg);
    this.ignitionEfficiency = ignEff;
    let tIndTarget = 0;
    if (this.running && !ecuOut.fuelCut) {
      tIndTarget = (this.torqueCurve.eval(rpm) + fric) * densityRatio * ignEff * ecuOut.derate * clamp01(c.powerScale ?? 1);
    }
    this.torqueIndicated = lag(this.torqueIndicated, tIndTarget, e.torqueResponseTime, dt);
    const pumping = 1 + e.friction.pumpingGain * (1 - flow) * (this.running ? 1 : 0.3);
    const tFric = fric * pumping * (this.running ? 1 : 1.0);
    this.torque = this.torqueIndicated - tFric + this.starterTorque;
    if (this.omega <= 0 && this.torque < 0) this.torque = 0;

    // Exhaust
    const load = clamp01(densityRatio);
    const retardHeat = (1 - ignEff) * e.ignition.retardExhaustHeatK;
    let tExh = e.exhaust.tempLowK + (e.exhaust.tempHighK - e.exhaust.tempLowK) * load + retardHeat;
    let mdotExh = this.mdotAir * (1 + ecuOut.fuelEnrichment / e.exhaust.afr);
    if (ecuOut.alsActive) {
      tExh += this.ecu.cfg.als.extraExhaustK;
      // unburnt fuel burns in the manifold: extra enthalpy shows up as mass-flow equivalent
      mdotExh *= this.ecu.cfg.als.exhaustFlowBoost;
    }
    this.exhaustTempK = lag(this.exhaustTempK, tExh, 0.25, dt);
    this.mdotFuel = this.mdotAir * ecuOut.fuelEnrichment / e.exhaust.afr * (ecuOut.fuelCut ? 0 : 1);

    this.turbo.step(dt, {
      mdotEngine: this.mdotAir, mdotExhaust: mdotExh, exhaustTempK: this.exhaustTempK,
      wastegateDuty: ecuOut.wastegateDuty,
      bovCommand: ecuOut.bovAllowed && this.thetaPlate < this.ic.bovThrottleThreshold && this.turbo.boostGaugePa > this.ic.bovMinBoost,
      plenumTempK: this.intakeTempK, leakScale: c.boostLeakScale ?? 1,
    });

    this.out = {
      rpm, torque: this.torque, power: this.torque * this.omega, throttle: this.thetaPlate,
      boostKPa: this.turbo.boostGaugePa / 1000, ...ecuOut,
    };
    return this.out;
  }

  /** Integrate crank speed given the torque the clutch draws from the engine. */
  integrate(dt, clutchTorque) {
    this.omega = Math.max(0, this.omega + (dt * (this.torque - clutchTorque)) / this.inertia);
  }

  getState() {
    return {
      omega: this.omega, running: this.running, thetaPlate: this.thetaPlate, torqueIndicated: this.torqueIndicated,
      intakeTempK: this.intakeTempK, manifoldPa: this.manifoldPa, torque: this.torque, exhaustTempK: this.exhaustTempK,
      mdotAir: this.mdotAir, mdotFuel: this.mdotFuel, ignitionEfficiency: this.ignitionEfficiency,
      starterTorque: this.starterTorque, stalled: this.stalled,
      turbo: this.turbo.getState(), ecu: this.ecu.getState(),
    };
  }
  setState(s) {
    const { turbo, ecu, ...rest } = s;
    Object.assign(this, rest);
    this.turbo.setState(turbo);
    this.ecu.setState(ecu);
  }
}

