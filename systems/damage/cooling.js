import { FUEL_LHV } from '../../core_physics/math/constants.js';
import { clamp, clamp01, smoothstep } from '../../core_physics/math/util.js';

/**
 * Engine cooling circuit with radiator punctures.
 *
 *   C dT/dt = Q_engine - Q_radiator - Q_ambient
 *   Q_engine   = heatFraction * fuel mass flow * LHV
 *   Q_radiator = UA * (T - T_amb),  UA = UA0 * (air flow ratio)^0.6 * thermostat * level_factor * (1 - blockage effect)
 *   dLevel/dt  = - sum_i size_i * k_leak * sqrt(P_gauge) / V0         (P_gauge follows coolant temperature)
 *
 * Below `airLockLevel` the radiator is starved (air in the system) and rejects almost no heat,
 * which is how a punctured radiator turns into an overheated, derated and eventually seized engine.
 */
export class CoolingSystem {
  /** @param {object} cfg damage.json `cooling` @param {number} ambientK */
  constructor(cfg, ambientK) {
    this.cfg = cfg;
    this.ambientK = ambientK;
    this.coolantVolume = cfg.coolantMass / 1060;           // m^3 (water/glycol ~1060 kg/m^3)
    this.reset();
  }

  reset() {
    this.temperatureK = this.ambientK + this.cfg.initialTempOffsetK;
    this.level = 1;
    this.punctures = [];
    this.blockage = 0;
    this.engineDamage = 0;      // 0..1, 1 = seized
    this.overheatTime = 0;
    this.heatIn = 0;
    this.heatOut = 0;
    this.leakRate = 0;          // m^3/s
    this.seized = false;
  }

  addPuncture(size) {
    this.punctures.push({ size: clamp01(size) });
  }

  get totalHoleSize() { return this.punctures.reduce((a, p) => a + p.size, 0); }

  /**
   * @param {number} dt
   * @param {{fuelMassFlow:number,speed:number,ambientK?:number}} u
   */
  update(dt, u) {
    const c = this.cfg;
    const T = this.temperatureK;
    const amb = u.ambientK ?? this.ambientK;

    // heat in
    const qIn = c.heatFractionToCoolant * u.fuelMassFlow * FUEL_LHV;

    // radiator
    const airRatio = (u.speed + c.fanSpeedEquivalent) / c.radiatorAirReferenceSpeed;
    const thermostat = 0.12 + 0.88 * smoothstep(c.thermostatOpenK, c.thermostatFullK, T);
    const levelFactor = 0.08 + 0.92 * smoothstep(c.airLockLevel, Math.min(0.9, c.airLockLevel + 0.3), this.level);
    const ua = c.radiatorUA * Math.pow(Math.max(airRatio, 0.05), c.radiatorUAAirExponent) * thermostat * levelFactor * (1 - c.radiatorBlockageEffect * clamp01(this.blockage));
    const qRad = ua * (T - amb);
    const qAmb = c.heatLossToAmbient * (T - amb);

    // thermal mass shrinks as coolant is lost
    const C = c.coolantMass * c.coolantSpecificHeat * Math.max(this.level, 0.15) + c.engineThermalMass;
    this.temperatureK = clamp(T + (dt * (qIn - qRad - qAmb)) / C, amb - 2, 470);
    this.heatIn = qIn; this.heatOut = qRad + qAmb;

    // leaks: pressure in the system tracks temperature
    const pGauge = Math.max(0, c.systemPressure * clamp((this.temperatureK - 300) / (373 - 300), 0, 1.5) - 101325 * 0.0) * (this.level > 0.02 ? 1 : 0);
    this.leakRate = 0;
    if (this.level > 0 && this.punctures.length) {
      this.leakRate = this.totalHoleSize * c.leakCoefficient * Math.sqrt(pGauge);
      this.level = Math.max(0, this.level - (this.leakRate * dt) / this.coolantVolume);
    }

    // overheating damage
    if (this.temperatureK > c.seizeK) {
      this.overheatTime += dt;
      this.engineDamage = clamp01(this.overheatTime / c.seizeTime);
    } else {
      this.overheatTime = Math.max(0, this.overheatTime - dt * 0.05);
    }
    if (this.engineDamage >= 1) this.seized = true;
  }

  getState() {
    return {
      temperatureK: this.temperatureK, level: this.level, punctures: this.punctures.map((p) => ({ ...p })), blockage: this.blockage,
      engineDamage: this.engineDamage, overheatTime: this.overheatTime, heatIn: this.heatIn, heatOut: this.heatOut,
      leakRate: this.leakRate, seized: this.seized,
    };
  }
  setState(s) { Object.assign(this, s, { punctures: s.punctures.map((p) => ({ ...p })) }); }
}
