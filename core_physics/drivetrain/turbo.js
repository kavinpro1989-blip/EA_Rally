import { R_AIR, GAMMA_AIR, CP_AIR, GAMMA_EXH, CP_EXH } from '../math/constants.js';
import { clamp, clamp01, lag } from '../math/util.js';

/**
 * Mean-value turbocharger model.
 *
 * State: shaft speed w_t [rad/s], plenum (post-compressor, pre-throttle) absolute
 * pressure p_pl [Pa], wastegate and blow-off valve positions.
 *
 *   shaft:     J dw/dt = tau_turbine - tau_compressor - tau_friction
 *   turbine:   P_t = eta_t * mdot_t * cp_e * T_exh * (1 - PR_t^-((g-1)/g))
 *              PR_t from the orifice relation  mdot_t*sqrt(T_exh)/(C_t*p_amb) = sqrt(PR_t^2 - 1)
 *   compressor: PR_cap = (1 + eta_c*psi*(w*r_c)^2/(cp*T_amb))^(g/(g-1))   (zero-flow head)
 *               mdot_c = mdot_choke(w) * sqrt(1 - x^2),  x = (PR-1)/(PR_cap-1); backflow (surge) for x > 1
 *               P_c = mdot_c * cp * T_amb * (PR^((g-1)/g) - 1) / eta_c
 *   plenum:    dp/dt = (R T_pl / V) * (mdot_c - mdot_engine - mdot_bov)
 *
 * Anti-lag works physically: with the throttle shut and ignition heavily retarded,
 * exhaust gas temperature rises, so the turbine keeps driving the shaft, the
 * compressor head stays above plenum pressure and boost is retained.
 */
export class Turbo {
  /** @param {object} cfg engine.json `turbo` section  @param {{pressure:number,temperature:number}} ambient */
  constructor(cfg, ambient) {
    this.cfg = cfg;
    this.ambient = { pressure: ambient.pressure, temperature: ambient.temperature };
    this.omegaMax = cfg.maxShaftSpeed;
    this.reset();
  }

  reset() {
    this.omega = this.cfg.idleShaftSpeed ?? 2000;
    this.pPlenum = this.ambient.pressure;
    this.wgOpen = 0;
    this.bovOpen = 0;
    this.mdotCompressor = 0;
    this.pressureRatio = 1;
    this.pressureRatioTurbine = 1;
    this.compressorOutTempK = this.ambient.temperature;
    this.surge = false;
    this.overspeed = false;
  }

  get boostGaugePa() { return Math.max(0, this.pPlenum - this.ambient.pressure); }

  /** Compressor zero-flow pressure-ratio capability for the current shaft speed. */
  pressureRatioCapability(omega = this.omega) {
    const c = this.cfg.compressor;
    const U = omega * c.tipRadius;
    const xh = (c.efficiency * c.workCoefficient * U * U) / (CP_AIR * this.ambient.temperature);
    return Math.pow(1 + xh, GAMMA_AIR / (GAMMA_AIR - 1));
  }

  /**
   * Advance the turbocharger.
   * @param {number} dt
   * @param {object} u
   * @param {number} u.mdotEngine   air mass flow consumed by the engine [kg/s]
   * @param {number} u.mdotExhaust  exhaust mass flow [kg/s]
   * @param {number} u.exhaustTempK exhaust gas temperature at turbine inlet [K]
   * @param {number} u.wastegateDuty ECU wastegate control duty 0..1 (1 = hold shut hardest)
   * @param {boolean} u.bovCommand  open the blow-off valve
   * @param {number} u.plenumTempK  charge temperature in the plenum [K]
   * @param {number} u.leakScale    1 = healthy, <1 adds a boost leak (damage)
   */
  step(dt, u) {
    const cfg = this.cfg, amb = this.ambient;
    const sub = 4;
    const h = dt / sub;
    const pAmb = amb.pressure, Tamb = amb.temperature;
    const wg = cfg.wastegate, bov = cfg.blowOff, comp = cfg.compressor, tur = cfg.turbine;
    const Tpl = Math.max(250, u.plenumTempK);

    // Wastegate: pneumatic actuator, opening pressure = spring + ECU-controlled bias
    const pGauge = this.boostGaugePa;
    const openP = wg.springPressure + clamp01(u.wastegateDuty) * (wg.maxControlPressure - wg.springPressure);
    const wgTarget = clamp01((pGauge - openP) / wg.pressureRange + (this.overspeed ? 1 : 0));
    this.wgOpen = lag(this.wgOpen, wgTarget, wg.responseTime, dt);
    this.bovOpen = lag(this.bovOpen, u.bovCommand ? 1 : 0, bov.responseTime, dt);

    // Turbine inlet flow and expansion ratio (constant over the sub-steps)
    const mdotTurbine = u.mdotExhaust * (1 - wg.flowFraction * this.wgOpen);
    const flowParam = (mdotTurbine * Math.sqrt(u.exhaustTempK)) / (tur.flowCoefficient * pAmb);
    const prT = Math.sqrt(1 + flowParam * flowParam);
    this.pressureRatioTurbine = prT;
    const turbineHead = 1 - Math.pow(prT, -(GAMMA_EXH - 1) / GAMMA_EXH);
    const turbinePower = tur.efficiency * mdotTurbine * CP_EXH * u.exhaustTempK * turbineHead;

    let mdotCompAvg = 0;
    for (let k = 0; k < sub; k++) {
      const w = Math.max(this.omega, 800);
      const prCap = this.pressureRatioCapability(this.omega);
      const pr = Math.max(1, this.pPlenum / pAmb);
      const U = this.omega * comp.tipRadius;
      const mdotChoke = comp.chokeFlow * (this.omega / comp.referenceSpeed) * (1 + 0.15 * (this.omega / comp.referenceSpeed - 1));
      let mdotC;
      const span = Math.max(prCap - 1, 1e-6);
      const x = (pr - 1) / span;
      if (x < 1) {
        mdotC = Math.max(0, mdotChoke) * Math.sqrt(1 - x * x);
        this.surge = false;
      } else {
        mdotC = -comp.surgeBackflow * Math.max(mdotChoke, 0.02) * Math.min(x - 1, 1);
        this.surge = true;
      }
      const mdotFlowPos = Math.max(mdotC, 0);
      const compPower = (mdotFlowPos * CP_AIR * Tamb * (Math.pow(pr, (GAMMA_AIR - 1) / GAMMA_AIR) - 1)) / comp.efficiency;

      const tauT = turbinePower / w;
      const tauC = compPower / w;
      const tauF = this.cfg.frictionCoefficient * this.omega + (this.cfg.coulombFriction ?? 0);
      this.omega = clamp(this.omega + (h * (tauT - tauC - tauF)) / this.cfg.shaftInertia, 300, this.omegaMax * 1.15);

      // Blow-off valve flow (subsonic orifice linearisation)
      const dpBov = Math.max(0, this.pPlenum - pAmb);
      const mdotBov = this.bovOpen * bov.flowCoefficient * dpBov / Math.sqrt(R_AIR * Tpl);
      const mdotLeak = (1 - clamp01(u.leakScale)) * 1.0e-4 * dpBov / Math.sqrt(R_AIR * Tpl);
      const dp = ((R_AIR * Tpl) / cfg.plenumVolume) * (mdotC - u.mdotEngine - mdotBov - mdotLeak) * h;
      this.pPlenum = Math.max(pAmb, this.pPlenum + dp);
      mdotCompAvg += mdotC / sub;
      this.pressureRatio = pr;
      this.compressorOutTempK = Tamb * (1 + (Math.pow(pr, (GAMMA_AIR - 1) / GAMMA_AIR) - 1) / comp.efficiency);
      void U;
    }
    this.mdotCompressor = mdotCompAvg;
    this.overspeed = this.omega > this.omegaMax;
  }

  getState() {
    return {
      omega: this.omega, pPlenum: this.pPlenum, wgOpen: this.wgOpen, bovOpen: this.bovOpen,
      mdotCompressor: this.mdotCompressor, pressureRatio: this.pressureRatio,
      pressureRatioTurbine: this.pressureRatioTurbine, compressorOutTempK: this.compressorOutTempK,
      surge: this.surge, overspeed: this.overspeed,
    };
  }
  setState(s) { Object.assign(this, s); }
}
