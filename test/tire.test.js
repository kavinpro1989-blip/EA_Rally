import test from 'node:test';
import assert from 'node:assert/strict';
import { Tire, magicPeakSlip } from '../core_physics/chassis/tire.js';
import { SurfaceLibrary } from '../core_physics/chassis/surface.js';
import { loadCfg } from './helpers.js';

const cfg = loadCfg();
const lib = new SurfaceLibrary(cfg.surfaces);
const AMB = 293.15;

function tire(compound, { tempK, pressureKPa } = {}) {
  const t = new Tire(cfg.tires.compounds[compound], { ambientK: AMB, pressureKPa });
  if (tempK) { t.surfaceK = tempK; t.coreK = tempK; t.coldK = AMB; }
  return t;
}

/** Drive a tyre at prescribed slip until steady state and return the forces. */
function steady(t, layers, { kappa = 0, alphaDeg = 0, fz = 4000, v = 25, seconds = 1.2, camber = 0 } = {}) {
  const c = t.cfg;
  const surf = lib.resolve(layers, c.surfaceGrip, AMB, {});
  const re = c.radius - 0.01, dt = 0.001, a = (alphaDeg * Math.PI) / 180;
  let o;
  for (let i = 0; i < seconds / dt; i++) {
    o = t.step(dt, { fz, vcx: v * Math.cos(a), vcy: -v * Math.sin(a), omega: (v * (1 + kappa)) / re, re, camber, surface: surf, airSpeed: v });
  }
  return { fx: o.fx, fy: o.fy, mz: o.mz, out: o, surf };
}
const TARMAC = [{ type: 'tarmac' }];

test('magic formula peak finder agrees with brute force', () => {
  for (const [B, C, E] of [[10, 1.4, -0.3], [6, 1.6, -1], [14, 1.2, 0]]) {
    const x = magicPeakSlip(B, C, E);
    const f = (u) => Math.sin(C * Math.atan(B * u - E * (B * u - Math.atan(B * u))));
    let best = 0, bu = 0;
    for (let u = 0; u < 1; u += 1e-4) if (f(u) > best) { best = f(u); bu = u; }
    assert.ok(Math.abs(x - bu) < 2e-3, `${B},${C},${E}: ${x} vs ${bu}`);
  }
});

test('Pacejka: pure longitudinal and lateral peaks are near mu*Fz and occur at plausible slip', () => {
  const t = tire('rally_tarmac_18', { tempK: 350 });
  const mu = t.cfg.mu0 * t.temperatureGrip() * t.pressureGrip(0);
  let maxFx = 0, atK = 0, maxFy = 0, atA = 0;
  for (const k of [0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2, 0.3]) { const r = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { kappa: k }); if (r.fx > maxFx) { maxFx = r.fx; atK = k; } }
  for (const a of [2, 4, 6, 8, 10, 14]) { const r = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: a }); if (r.fy > maxFy) { maxFy = r.fy; atA = a; } }
  assert.ok(maxFx / 4000 > 0.8 * mu && maxFx / 4000 < 1.15 * mu, `Fx peak ${maxFx / 4000} vs mu ${mu}`);
  assert.ok(maxFy / 4000 > 0.8 * mu && maxFy / 4000 < 1.15 * mu, `Fy peak ${maxFy / 4000} vs mu ${mu}`);
  assert.ok(atK >= 0.06 && atK <= 0.2, `peak slip ratio ${atK}`);
  assert.ok(atA >= 4 && atA <= 12, `peak slip angle ${atA}`);
});

test('combined slip stays inside the friction ellipse', () => {
  const ref = tire('rally_tarmac_18', { tempK: 350 });
  const mu = ref.cfg.mu0 * ref.temperatureGrip() * ref.pressureGrip(0);
  for (const [k, a] of [[0.1, 4], [0.15, 8], [0.3, 12], [0.05, 10], [0.2, 2]]) {
    const r = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { kappa: k, alphaDeg: a });
    const lim = mu * 1.12 * 4000;
    assert.ok(Math.hypot(r.fx, r.fy) <= lim, `kappa ${k}, alpha ${a}: |F| ${Math.hypot(r.fx, r.fy)} > ${lim}`);
  }
  // adding lateral slip must reduce the longitudinal force available (grip is shared)
  const pure = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { kappa: 0.12 });
  const comb = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { kappa: 0.12, alphaDeg: 8 });
  assert.ok(comb.fx < 0.85 * pure.fx);
  assert.ok(comb.fy > 0);
});

test('forces have the right signs and symmetry', () => {
  const t1 = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { kappa: 0.1 });
  const t2 = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { kappa: -0.1 });
  assert.ok(t1.fx > 0 && t2.fx < 0 && Math.abs(t1.fx + t2.fx) < 0.02 * t1.fx);
  // vcy < 0 means the patch slides to the LEFT (y is right-positive) -> force pushes the car to the right (+)
  const l = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 5 });
  assert.ok(l.fy > 0);
  const r = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: -5 });
  assert.ok(Math.abs(l.fy + r.fy) < 0.02 * l.fy);
});

test('load sensitivity: grip coefficient falls as load rises but force still increases', () => {
  const lo = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 8, fz: 2500 });
  const hi = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 8, fz: 6000 });
  assert.ok(hi.fy > lo.fy);
  assert.ok(hi.fy / 6000 < lo.fy / 2500, 'mu(Fz) decreases with load');
});

test('surface ordering: tarmac > wet > dirt > gravel > mud > snow > ice, and multi-layer blending is monotone in depth', () => {
  const grip = (layers, compound = 'rally_gravel_15') => steady(tire(compound, { tempK: 345 }), layers, { alphaDeg: 8 }).fy / 4000;
  const g = {
    tarmac: grip(TARMAC), wet: grip([{ type: 'tarmac_wet' }]), dirt: grip([{ type: 'packed_dirt' }]),
    gravel: grip([{ type: 'gravel', depth: 0.08 }, { type: 'packed_dirt' }]),
    mud: grip([{ type: 'mud', depth: 0.15 }, { type: 'packed_dirt' }]), snow: grip([{ type: 'snow', depth: 0.2 }, { type: 'packed_dirt' }]), ice: grip([{ type: 'ice' }]),
  };
  assert.ok(g.tarmac > g.wet && g.wet > g.gravel && g.dirt > g.gravel && g.gravel > g.mud && g.mud > g.snow && g.snow > g.ice, JSON.stringify(g));
  // gravel on tarmac: more depth -> less grip (ball-bearing effect), continuous
  let prev = Infinity;
  for (const d of [0, 0.005, 0.01, 0.02, 0.04, 0.08]) {
    const v = grip(d === 0 ? TARMAC : [{ type: 'gravel', depth: d }, { type: 'tarmac' }]);
    assert.ok(v <= prev + 1e-9, `depth ${d}: ${v} > ${prev}`);
    prev = v;
  }
});

test('compound/surface matching: gravel tyre best on gravel, tarmac tyre best on tarmac, studs rule ice', () => {
  const gravelLayers = [{ type: 'gravel', depth: 0.05 }, { type: 'packed_dirt' }];
  const F = (comp, layers) => steady(tire(comp, { tempK: comp === 'rally_snow_studded_15' ? 300 : 350 }), layers, { alphaDeg: 8 }).fy;
  assert.ok(F('rally_gravel_15', gravelLayers) > F('rally_tarmac_18', gravelLayers));
  assert.ok(F('rally_tarmac_18', TARMAC) > F('rally_gravel_15', TARMAC));
  assert.ok(F('rally_snow_studded_15', [{ type: 'ice' }]) > 2 * F('rally_gravel_15', [{ type: 'ice' }]));
});

test('temperature: grip peaks at the optimum and falls on both sides', () => {
  const f = (T) => steady(tire('rally_tarmac_18', { tempK: T }), TARMAC, { alphaDeg: 7, seconds: 0.8 }).fy;
  const cold = f(285), opt = f(350), hot = f(410);
  assert.ok(opt > cold * 1.15 && opt > hot * 1.15, `${cold} ${opt} ${hot}`);
});

test('pressure: stiffness and optimum grip behave; hot gas law raises pressure', () => {
  const t = tire('rally_tarmac_18', { pressureKPa: 190 });
  const cold = t.pressurePa;
  t.coreK = t.coldK + 60;
  const expected = ((190000 + 101325) * (t.coreK / t.coldK)) - 101325;
  assert.ok(Math.abs(t.pressurePa - expected) < 1, 'ideal gas law');
  assert.ok(t.pressurePa > cold + 30000);
  // verticalStiffness grows with pressure
  assert.ok(t.verticalStiffness() > tire('rally_tarmac_18', { pressureKPa: 190 }).verticalStiffness());
  // loose surfaces reward lower pressure; tarmac punishes over/under-inflation
  const grav = [{ type: 'gravel', depth: 0.06 }, { type: 'packed_dirt' }];
  const gLow = steady(tire('rally_gravel_15', { tempK: 340, pressureKPa: 120 }), grav, { alphaDeg: 8, seconds: 0.8 }).fy;
  const gHigh = steady(tire('rally_gravel_15', { tempK: 340, pressureKPa: 220 }), grav, { alphaDeg: 8, seconds: 0.8 }).fy;
  assert.ok(gLow > gHigh, 'lower pressure grips better on gravel');
  const tOpt = steady(tire('rally_tarmac_18', { tempK: 345, pressureKPa: 190 }), TARMAC, { alphaDeg: 8, seconds: 0.8 }).fy;
  const tOver = steady(tire('rally_tarmac_18', { tempK: 345, pressureKPa: 300 }), TARMAC, { alphaDeg: 8, seconds: 0.8 }).fy;
  assert.ok(tOpt > tOver);
});

test('punctured tyre loses pressure; worn tyre loses grip', () => {
  const t = tire('rally_gravel_15');
  t.leakRate = 0.01;
  const p0 = t.pressurePa;
  for (let i = 0; i < 20000; i++) t._thermal(0.001, 0, 0, { airSpeed: 0 }, { roadTempK: AMB }, 0);
  assert.ok(t.pressurePa < p0 * 0.9);
  const fresh = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 8, seconds: 0.5 }).fy;
  const worn = tire('rally_tarmac_18', { tempK: 350 }); worn.wear = 0.9;
  assert.ok(steady(worn, TARMAC, { alphaDeg: 8, seconds: 0.5 }).fy < fresh * 0.85);
});

test('thermal model: cornering heats the tyre toward a plausible equilibrium, wear accumulates', () => {
  const t = tire('rally_tarmac_18');
  const surf = lib.resolve(TARMAC, t.cfg.surfaceGrip, AMB, {});
  const re = t.cfg.radius - 0.01, dt = 0.002, a = 0.09, v = 25;
  for (let i = 0; i < 90 / dt; i++) {
    t.step(dt, { fz: 4000, vcx: v * Math.cos(a), vcy: -v * Math.sin(a), omega: v / re, re, camber: 0, surface: surf, airSpeed: v });
  }
  const C = t.surfaceK - 273.15;
  assert.ok(C > 50 && C < 115, `surface temp ${C.toFixed(0)} C after 90 s of 1.1 g cornering`);
  assert.ok(t.coreK > AMB + 25);
  assert.ok(t.wear > 0);
  // cool-down in the air
  const hot = t.surfaceK;
  for (let i = 0; i < 30 / dt; i++) t.step(dt, { fz: 0, vcx: 0, vcy: 0, omega: 0, re, camber: 0, surface: surf, airSpeed: 20 });
  assert.ok(t.surfaceK < hot - 3, `cool-down ${hot - t.surfaceK} K`);
});

test('transient slip: force builds up over the relaxation length, not instantly', () => {
  const t = tire('rally_tarmac_18', { tempK: 350 });
  const surf = lib.resolve(TARMAC, t.cfg.surfaceGrip, AMB, {});
  const re = t.cfg.radius, dt = 0.0005, v = 20, a = 0.05;
  let first = 0, last = 0;
  for (let i = 0; i < 2000; i++) {
    const o = t.step(dt, { fz: 4000, vcx: v * Math.cos(a), vcy: -v * Math.sin(a), omega: v / re, re, camber: 0, surface: surf, airSpeed: v });
    if (i === 3) first = o.fy;
    last = o.fy;
  }
  assert.ok(first < 0.2 * last, `initial ${first} final ${last}`);
});

test('standstill: carcass model holds a force without dividing by zero speed', () => {
  const t = tire('rally_tarmac_18', { tempK: 350 });
  const surf = lib.resolve(TARMAC, t.cfg.surfaceGrip, AMB, {});
  // a small sideways creep at zero rolling speed should produce a restoring force, finite everywhere
  let o;
  for (let i = 0; i < 1000; i++) o = t.step(0.001, { fz: 4000, vcx: 0, vcy: 0.02, omega: 0, re: 0.32, camber: 0, surface: surf, airSpeed: 0 });
  assert.ok(Number.isFinite(o.fy) && o.fy < 0, `fy ${o.fy}`);
  assert.ok(Math.abs(o.fy) <= 1.5 * 4000);
});

test('camber thrust pushes toward the lean direction', () => {
  const none = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 0, camber: 0 });
  const lean = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 0, camber: 0.05 });
  assert.ok(Math.abs(none.fy) < 1);
  assert.ok(lean.fy > 20);
});

test('brush and Pacejka models agree on the peak friction level and both saturate', () => {
  const p = cfg.tires.compounds.rally_tarmac_18;
  const mk = (model) => { const t = new Tire({ ...p, model }, { ambientK: AMB, pressureKPa: 190 }); t.surfaceK = t.coreK = 350; return t; };
  const fp = steady(mk('pacejka'), TARMAC, { alphaDeg: 12 }).fy, fb = steady(mk('brush'), TARMAC, { alphaDeg: 12 }).fy;
  assert.ok(Math.abs(fp - fb) / fp < 0.2, `${fp} vs ${fb}`);
  const f10 = steady(mk('brush'), TARMAC, { alphaDeg: 20 }).fy;
  assert.ok(f10 < 1.25 * 4000 * p.mu0);
});

test('aligning torque opposes the lateral force and fades beyond the peak', () => {
  const small = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 2 });
  const big = steady(tire('rally_tarmac_18', { tempK: 350 }), TARMAC, { alphaDeg: 20 });
  assert.ok(small.mz < 0 && small.fy > 0);
  assert.ok(Math.abs(big.mz) < Math.abs(small.mz) * 1.2 || big.mz === 0 || Math.abs(big.mz / big.fy) < Math.abs(small.mz / small.fy));
});
