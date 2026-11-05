import { clamp, clamp01 } from '../math/util.js';
import { P_ATM } from '../math/constants.js';

/** Peak position of the magic formula sin(C atan(Bx - E(Bx - atan Bx))) -> x at maximum. */
export function magicPeakSlip(B, C, E) {
  const phiP = Math.tan(Math.PI / (2 * C));
  let x = phiP / (B * (1 - E));
  for (let i = 0; i < 4; i++) {
    const bx = B * x;
    const g = (1 - E) * bx + E * Math.atan(bx) - phiP;
    const dg = (1 - E) * B + (E * B) / (1 + bx * bx);
    x -= g / dg;
    if (!(x > 0)) x = phiP / (B * (1 - E));
  }
  return x;
}

function magic(x, B, C, E) {
  const bx = B * x;
  return Math.sin(C * Math.atan(bx - E * (bx - Math.atan(bx))));
}

/**
 * Tyre with transient (relaxation-length) combined slip, Pacejka or Brush force generation,
 * two-node thermal model, gas-law pressure, leak and tread wear.
 *
 * Slip is driven through carcass deflection states (u_x, u_y) so the model is well behaved
 * at standstill (no division by speed) and low-pass filters slip like a real tyre:
 *     du/dt = s - (V/sigma) u,  slip = u/sigma,  V = max(|v_x|, |w R_e|, v_min)
 *
 * Tyre frame: x forward along the wheel heading, y to the RIGHT, z = surface normal (up).
 * Forces: +Fx accelerates the car, +Fy pushes the car to the right.
 */
export class Tire {
  /**
   * @param {object} cfg compound config (tires.json compounds[name])
   * @param {object} setup { pressureKPa (cold gauge), ambientK }
   */
  constructor(cfg, setup) {
    this.cfg = cfg;
    this.ambientK = setup.ambientK;
    this.coldK = setup.coldK ?? setup.ambientK;
    this.pressureColdPa = (setup.pressureKPa ?? cfg.nominalPressureKPa) * 1000;   // gauge at cold temp
    this.leakRate = 0;           // 1/s fraction of excess pressure lost per second
    this.reset();
  }

  reset() {
    this.ux = 0; this.uy = 0;
    this.surfaceK = this.coldK;
    this.coreK = this.coldK;
    this.wear = 0;
    this.out = {
      fx: 0, fy: 0, mz: 0, kappa: 0, tanAlpha: 0, power: 0, muX: 0, muY: 0, gripScale: 1,
      slideSpeedX: 0, slideSpeedY: 0, rollingMoment: 0, saturation: 0,
    };
  }

  /** Hot gauge pressure [Pa] from the ideal gas law (constant volume). */
  get pressurePa() {
    const abs = (this.pressureColdPa + P_ATM) * (this.coreK / this.coldK);
    return abs - P_ATM;
  }

  /** Radial stiffness [N/m]: grows with inflation pressure. */
  verticalStiffness() {
    const c = this.cfg;
    const dp = (this.pressurePa / 1000 - c.nominalPressureKPa) / c.nominalPressureKPa;
    return c.verticalStiffness * clamp(1 + c.pressure.stiffnessSens * dp, 0.5, 1.8);
  }

  /** Grip multiplier from rubber temperature. */
  temperatureGrip() {
    const t = this.cfg.temperature;
    const d = this.surfaceK - t.optimalK;
    const w = d < 0 ? t.coldWidth : t.hotWidth;
    const x = d / w;
    return t.minGrip + (1 - t.minGrip) * Math.exp(-x * x);
  }

  /** Grip multiplier from pressure; loose surfaces reward lower pressure (bigger footprint). */
  pressureGrip(surfPressureSens) {
    const c = this.cfg;
    const pk = this.pressurePa / 1000;
    const rel = (pk - c.optimalPressureKPa) / c.optimalPressureKPa;
    return clamp(1 - c.pressure.gripQuad * rel * rel - surfPressureSens * rel, 0.5, 1.25);
  }

  /**
   * Advance tyre state and compute contact forces.
   * @param {number} dt
   * @param {object} p
   * @param {number} p.fz normal load [N] (>0 when in contact)
   * @param {number} p.vcx @param {number} p.vcy contact point velocity in tyre frame [m/s]
   * @param {number} p.omega wheel spin [rad/s]  @param {number} p.re effective rolling radius [m]
   * @param {number} p.camber lean of the wheel top to the RIGHT, rad
   * @param {object} p.surface resolved surface (SurfaceLibrary.resolve)
   * @param {number} p.airSpeed speed of air relative to the tyre [m/s]
   */
  step(dt, p) {
    const c = this.cfg, o = this.out, s = p.surface;
    const fz = Math.max(p.fz, 0);
    if (fz <= 0) {
      // Airborne: carcass relaxes, tyre cools towards ambient
      this.ux *= Math.exp(-dt * 30); this.uy *= Math.exp(-dt * 30);
      o.fx = o.fy = o.mz = o.power = 0; o.rollingMoment = 0; o.saturation = 0;
      this._thermal(dt, 0, 0, p, s, 0);
      return o;
    }

    const fzN = fz / c.nominalLoad;
    const sigma = Math.max(0.05, c.relaxationLength * (0.6 + 0.4 * fzN));
    const vmin = c.minSpeed;
    const V = Math.max(Math.abs(p.vcx), Math.abs(p.omega * p.re), vmin);
    const sx = p.omega * p.re - p.vcx;
    const sy = -p.vcy;
    const lam = V / sigma;
    const e = Math.exp(-lam * dt);
    const k1 = (1 - e) / lam;
    this.ux = this.ux * e + sx * k1;
    this.uy = this.uy * e + sy * k1;
    const cl = sigma * c.slipClamp;
    this.ux = clamp(this.ux, -cl, cl);
    this.uy = clamp(this.uy, -cl, cl);

    const kappa = this.ux / sigma;
    const tanAlphaCarcass = this.uy / sigma;
    const tanAlpha = tanAlphaCarcass + c.camberStiffnessRatio * p.camber;

    // --- friction & stiffness scaling ---------------------------------------------------------
    const gT = this.temperatureGrip();
    const gP = this.pressureGrip(s.pressureSensitivity);
    const gW = 1 - c.wear.gripLoss * this.wear;
    const loadSens = clamp(1 - c.loadSensitivity * (fzN - 1), 0.5, 1.3);
    const grip = gT * gP * gW * loadSens;
    const muX = c.mu0 * s.friction * grip;
    const muY = muX * c.muRatioY;
    const dp = (this.pressurePa / 1000 - c.nominalPressureKPa) / c.nominalPressureKPa;
    const stiffScale = s.stiffness * clamp(1 + c.pressure.stiffnessSens * 0.5 * dp, 0.6, 1.5) *
                       clamp(1 - c.temperature.stiffnessSens * (this.surfaceK - c.temperature.optimalK) / 100, 0.7, 1.25) *
                       (1 - 0.15 * this.wear);
    const loadShape = Math.sin(2 * Math.atan(fz / (c.stiffness.peakLoadRatio * c.nominalLoad)));
    const Ck = c.stiffness.longitudinal * c.nominalLoad * loadShape * stiffScale;   // N per unit slip ratio
    const Ca = c.stiffness.lateral * c.nominalLoad * loadShape * stiffScale;        // N per unit tan(alpha)
    const Dx = muX * fz, Dy = muY * fz;

    let fx = 0, fy = 0, sat = 0;
    let alphaPeak;
    if (c.model === 'brush') {
      alphaPeak = Math.max(1e-3, (3 * Dy) / Ca);
      // Anisotropic brush model with parabolic pressure distribution
      const thx = Ck / (3 * Dx), thy = Ca / (3 * Dy);
      const phx = thx * kappa, phy = thy * tanAlpha;
      const ph = Math.hypot(phx, phy);
      if (ph > 1e-9) {
        // Stribeck-like drop from peak to sliding friction with slip speed
        const vslip = Math.hypot(sx, sy);
        const sl = s.slideRatio;
        const drop = sl + (1 - sl) * Math.exp(-vslip / c.brush.stribeckSpeed);
        const f = ph < 1 ? 1 - Math.pow(1 - ph, 3) : 1;
        fx = Dx * drop * f * (phx / ph);
        fy = Dy * drop * f * (phy / ph);
        sat = Math.min(1, ph);
      }
    } else {
      // Pacejka magic formula, pure-slip curves combined through the normalised slip vector
      const rho = clamp(s.slideRatio, 0.3, 0.999);
      const C = Math.max(c.pacejka.shapeMin, 2 - (2 / Math.PI) * Math.asin(rho));
      const Bx = Ck / (C * Dx), By = Ca / (C * Dy);
      const kp = magicPeakSlip(Bx, C, c.pacejka.Ex);
      const ap = magicPeakSlip(By, C, c.pacejka.Ey);
      alphaPeak = ap;
      const nx = kappa / kp, ny = tanAlpha / ap;
      const sn = Math.hypot(nx, ny);
      if (sn > 1e-9) {
        fx = (nx / sn) * Dx * magic(sn * kp, Bx, C, c.pacejka.Ex);
        fy = (ny / sn) * Dy * magic(sn * ap, By, C, c.pacejka.Ey);
        sat = Math.min(1, sn);
      }
    }

    // --- self-aligning torque (pneumatic trail) --------------------------------------------------
    const trail = c.pneumaticTrail * Math.max(0, 1 - Math.abs(tanAlpha) / (1.8 * alphaPeak));
    const mz = -fy * trail;

    // --- rolling resistance (moment on the wheel, felt as a slightly negative slip) ---------------------
    const dpr = (this.pressurePa / 1000 - c.nominalPressureKPa) / c.nominalPressureKPa;
    const crr = s.rollingResistance * c.rollingResistance * clamp(1 - 0.5 * dpr, 0.7, 1.5) + c.rollingSpeedCoeff * p.vcx * p.vcx;
    const rollingMoment = crr * fz * p.re * Math.tanh((p.omega * p.re) / 0.5);

    // --- heat, pressure, wear ------------------------------------------------------------------------
    const slideX = Math.abs(lam * this.ux);
    const slideY = Math.abs(lam * this.uy);
    const power = Math.abs(fx) * slideX + Math.abs(fy) * slideY;
    this._thermal(dt, power, Math.abs(rollingMoment * p.omega), p, s, fz);

    o.fx = fx; o.fy = fy; o.mz = mz; o.kappa = kappa; o.tanAlpha = tanAlpha; o.power = power;
    o.muX = muX; o.muY = muY; o.gripScale = grip; o.slideSpeedX = slideX; o.slideSpeedY = slideY;
    o.rollingMoment = rollingMoment; o.saturation = sat;
    return o;
  }

  _thermal(dt, slipPower, hystPower, p, s, fz) {
    const c = this.cfg, t = c.thermal;
    const v = Math.max(p.airSpeed, 0);
    const h = t.convection0 + t.convection1 * Math.pow(v, 0.8);
    const amb = this.ambientK;
    const roadK = s.roadTempK ?? amb;
    const patch = fz > 0 ? clamp(fz / c.nominalLoad, 0.2, 2.5) : 0;
    const qSurface = t.slipHeatFraction * t.surfacePartition * slipPower;
    const qCore = t.slipHeatFraction * (1 - t.surfacePartition) * slipPower + hystPower * t.hysteresisFraction;
    const gSurfAir = t.surfaceArea * h;
    const gCoreAir = t.coreArea * h * t.coreConvectionRatio;
    const gRoad = t.roadConductance * patch * (s.heatTransfer ?? 1);
    const gSC = t.surfaceCoreConductance;
    const dTs = (qSurface - gSurfAir * (this.surfaceK - amb) - gSC * (this.surfaceK - this.coreK) - gRoad * (this.surfaceK - roadK)) / t.surfaceHeatCapacity;
    const dTc = (qCore + gSC * (this.surfaceK - this.coreK) - gCoreAir * (this.coreK - amb)) / t.coreHeatCapacity;
    this.surfaceK += dTs * dt;
    this.coreK += dTc * dt;
    this.surfaceK = clamp(this.surfaceK, 200, 450);
    this.coreK = clamp(this.coreK, 200, 420);

    // wear: abrasive energy, accelerated when the rubber is overheated
    const over = Math.max(0, this.surfaceK - c.temperature.optimalK - c.wear.overheatMarginK) / 50;
    this.wear = clamp01(this.wear + (slipPower * dt * (s.abrasiveness ?? 1) * (1 + 2 * over)) / c.wear.energyToWorn);
    // slow puncture: excess cold pressure leaks away
    if (this.leakRate > 0) this.pressureColdPa = Math.max(0, this.pressureColdPa * Math.exp(-this.leakRate * dt));
  }

  getState() {
    return {
      ux: this.ux, uy: this.uy, surfaceK: this.surfaceK, coreK: this.coreK, wear: this.wear,
      pressureColdPa: this.pressureColdPa, leakRate: this.leakRate, out: { ...this.out },
    };
  }
  setState(s) { Object.assign(this, s, { out: { ...s.out } }); }
}

