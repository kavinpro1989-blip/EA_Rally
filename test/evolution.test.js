import test from 'node:test';
import assert from 'node:assert/strict';
import { Stage } from '../systems/stage/stage.js';
import { SurfaceEvolution } from '../systems/surface_evolution/surface_evolution.js';
import { SurfaceLibrary } from '../core_physics/chassis/surface.js';
import { Tire } from '../core_physics/chassis/tire.js';
import { loadCfg, syntheticStage, stageSim } from './helpers.js';

const cfg = loadCfg();
const lib = new SurfaceLibrary(cfg.surfaces);
const GRAVEL = [{ type: 'gravel', depth: 0.05 }, { type: 'packed_dirt' }];

function setup(layers = GRAVEL, segments = [['straight', 500]]) {
  const stage = Stage.fromJson(syntheticStage({ segments, layers, width: 8 }), cfg.gpsStageSchema, { surfaces: lib });
  const evo = new SurfaceEvolution(stage.spline, lib, {});
  stage.terrain.setEvolution(evo);
  return { stage, evo };
}
const rowSum = (evo, s, field = 'dLoose') => {
  const r = Math.round(s / evo.ds);
  let sum = 0;
  for (let j = 0; j < evo.cols; j++) sum += evo[field][evo._idx(r, j)];
  return sum;
};
const pass = (evo, o) => evo.applyPass({ s: 100, c: 0, distance: 1, load: 3500, width: 0.2, slip: 0, lateralBias: 0, layers: GRAVEL, ...o });

test('gravel sweeping: repeated passes clear the wheel path and pile berms on both flanks', () => {
  const { evo } = setup();
  const depthAt = (c) => evo.meanLooseDepth(100, c - 0.05, c + 0.05);
  const before = depthAt(0);
  assert.ok(Math.abs(before - 0.05) < 1e-6);
  let prev = before;
  for (let n = 1; n <= 30; n++) {
    pass(evo, {});
    if (n % 5 === 0) { const d = depthAt(0); assert.ok(d < prev, `pass ${n}: ${d} !< ${prev}`); prev = d; }
  }
  assert.ok(depthAt(0) < 0.5 * before, `path depth after 30 passes ${depthAt(0)}`);
  assert.ok(depthAt(0.25) > before, 'right berm');
  assert.ok(depthAt(-0.25) > before, 'left berm');
});

test('gravel volume is conserved (nothing is created or destroyed away from the road edge)', () => {
  const { evo } = setup();
  for (let n = 0; n < 60; n++) pass(evo, { slip: 0.5 });
  const net = rowSum(evo, 100);
  assert.ok(Math.abs(net) < 1e-4, `net change ${net}`);
  assert.ok(evo.stats.swept > 0);
});

test('sweep direction follows the sliding direction; slip and load increase sweeping', () => {
  const right = setup().evo, left = setup().evo;
  for (let n = 0; n < 12; n++) { pass(right, { lateralBias: 1 }); pass(left, { lateralBias: -1 }); }
  const sideDepth = (e, c) => e.dLoose[e._idx(100, Math.round((c + e.halfWidth) / e.dc))];   // exact flank cell
  assert.ok(sideDepth(right, 0.25) > sideDepth(right, -0.25) + 0.01, `${sideDepth(right, 0.25)} vs ${sideDepth(right, -0.25)}`);
  assert.ok(sideDepth(left, -0.25) > sideDepth(left, 0.25) + 0.01);
  const slow = setup().evo, sliding = setup().evo, heavy = setup().evo;
  for (let n = 0; n < 10; n++) { pass(slow, { slip: 0 }); pass(sliding, { slip: 1 }); pass(heavy, { load: 9000 }); }
  const d = (e) => e.meanLooseDepth(100, -0.1, 0.1);
  assert.ok(d(sliding) < d(slow) - 0.003, 'sliding tyres dig deeper');
  assert.ok(d(heavy) < d(slow) - 0.003, 'heavier load sweeps more');
});

test('nothing is swept off tarmac or ice; hard surfaces do not rut', () => {
  const { evo } = setup([{ type: 'tarmac' }]);
  for (let n = 0; n < 30; n++) pass(evo, { layers: [{ type: 'tarmac' }] });
  assert.equal(evo.stats.swept, 0);
  assert.equal(Math.max(...evo.rut.map(Math.abs)), 0);
  const ice = setup([{ type: 'ice' }]).evo;
  for (let n = 0; n < 30; n++) pass(ice, { layers: [{ type: 'ice' }] });
  assert.equal(Math.max(...ice.rut.map(Math.abs)), 0);
});

test('rutting: mud and snow rut under load towards the bearing-capacity depth with ridges alongside; light loads do not', () => {
  const MUD = [{ type: 'mud', depth: 0.1 }, { type: 'packed_dirt' }];
  const { evo } = setup(MUD);
  const mud = (o) => evo.applyPass({ s: 100, c: 0, distance: 1, load: 4000, width: 0.2, slip: 0, lateralBias: 0, layers: MUD, ...o });
  for (let n = 0; n < 25; n++) mud({});
  const depth = evo.sample(100, 0).rut;
  assert.ok(depth > 0.03 && depth <= 0.2 + 1e-6, `rut ${depth}`);
  const ridge = Math.min(evo.sample(100, 0.25).rut, evo.sample(100, -0.25).rut);
  assert.ok(ridge < 0, `ridge ${ridge}`);
  const light = setup(MUD).evo;
  for (let n = 0; n < 25; n++) light.applyPass({ s: 100, c: 0, distance: 1, load: 600, width: 0.2, slip: 0, lateralBias: 0, layers: MUD });
  assert.equal(light.sample(100, 0).rut, 0, 'below bearing pressure no rut forms');
  // rut deepens with more passes up to a limit, never beyond maxRut
  for (let n = 0; n < 200; n++) mud({ load: 9000 });
  assert.ok(evo.sample(100, 0).rut <= 0.2 + 1e-6);
});

test('compaction packs fresh snow into packed snow, which grips better', () => {
  const SNOW = [{ type: 'snow', depth: 0.12 }, { type: 'packed_dirt' }];
  const { evo } = setup(SNOW);
  const layersNow = () => evo.layersAt(SNOW, 100, 0);
  assert.equal(layersNow()[0].type, 'snow');
  for (let n = 0; n < 120; n++) evo.applyPass({ s: 100, c: 0, distance: 1, load: 4000, width: 0.2, slip: 0, lateralBias: 0, layers: SNOW });
  assert.ok(evo.sample(100, 0).compaction > 0.5);
  const packed = layersNow();
  assert.equal(packed[0].type, 'snow_packed');
  const grip = (layers) => lib.resolve(layers, cfg.tires.compounds.rally_snow_studded_15.surfaceGrip, 280, {}).friction;
  assert.ok(grip(packed) > grip(SNOW), `${grip(packed)} vs ${grip(SNOW)}`);
});

test('berms slump to the angle of repose without losing material', () => {
  const { evo } = setup();
  const r = Math.round(150 / evo.ds), jc = Math.floor(evo.cols / 2);
  evo.dLoose[evo._idx(r, jc)] = 0.5;                   // a tall spike of gravel on its own (stable slope is 0.15 m per cell)
  const before = rowSum(evo, 150);
  evo.dirtyRows.add(r);
  for (let i = 0; i < 80; i++) { evo.relax(0.25); evo.dirtyRows.add(r); }
  const after = rowSum(evo, 150);
  assert.ok(Math.abs(after - before) < 1e-5, `mass ${before} -> ${after}`);
  assert.ok(evo.dLoose[evo._idx(r, jc)] < 0.3, `spike ${evo.dLoose[evo._idx(r, jc)]}`);
  const repose = lib.def('gravel').evolution.reposeSlope * evo.dc;
  for (let j = 0; j < evo.cols - 1; j++) {
    const a = evo.dLoose[evo._idx(r, j)], b = evo.dLoose[evo._idx(r, j + 1)];
    assert.ok(Math.abs(a - b) <= repose * 1.5 + 1e-4, `cell ${j}: ${a} vs ${b}`);
  }
});

test('terrain integration: ruts lower the surface and tilt the normal at the walls; swept lines expose firmer ground', () => {
  const MUD = [{ type: 'mud', depth: 0.1 }, { type: 'packed_dirt' }];
  const { stage, evo } = setup(MUD);
  const sp = stage.spline, T = stage.terrain;
  const p0 = sp.pointAt(100, 0);
  const flat = T.sample(p0.x, p0.z);
  for (let n = 0; n < 30; n++) evo.applyPass({ s: 100, c: 0, distance: 1, load: 4500, width: 0.25, slip: 0, lateralBias: 0, layers: MUD });
  const rutted = T.sample(p0.x, p0.z);
  const depth = evo.sample(100, 0).rut;
  assert.ok(depth > 0.03);
  assert.ok(Math.abs((flat.height - rutted.height) - depth) < 0.01, `height drop ${flat.height - rutted.height} vs rut ${depth}`);
  // wall of the rut: normal leans toward the rut centre
  const pw = sp.pointAt(100, 0.16);
  const wall = T.sample(pw.x, pw.z);
  const lateralLean = wall.nx * sp.sampleAt(100).rx + wall.nz * sp.sampleAt(100).rz;
  assert.ok(Math.abs(lateralLean) > 0.02, `lean ${lateralLean}`);
  // layer stack in the rut is deeper mud (more sinkage), lowering friction
  const g = (layers) => lib.resolve(layers, cfg.tires.compounds.rally_gravel_15.surfaceGrip, 290, {});
  assert.ok(rutted.layers[0].sinkage > 0.03, 'rut depth is carried as sinkage');
  assert.ok(g(rutted.layers).rollingResistance > g(flat.layers).rollingResistance);

  // gravel swept off the line -> more grip (hard base shows through)
  const G = setup(GRAVEL);
  for (let n = 0; n < 60; n++) G.evo.applyPass({ s: 100, c: 0, distance: 1, load: 3500, width: 0.2, slip: 0.4, lateralBias: 0, layers: GRAVEL });
  const pg = G.stage.spline.pointAt(100, 0);
  const swept = G.stage.terrain.sample(pg.x, pg.z).layers;
  assert.ok((swept[0]?.depth ?? 0) < 0.03);
  assert.ok(g(swept).friction > g(GRAVEL).friction, `${g(swept).friction} vs ${g(GRAVEL).friction}`);
  const tire = new Tire(cfg.tires.compounds.rally_gravel_15, { ambientK: 290 });
  assert.ok(tire && tire.cfg.mu0 > 0);
});

test('seedWithPasses ages the stage: a clean racing line with berms through a corner', () => {
  const { stage, evo } = setup(GRAVEL, [['straight', 150], ['arc', 90, 60], ['straight', 150]]);
  evo.seedWithPasses(25, { seed: 7 });
  assert.ok(evo.stats.passes > 5000);
  const sCorner = 150 + (Math.PI / 2) * 60 / 2;
  const f = stage.spline.sampleAt(sCorner);
  // left corner: the line is on the inside (left, negative c)
  const inside = evo.meanLooseDepth(sCorner, -2.2, -0.8), outside = evo.meanLooseDepth(sCorner, 1.4, 2.6);
  const min = Math.min(...Array.from({ length: 30 }, (_, i) => evo.meanLooseDepth(sCorner, -3 + i * 0.2, -2.8 + i * 0.2)));
  assert.ok(min < 0.03, `swept line depth ${min}`);
  const max = Math.max(...Array.from({ length: 40 }, (_, i) => evo.meanLooseDepth(sCorner, -3.6 + i * 0.2, -3.4 + i * 0.2)));
  assert.ok(max > 0.055, `berm height ${max}`);
  void f; void inside; void outside;
});

test('snapshots: state and hash round-trip exactly; incompatible grids are rejected', () => {
  const { evo } = setup(GRAVEL);
  for (let n = 0; n < 20; n++) pass(evo, { slip: 0.3, lateralBias: 0.4 });
  const snap = JSON.parse(JSON.stringify(evo.getState()));
  const { evo: other } = setup(GRAVEL);
  assert.notEqual(other.stateHash(), evo.stateHash());
  other.setState(snap);
  assert.equal(other.stateHash(), evo.stateHash());
  assert.deepEqual(Array.from(other.dLoose), Array.from(evo.dLoose));
  const { evo: small } = setup(GRAVEL, [['straight', 200]]);
  assert.throws(() => small.setState(snap), /different grid/);
  evo.reset();
  assert.equal(Math.max(...evo.dLoose.map(Math.abs)), 0);
});

test('driving the stage evolves it: the second car meets less loose gravel on the line', () => {
  const stageJson = syntheticStage({ segments: [['straight', 800]], layers: GRAVEL, width: 8 });
  const sim = stageSim(stageJson, null, { compoundFront: 'rally_gravel_15', compoundRear: 'rally_gravel_15' });
  const lapDepth = () => {
    sim.placeOnStage({ s: 20, speed: 18 });
    sim.vehicle.drivetrain.transmission.reset(3);
    let sum = 0, n = 0;
    for (let i = 0; i < 20 / 0.002; i++) {
      const v = sim.vehicle.chassis.speed;
      sim.setInputs({ throttle: Math.max(0, Math.min(1, 0.35 + (18 - v) * 0.2)), steer: -sim.runtime.c * 0.06 });
      sim.step();
      const w = sim.vehicle.chassis.wheels[0];
      if (i % 10 === 0 && w.contact) { sum += w.surface.looseDepth; n++; }
    }
    return sum / n;
  };
  const first = lapDepth();
  const second = lapDepth();
  assert.ok(sim.evolution.stats.passes > 1000);
  assert.ok(second < first * 0.9, `loose depth under the tyre ${first.toFixed(4)} -> ${second.toFixed(4)}`);
});
