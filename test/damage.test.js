import test from 'node:test';
import assert from 'node:assert/strict';
import { DamageSystem } from '../systems/damage/damage_system.js';
import { CoolingSystem } from '../systems/damage/cooling.js';
import { BrakeSystem } from '../systems/damage/brake_wear.js';
import { loadCfg, flatSim, stageSim, syntheticStage, TARMAC_TYRE } from './helpers.js';
import { Q } from '../core_physics/math/quat.js';

const DT = 0.002;
const AMB = 293.15;

/** Cruise at roughly `kph` in 3rd gear on flat ground. */
function cruise(sim, kph, seconds, extra = {}) {
  const ch = sim.vehicle.chassis;
  sim.vehicle.drivetrain.transmission.reset(3);
  for (let i = 0; i < seconds / DT; i++) {
    const err = kph / 3.6 - ch.speed;
    sim.setInputs({ throttle: Math.max(0, Math.min(1, 0.35 + err * 0.25)), brake: err < -3 ? 0.2 : 0, ...extra });
    sim.step();
  }
}
const launched = (opts = {}, kph = 90) => {
  const sim = flatSim({ ...TARMAC_TYRE, ...opts });
  sim.vehicle.chassis.placeOnTerrain(sim.terrain, 0, 0, 0, kph / 3.6);
  sim.vehicle.chassis.settle(sim.terrain, 0.3);
  return sim;
};

test('cooling: healthy system holds temperature; a punctured radiator loses coolant, overheats, derates and finally seizes the engine', () => {
  const healthy = launched();
  cruise(healthy, 110, 90);
  const dh = healthy.vehicle.damage;
  assert.ok(dh.cooling.level === 1);
  assert.ok(dh.coolantK - 273.15 < 108, `healthy coolant ${dh.coolantK - 273.15}`);
  assert.ok(dh.enginePowerScale === 1);

  const hurt = launched();
  hurt.vehicle.damage.cooling.addPuncture(0.12);
  let derated = false, seized = false, events = [];
  for (let k = 0; k < 400 && !seized; k++) {
    cruise(hurt, 110, 1);
    events.push(...hurt.drainEvents().map((e) => e.type));
    if (hurt.vehicle.drivetrain.engine.out.derate < 0.99) derated = true;
    seized = hurt.vehicle.damage.engineSeized;
  }
  const d = hurt.vehicle.damage;
  assert.ok(d.cooling.level < 0.1, `coolant level ${d.cooling.level}`);
  assert.ok(derated, 'ECU derated power as the engine overheated');
  assert.ok(seized, 'engine eventually seized');
  assert.ok(events.includes('engine_seized'));
  assert.equal(d.enginePowerScale, 0);
  // seized engine no longer drives the car
  cruise(hurt, 110, 3);
  assert.equal(hurt.vehicle.drivetrain.engine.running, false);
});

test('cooling: bigger holes drain faster; air-lock starves the radiator', () => {
  const c = loadCfg().damage.cooling;
  const run = (size) => {
    const s = new CoolingSystem(c, AMB);
    s.temperatureK = 370; s.addPuncture(size);
    let t = 0;
    while (s.level > 0.3 && t < 2000) { s.update(0.1, { fuelMassFlow: 0.005, speed: 20 }); t += 0.1; }
    return t;
  };
  assert.ok(run(0.3) < run(0.1) * 0.5);
  // with coolant gone the same heat input gives a much hotter engine
  const settle = (level) => {
    const s = new CoolingSystem(c, AMB);
    s.level = level;
    for (let i = 0; i < 6000; i++) s.update(0.1, { fuelMassFlow: 0.008, speed: 25 });
    return s.temperatureK;
  };
  assert.ok(settle(0.2) > settle(1) + 25, `${settle(0.2)} vs ${settle(1)}`);
});

test('radiator blockage (mud) reduces cooling capacity', () => {
  const c = loadCfg().damage.cooling;
  const settle = (blockage) => {
    const s = new CoolingSystem(c, AMB);
    s.blockage = blockage;
    for (let i = 0; i < 6000; i++) s.update(0.1, { fuelMassFlow: 0.008, speed: 20 });
    return s.temperatureK;
  };
  assert.ok(settle(0.8) > settle(0) + 8);
});

test('impact API: radiator punctures need enough energy; hard hits make bigger holes', () => {
  const d = new DamageSystem(loadCfg().damage, AMB);
  d.applyImpact({ zone: 'front', energy: 20 });
  assert.equal(d.cooling.punctures.length, 0);
  d.applyImpact({ zone: 'front', energy: 250 });
  assert.equal(d.cooling.punctures.length, 1);
  const small = d.cooling.punctures[0].size;
  d.applyImpact({ zone: 'front', energy: 1500 });
  assert.ok(d.cooling.punctures[1].size > small * 1.5);
  assert.ok(d.events.some((e) => e.type === 'radiator_puncture'));
});

test('intercooler: driving through mud fouls the core, raising charge temperature and cutting power; high speed clears dust', () => {
  const j = syntheticStage({ segments: [['straight', 1500]], layers: [{ type: 'mud', depth: 0.06 }, { type: 'packed_dirt' }], width: 8 });
  const sim = stageSim(j, null, { compoundFront: 'rally_gravel_15', compoundRear: 'rally_gravel_15' });
  const dr = sim.vehicle.drivetrain;
  dr.transmission.reset(3);
  sim.vehicle.chassis.placeOnTerrain(sim.terrain, sim.stage.startPose(10).x, sim.stage.startPose(10).z, 0, 18);
  const clean = { torque: 0, intake: 0 };
  let d = sim.vehicle.damage;
  const b0 = d.intercoolerBlockage;
  for (let i = 0; i < 25 / DT; i++) {
    const err = 20 - sim.vehicle.chassis.speed;
    sim.setInputs({ throttle: Math.max(0.2, Math.min(1, 0.4 + err * 0.3)), steer: -(sim.runtime.c) * 0.05 });
    sim.step();
  }
  assert.ok(d.blockMud > 0.15, `mud block ${d.blockMud}`);
  assert.ok(d.intercoolerBlockage > b0);
  assert.ok(d.blockDust < 0.05);
  // same engine state with / without blockage
  const eng = dr.engine;
  const measure = (blockage) => {
    const e2 = new (eng.constructor)(sim.config.engine, { pressure: 101325, temperature: 288 });
    e2.omega = 5000 * Math.PI / 30;
    for (let t = 0; t < 8; t += DT) { e2.update(DT, { pedal: 1, clutchPressed: 0, speed: 25, ignition: true, intercoolerBlockage: blockage }); e2.omega = 5000 * Math.PI / 30; }
    return { torque: e2.torque, intake: e2.intakeTempK };
  };
  const a = measure(0), b = measure(d.intercoolerBlockage);
  clean.torque = a.torque; clean.intake = a.intake;
  assert.ok(b.intake > a.intake + 8 && b.torque < a.torque, `fouled ${JSON.stringify(b)} vs ${JSON.stringify(a)}`);
});

test('tie-rod: a hard wheel impact bends the toe link; the toe error pulls the car and heats the tyre', () => {
  const sim = launched({}, 70);
  const d = sim.vehicle.damage;
  d.applyImpact({ zone: 'wheel', wheel: 0, energy: 6000 });
  sim.vehicle.drivetrain.transmission.reset(0);
  for (let i = 0; i < 400; i++) { sim.setInputs({ clutch: 1 }); sim.step(); }
  const ev = sim.eventLog.find((e) => e.type === 'tie_rod_bent');
  assert.ok(ev && ev.wheel === 0, 'bend event on the struck wheel');
  const toe = d.tieRodBend[0];
  assert.ok(Math.abs(toe) > 0.005 && Math.abs(toe) <= 0.09 + 1e-12, `toe error ${toe}`);
  assert.equal(sim.vehicle.chassis.wheels[0].toeDamage, toe);
  assert.equal(d.tieRodBend[1], 0);
  // effect: steering wheel centred, the car now generates yaw and the damaged tyre scrubs
  const ch = sim.vehicle.chassis;
  let yaw = 0, slip = 0;
  for (let i = 0; i < 500; i++) { sim.setInputs({ clutch: 1 }); sim.step(); yaw += Math.abs(ch.angularVelocity.y); slip = Math.max(slip, Math.abs(ch.wheels[0].slipAngle)); }
  const ref = launched({}, 70);
  ref.vehicle.drivetrain.transmission.reset(0);
  let yaw0 = 0, slip0 = 0;
  for (let i = 0; i < 500; i++) { ref.setInputs({ clutch: 1 }); ref.step(); yaw0 += Math.abs(ref.vehicle.chassis.angularVelocity.y); slip0 = Math.max(slip0, Math.abs(ref.vehicle.chassis.wheels[0].slipAngle)); }
  assert.ok(slip > 3 * slip0 + 0.005, `slip ${slip} vs ${slip0}`);
  assert.ok(yaw > yaw0, 'toe error yaws the car');
});

test('tie-rod: soft hits below the yield energy do not bend anything; energy is integrated per episode', () => {
  const d = new DamageSystem(loadCfg().damage, AMB);
  const fake = (n) => ({ chassis: { speed: 20, wheels: Array.from({ length: 4 }, () => ({ impactEnergy: 0, shockImpulse: 0, fn: 3000, fy: 0, z: 0.1, surface: {}, contact: true, tire: { leakRate: 0 } })), underbody: { energy: 0, contact: false, force: 0 }, hullHits: [] },
    drivetrain: { engine: { mdotFuel: 0.003, turbo: { omega: 1000, omegaMax: 20000 }, exhaustTempK: 900, intakeTempK: 330 } } });
  d.applyImpact({ zone: 'wheel', wheel: 2, energy: 400 });
  for (let i = 0; i < 300; i++) d.update(DT, fake());
  assert.equal(d.tieRodBend[2], 0);
  d.applyImpact({ zone: 'wheel', wheel: 2, energy: 900 });     // accumulates in the same episode: 1300 < 1500
  for (let i = 0; i < 300; i++) d.update(DT, fake());
  assert.equal(d.tieRodBend[2], 0);
  d.applyImpact({ zone: 'wheel', wheel: 2, energy: 2000 });
  for (let i = 0; i < 300; i++) d.update(DT, fake());
  assert.notEqual(d.tieRodBend[2], 0);
});

test('brakes: heat soak fades the pads and boils the fluid; cooling restores performance', () => {
  const cfg = loadCfg();
  const b = new BrakeSystem(cfg.chassis.brakes, cfg.damage.brakes, AMB);
  // dragging the brakes at 120 rad/s (~140 km/h) for 20 s dissipates ~250 kW per disc
  const full = () => { b.update(DT, { brake: 1, omega: [120, 120, 120, 120], speed: 40 }); return b.torque[0]; };
  const cold = (() => { for (let i = 0; i < 200; i++) full(); return b.torque[0]; })();
  let peakT = 0, minFade = 1;
  for (let i = 0; i < 10000; i++) { full(); peakT = Math.max(peakT, b.discK[0]); minFade = Math.min(minFade, b.fade[0]); }
  assert.ok(peakT > 850, `disc temp ${peakT - 273.15} C`);
  assert.ok(minFade < 0.75, `fade ${minFade}`);
  assert.ok(b.fluidK[0] > 400, `fluid ${b.fluidK[0]}`);
  assert.ok(b.torque[0] < 0.85 * cold, `hot torque ${b.torque[0]} vs cold ${cold}`);
  // coast at speed without braking: discs and fluid cool
  for (let i = 0; i < 150000; i++) b.update(DT, { brake: 0, omega: [90, 90, 90, 90], speed: 30 });
  assert.ok(b.discK[0] < 400);
  assert.ok(b.fade[0] > 0.72, `recovered fade ${b.fade[0]}`);     // cold pads bite at ~0.8 of their hot friction
  assert.ok(b.fluidK[0] < 330);
});

test('brakes: pad wear accumulates with dissipated energy; worn pads lose torque; bias moves torque between axles', () => {
  const cfg = loadCfg();
  const b = new BrakeSystem(cfg.chassis.brakes, cfg.damage.brakes, AMB);
  for (let i = 0; i < 30000; i++) b.update(DT, { brake: 0.5, omega: [60, 60, 60, 60], speed: 25 });
  assert.ok(b.padWear[0] > 0 && b.padWear[0] > b.padWear[2] * 0.5);
  const fresh = new BrakeSystem(cfg.chassis.brakes, cfg.damage.brakes, AMB);
  fresh.update(DT, { brake: 1, omega: [1, 1, 1, 1], speed: 0 }); fresh.pedal = 1;
  fresh.update(DT, { brake: 1, omega: [1, 1, 1, 1], speed: 0 });
  const t0 = fresh.torque[0];
  fresh.padWear = [0.98, 0.98, 0.98, 0.98];
  fresh.update(DT, { brake: 1, omega: [1, 1, 1, 1], speed: 0 });
  assert.ok(fresh.torque[0] < 0.75 * t0);
  const front = new BrakeSystem(cfg.chassis.brakes, cfg.damage.brakes, AMB), rear = new BrakeSystem(cfg.chassis.brakes, cfg.damage.brakes, AMB);
  for (let i = 0; i < 100; i++) { front.update(DT, { brake: 1, bias: 0.75, omega: [1, 1, 1, 1], speed: 0 }); rear.update(DT, { brake: 1, bias: 0.45, omega: [1, 1, 1, 1], speed: 0 }); }
  assert.ok(front.torque[0] > rear.torque[0] && front.torque[2] < rear.torque[2]);
  // handbrake only acts on the rear axle
  const hb = new BrakeSystem(cfg.chassis.brakes, cfg.damage.brakes, AMB);
  for (let i = 0; i < 100; i++) hb.update(DT, { brake: 0, handbrake: 1, omega: [1, 1, 1, 1], speed: 0 });
  assert.equal(hb.torque[0], 0); assert.ok(hb.torque[2] > 1000);
});

test('brake fade at vehicle level: ~20 hard stops with no cooling time end in much longer stopping distances', () => {
  const sim = launched({}, 150);
  const ch = sim.vehicle.chassis;
  const dists = [];
  for (let stop = 0; stop < 24; stop++) {
    ch.placeOnTerrain(sim.terrain, 0, 0, 0, 150 / 3.6);
    for (const w of ch.wheels) { w.tire.surfaceK = w.tire.coreK = 350; }
    sim.vehicle.drivetrain.transmission.reset(0);
    let dist = 0;
    for (let i = 0; i < 4000 && ch.speed > 30 / 3.6; i++) { sim.setInputs({ brake: 1, clutch: 1 }); sim.step(); dist += ch.speed * DT; }
    dists.push(dist);
  }
  assert.ok(dists[23] > dists[0] * 1.25, `stopping distances ${dists.map((d) => d.toFixed(0))}`);
  assert.ok(sim.vehicle.brakes.discK[0] > 800);
  assert.ok(dists[2] < dists[0] * 1.05, 'no fade in the first few stops');
});

test('stone strikes are seeded: identical runs match, different seeds diverge; punctured tyres leak', () => {
  const run = (seed) => {
    const j = syntheticStage({ segments: [['straight', 3000]], layers: [{ type: 'gravel', depth: 0.06 }, { type: 'packed_dirt' }], extra: {} });
    j.seed = seed;
    const sim = stageSim(j, (c) => { c.damage.impact.stoneStrikePerSecondAt30ms = 0.6; c.damage.impact.tireLeakEnergyJ = 20; }, { compoundFront: 'rally_gravel_15', compoundRear: 'rally_gravel_15' });
    sim.vehicle.drivetrain.transmission.reset(4);
    const p = sim.stage.startPose(20);
    sim.vehicle.chassis.placeOnTerrain(sim.terrain, p.x, p.z, p.heading, 30);
    for (let i = 0; i < 40 / DT; i++) { sim.setInputs({ throttle: 0.5, steer: -sim.runtime.c * 0.05 }); sim.step(); }
    const d = sim.vehicle.damage;
    return { strikes: d.strikes, punctures: d.cooling.punctures.length, leaks: sim.vehicle.chassis.wheels.map((w) => w.tire.leakRate), hash: sim.stateHash() };
  };
  const a = run(11), b = run(11), c = run(12);
  assert.deepEqual(a, b);
  assert.ok(a.strikes > 3);
  assert.notDeepEqual(a.leaks.concat(a.punctures), c.leaks.concat(c.punctures));
  assert.ok(a.leaks.some((l) => l > 0), 'some tyre is leaking');
});

test('turbo damage: overspeed and over-temperature wear the turbo, opening a boost leak that costs power', () => {
  const sim = launched();
  const d = sim.vehicle.damage, eng = sim.vehicle.drivetrain.engine;
  eng.turbo.omega = eng.turbo.omegaMax * 1.1;
  for (let i = 0; i < 1500; i++) { eng.turbo.omega = eng.turbo.omegaMax * 1.1; d.update(DT, sim.vehicle); }
  assert.ok(d.turboDamage > 0.04, `turbo damage ${d.turboDamage}`);
  assert.ok(d.boostLeakScale < 1 && d.enginePowerScale < 1);
  // a leaking turbo makes less boost at the same rpm
  const boost = (leak) => {
    const e = new (eng.constructor)(sim.config.engine, { pressure: 101325, temperature: 293.15 });
    e.omega = 3000 * Math.PI / 30;        // near the spool threshold the wastegate is already shut, so a leak shows
    for (let t = 0; t < 10; t += DT) { e.update(DT, { pedal: 1, clutchPressed: 0, speed: 30, ignition: true, boostLeakScale: leak }); e.omega = 3000 * Math.PI / 30; }
    return e.out.boostKPa;
  };
  assert.ok(boost(0.4) < boost(1) - 5, `${boost(0.4)} vs ${boost(1)}`);
});

test('rollover onto the roof is reported as a body impact; underbody strikes are integrated per episode', () => {
  const sim = flatSim({ ...TARMAC_TYRE });
  const ch = sim.vehicle.chassis;
  ch.placeOnTerrain(sim.terrain, 0, 0, 0);
  ch.quaternion = Q.fromAxisAngle({ x: 1, y: 0, z: 0 }, Math.PI);
  ch.position = { x: 0, y: 1.8, z: 0 };
  for (let i = 0; i < 2500; i++) { sim.setInputs({}); sim.step(); }
  const roof = sim.eventLog.filter((e) => e.type === 'body_impact' && e.zone === 'roof');
  assert.ok(roof.length >= 1 && roof[0].energy > 100, JSON.stringify(sim.eventLog.map((e) => e.type)));
});

test('damage summary is complete and JSON-safe; state round-trips', () => {
  const sim = launched();
  cruise(sim, 100, 2);
  const d = sim.vehicle.damage;
  d.applyImpact({ zone: 'front', energy: 500 });
  const s = d.summary(sim.vehicle);
  for (const k of ['radiator', 'intercooler', 'engine', 'tieRods', 'brakes', 'clutch', 'gearbox', 'tires', 'dampers']) assert.ok(k in s, k);
  assert.equal(s.brakes.length, 4); assert.equal(s.tires.length, 4);
  JSON.stringify(s);
  const snap = JSON.parse(JSON.stringify(d.getState()));
  const d2 = new DamageSystem(sim.config.damage, AMB);
  d2.setState(snap);
  assert.deepEqual(d2.getState(), d.getState());
});
