import { Rng } from '../../core_physics/math/rng.js';
import { clamp, clamp01 } from '../../core_physics/math/util.js';
import { CoolingSystem } from './cooling.js';

const CATEGORY_MUD = new Set(['mud']);
const CATEGORY_SNOW = new Set(['snow']);

/**
 * Granular component wear and damage.
 *
 *  - radiator punctures (stone / underbody strikes / impacts) -> coolant loss -> overheating -> derate -> seizure
 *  - intercooler blockage from mud, snow and gravel dust, cleared by airflow / engine heat
 *  - bent tie-rods: bump-stop and shock energy bend the toe links, adding permanent toe error
 *  - tyre punctures from sharp gravel (slow pressure loss)
 *  - turbo: overspeed and over-temperature damage -> boost leak
 *  - damper fade with travel
 *  - brake fade / pad wear (BrakeSystem, owned by the vehicle) and clutch / gearbox wear (drivetrain)
 *    are surfaced here so UI can read all wear in one place.
 *
 * All randomness comes from a seeded Rng whose state is part of the snapshot, so a run is reproducible.
 */
export class DamageSystem {
  /**
   * @param {object} cfg damage.json
   * @param {number} ambientK
   * @param {object} [opts] { seed }
   */
  constructor(cfg, ambientK, opts = {}) {
    this.cfg = cfg;
    this.ambientK = ambientK;
    this.cooling = new CoolingSystem(cfg.cooling, ambientK);
    this.rng = new Rng(opts.seed ?? cfg.seed ?? 1);
    this.reset();
  }

  reset() {
    this.cooling.reset();
    this.blockMud = 0;
    this.blockSnow = 0;
    this.blockDust = 0;
    this.tieRodEnergy = [0, 0, 0, 0];
    this.tieRodBend = [0, 0, 0, 0];       // rad of toe error added
    this.tieRodQuiet = [0, 0, 0, 0];
    this.turboDamage = 0;
    this.damperTravel = [0, 0, 0, 0];
    this.events = [];
    this.strikes = 0;
    this.lastZ = null;
    this.totalImpactEnergy = 0;
    this.distance = 0;
    this.underbodyEnergy = 0;
    this.underbodyTime = 0;
    this.hullEnergy = {};
    this.hullQuiet = 0;
    this.hullTime = 0;
  }

  // --- derived quantities consumed by the vehicle ---------------------------------------------------------
  get intercoolerBlockage() { return clamp01(this.blockMud + this.blockSnow + this.blockDust); }
  get coolantK() { return this.cooling.temperatureK; }
  get enginePowerScale() {
    if (this.cooling.seized) return 0;
    return clamp01(1 - 0.85 * this.cooling.engineDamage) * (1 - 0.25 * this.turboDamage);
  }
  get boostLeakScale() { return 1 - (1 - this.cfg.turbo.boostLeakAtFullDamage) * this.turboDamage; }
  get engineSeized() { return this.cooling.seized; }

  // --- impact API -------------------------------------------------------------------------------------------
  /**
   * Register an impact.
   * @param {object} hit
   * @param {'front'|'rear'|'left'|'right'|'underbody'|'wheel'|'stone'} hit.zone
   * @param {number} hit.energy absorbed energy [J]
   * @param {number} [hit.wheel] wheel index for 'wheel' / 'stone' impacts
   */
  applyImpact(hit) {
    const c = this.cfg.impact;
    const E = Math.max(0, hit.energy);
    if (E <= 0) return;
    this.totalImpactEnergy += E;
    const zone = hit.zone;
    if (zone === 'front' || zone === 'underbody' || (zone === 'stone' && hit.target === 'radiator')) {
      const e = zone === 'underbody' ? E * c.underbodyRadiatorEnergyFactor : E;
      if (e > c.radiatorHitEnergyJ) {
        let size;
        if (e <= c.radiatorPunctureEnergyJ) size = 0.03 + 0.17 * clamp01((e - c.radiatorHitEnergyJ) / (c.radiatorPunctureEnergyJ - c.radiatorHitEnergyJ));
        else size = 0.2 + 0.3 * clamp01((e - c.radiatorPunctureEnergyJ) / c.radiatorPunctureEnergyJ);
        this.cooling.addPuncture(size);
        this.events.push({ type: 'radiator_puncture', size, energy: e });
      } else {
        this.cooling.blockage = clamp01(this.cooling.blockage + 0.02 * (e / c.radiatorHitEnergyJ));
      }
    }
    if (zone === 'wheel' || (zone === 'stone' && hit.target === 'tire')) {
      const w = hit.wheel ?? 0;
      if (zone === 'wheel') this.tieRodEnergy[w] += E;
      return;
    }
    if (zone === 'left' || zone === 'right') {
      // side impacts load the wheels on that side
      const ids = zone === 'left' ? [0, 2] : [1, 3];
      for (const i of ids) this.tieRodEnergy[i] += E * 0.5;
    }
    if (zone === 'front') { this.tieRodEnergy[0] += E * 0.25; this.tieRodEnergy[1] += E * 0.25; }
  }

  // --- per-tick update --------------------------------------------------------------------------------------------
  update(dt, vehicle, env = {}) {
    const ch = vehicle.chassis, dr = vehicle.drivetrain, eng = dr.engine;
    const c = this.cfg;
    this.events.length = 0;
    const speed = ch.speed;
    this.distance += speed * dt;

    // ---- cooling & engine health
    this.cooling.update(dt, { fuelMassFlow: eng.mdotFuel, speed, ambientK: this.ambientK });
    if (this.cooling.seized && eng.running) this.events.push({ type: 'engine_seized' });

    // ---- intercooler / radiator fouling from the surface in front of the car
    const front = [ch.wheels[0], ch.wheels[1]];
    let mud = 0, snow = 0, dust = 0;
    for (const w of front) {
      const s = w.surface;
      if (!w.contact || !s || s.looseDepth === undefined) continue;
      const def = vehicle.surfacesLib ? vehicle.surfacesLib.def(s.dominant) : null;
      const cat = def ? def.category : 'none';
      if (CATEGORY_MUD.has(cat)) mud += s.looseDepth * 0.5;
      else if (CATEGORY_SNOW.has(cat)) snow += s.looseDepth * 0.5;
      else if (cat === 'gravel' || cat === 'dirt') dust += Math.max(s.looseDepth, 0.01) * 0.5;
    }
    const ic = c.intercooler;
    const ds = speed * dt;
    this.blockMud = clamp01(this.blockMud + mud * ic.mudBlockPerMeterSplash * ds);
    this.blockSnow = clamp01(this.blockSnow + snow * ic.snowBlockPerMeter * ds);
    this.blockDust = clamp01(this.blockDust + dust * ic.gravelDustBlockPerMeter * ds);
    // airflow blows dust and loose spray off the core in proportion to what is on it
    this.blockDust = clamp01(this.blockDust * (1 - ic.airflowClearRate * (speed / ic.speedForClearing) * dt));
    if (eng.intakeTempK > 330 || this.cooling.temperatureK > 360) this.blockSnow = clamp01(this.blockSnow - 0.02 * dt);
    this.cooling.blockage = clamp01(0.6 * (this.blockMud + this.blockSnow + this.blockDust));

    // ---- tie-rods & dampers
    // Impact energy is integrated over a whole episode (until the wheel has been quiet for
    // `episodeGap`), then evaluated once: a toe link bends in proportion to the energy beyond its
    // yield threshold. Hard shocks that load the wheel laterally count more than purely vertical ones.
    const imp = c.impact;
    for (let i = 0; i < 4; i++) {
      const w = ch.wheels[i];
      const rearFactor = i >= 2 ? 0.5 : 1;
      const lateral = w.fn > 1 ? Math.min(1.5, Math.abs(w.fy) / w.fn) : 0;
      const e = (0.3 * w.impactEnergy + imp.shockToEnergy * w.shockImpulse * 10 * (0.3 + lateral)) * rearFactor;
      if (e > 0) {
        this.tieRodEnergy[i] += e;
        this.tieRodQuiet[i] = 0;
        this.totalImpactEnergy += e;
      } else if (this.tieRodEnergy[i] > 0) {
        this.tieRodQuiet[i] += dt;
        if (this.tieRodQuiet[i] >= imp.episodeGap) {
          if (this.tieRodEnergy[i] > imp.tieRodBendEnergyJ) {
            const bend = (this.tieRodEnergy[i] - imp.tieRodBendEnergyJ) * imp.tieRodBendRadPerJoule * (this.rng.next() < 0.5 ? -1 : 1);
            this.tieRodBend[i] = clamp(this.tieRodBend[i] + bend, -imp.tieRodMaxToeRad, imp.tieRodMaxToeRad);
            this.events.push({ type: 'tie_rod_bent', wheel: i, toeErrorRad: this.tieRodBend[i], energy: this.tieRodEnergy[i] });
          }
          this.tieRodEnergy[i] = 0; this.tieRodQuiet[i] = 0;
        }
      }
      w.toeDamage = this.tieRodBend[i];
      // damper wear with piston travel
      if (this.lastZ) this.damperTravel[i] += Math.abs(w.z - this.lastZ[i]);
      w.damperHealth = clamp(1 - c.damperWearPerMeter * this.damperTravel[i] * 1000, 0.4, 1);
    }
    this.lastZ = ch.wheels.map((w) => w.z);

    // ---- underbody strikes: damage depends on the energy of the whole contact event, not of one tick
    if (ch.underbody.contact) {
      this.underbodyEnergy += ch.underbody.energy;
      this.underbodyTime += dt;
      if (this.underbodyTime >= 0.25) { this.applyImpact({ zone: 'underbody', energy: this.underbodyEnergy }); this.underbodyEnergy = 0; this.underbodyTime = 0; }
    } else if (this.underbodyEnergy > 0) {
      this.applyImpact({ zone: 'underbody', energy: this.underbodyEnergy });
      this.underbodyEnergy = 0; this.underbodyTime = 0;
    }

    // ---- body hull contacts (bumpers / roof) from crashes and rollovers, integrated per contact episode
    // (flushed when contact ends, or every 0.25 s while the car is resting on a body panel)
    if (ch.hullHits.length) {
      for (const h of ch.hullHits) this.hullEnergy[h.zone] = (this.hullEnergy[h.zone] ?? 0) + h.energy;
      this.hullQuiet = 0;
      this.hullTime += dt;
    }
    if (Object.keys(this.hullEnergy).length) {
      if (!ch.hullHits.length) this.hullQuiet += dt;
      if (this.hullTime >= 0.25 || this.hullQuiet >= 0.2) {
        for (const [zone, e] of Object.entries(this.hullEnergy)) {
          if (e < 5) continue;
          if (zone === 'roof' || zone === 'rear') { this.totalImpactEnergy += e; this.events.push({ type: 'body_impact', zone, energy: e }); }
          else this.applyImpact({ zone: 'front', energy: e });
        }
        this.hullEnergy = {}; this.hullQuiet = 0; this.hullTime = 0;
      }
    }

    // ---- stone strikes from loose surfaces (seeded, deterministic)
    const looseDepth = Math.max(front[0].surface?.looseDepth ?? 0, front[1].surface?.looseDepth ?? 0);
    if (looseDepth > 0 && speed > 5) {
      const rate = imp.stoneStrikePerSecondAt30ms * (speed / 30) ** 2 * clamp(looseDepth / imp.looseDepthForStones, 0.2, 3);
      if (this.rng.next() < rate * dt) {
        const roll = this.rng.next();
        const energy = 150 * Math.exp(0.7 * this.rng.gaussian()) * (speed / 30) ** 2;
        this.strikes++;
        if (roll < 0.35) this.applyImpact({ zone: 'stone', target: 'radiator', energy });
        else if (roll < 0.8) {
          const wi = this.rng.int(4);
          if (energy > imp.tireLeakEnergyJ) {
            ch.wheels[wi].tire.leakRate += imp.tireLeakRate * clamp(energy / imp.tireLeakEnergyJ, 1, 4);
            this.events.push({ type: 'tire_puncture', wheel: wi, leakRate: ch.wheels[wi].tire.leakRate });
          }
        } else this.applyImpact({ zone: 'underbody', energy: energy * 0.6 });
      }
    }

    // ---- turbo health
    const t = c.turbo;
    if (eng.turbo.omega > eng.turbo.omegaMax) this.turboDamage = clamp01(this.turboDamage + t.overspeedDamagePerSecond * dt);
    if (eng.exhaustTempK > t.exhaustDamageK) this.turboDamage = clamp01(this.turboDamage + t.exhaustDamagePerSecond * dt);

    // ---- brake health bookkeeping is internal to BrakeSystem (thermal); nothing to push here
  }

  /** Aggregated snapshot for telemetry. */
  summary(vehicle) {
    const dr = vehicle.drivetrain, br = vehicle.brakes, ch = vehicle.chassis;
    return {
      radiator: {
        coolantLevel: this.cooling.level, punctures: this.cooling.punctures.length, holeSize: this.cooling.totalHoleSize,
        leakRate: this.cooling.leakRate, temperatureC: this.cooling.temperatureK - 273.15, blockage: this.cooling.blockage,
      },
      intercooler: { blockage: this.intercoolerBlockage, mud: this.blockMud, snow: this.blockSnow, dust: this.blockDust },
      engine: { damage: this.cooling.engineDamage, seized: this.cooling.seized, powerScale: this.enginePowerScale, turboDamage: this.turboDamage },
      tieRods: this.tieRodBend.map((b) => ({ toeErrorDeg: (b * 180) / Math.PI })),
      brakes: br.discK.map((T, i) => ({ discTempC: T - 273.15, fade: br.fade[i], padWear: br.padWear[i], fluidTempC: br.fluidK[i] - 273.15 })),
      clutch: { wear: dr.clutch.wear, temperatureC: dr.clutch.temperatureK - 273.15 },
      gearbox: { wear: dr.transmission.wear },
      tires: ch.wheels.map((w) => ({ wear: w.tire.wear, pressureKPa: w.tire.pressurePa / 1000, leakRate: w.tire.leakRate })),
      dampers: ch.wheels.map((w) => ({ health: w.damperHealth })),
      stoneStrikes: this.strikes,
    };
  }

  getState() {
    return {
      cooling: this.cooling.getState(), rng: this.rng.getState(), blockMud: this.blockMud, blockSnow: this.blockSnow,
      blockDust: this.blockDust, tieRodEnergy: this.tieRodEnergy.slice(), tieRodBend: this.tieRodBend.slice(), tieRodQuiet: this.tieRodQuiet.slice(),
      turboDamage: this.turboDamage, damperTravel: this.damperTravel.slice(), strikes: this.strikes,
      lastZ: this.lastZ ? this.lastZ.slice() : null, totalImpactEnergy: this.totalImpactEnergy, distance: this.distance,
      underbodyEnergy: this.underbodyEnergy, underbodyTime: this.underbodyTime,
      hullEnergy: { ...this.hullEnergy }, hullQuiet: this.hullQuiet, hullTime: this.hullTime,
    };
  }
  setState(s) {
    this.cooling.setState(s.cooling); this.rng.setState(s.rng);
    this.blockMud = s.blockMud; this.blockSnow = s.blockSnow; this.blockDust = s.blockDust;
    this.tieRodEnergy = s.tieRodEnergy.slice(); this.tieRodBend = s.tieRodBend.slice(); this.tieRodQuiet = s.tieRodQuiet.slice();
    this.turboDamage = s.turboDamage; this.damperTravel = s.damperTravel.slice(); this.strikes = s.strikes;
    this.lastZ = s.lastZ ? s.lastZ.slice() : null; this.totalImpactEnergy = s.totalImpactEnergy; this.distance = s.distance;
    this.underbodyEnergy = s.underbodyEnergy; this.underbodyTime = s.underbodyTime;
    this.hullEnergy = { ...s.hullEnergy }; this.hullQuiet = s.hullQuiet; this.hullTime = s.hullTime;
  }
}
