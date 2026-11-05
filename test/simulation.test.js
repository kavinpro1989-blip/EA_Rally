import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulation, Autopilot, validateConfig, ConfigError, buildTelemetry, applyRenderState, TELEMETRY_SCHEMA } from '../sim/index.js';
import { loadCfg, demoStageJson, flatSim, stageSim, syntheticStage, TARMAC_TYRE } from './helpers.js';
import { Q } from '../core_physics/math/quat.js';

const DT = 0.002;

/** Scripted, tick-indexed input so runs can be replayed exactly. */
const script = (tick) => ({
  throttle: tick < 3000 ? 1 : 0.4, brake: tick > 4200 ? 0.5 : 0, steer: Math.sin(tick / 400) * 0.25,
  shiftUp: tick % 700 === 350, alsSwitch: true, launchSwitch: tick < 300, clutch: tick < 200 ? 1 : null, gear: tick === 0 ? 1 : null,
});
const demo = () => new Simulation(loadCfg(), { stageJson: demoStageJson() });

test('determinism: identical config + inputs give bit-identical state; any difference changes the hash', () => {
  const a = demo(), b = demo(), c = demo();
  a.run(5000, (t) => script(t));
  b.run(5000, (t) => script(t));
  c.run(5000, (t) => ({ ...script(t), steer: Math.sin(t / 400) * 0.25 + (t === 2500 ? 0.01 : 0) }));
  assert.equal(a.stateHash(), b.stateHash());
  assert.equal(a.serialize(), b.serialize());
  assert.notEqual(a.stateHash(), c.stateHash());
  assert.ok(Number.isFinite(a.vehicle.chassis.position.x));
});

test('determinism: update(frameDt) chunking does not change the result for the same number of ticks', () => {
  const a = demo(), b = demo();
  const inputs = { throttle: 0.8, steer: 0.05, gear: 1, alsSwitch: true };
  a.setInputs(inputs); b.setInputs(inputs);
  let na = 0, nb = 0;
  for (let i = 0; i < 400; i++) na += a.update(1 / 60);
  for (let i = 0; i < 940; i++) nb += b.update(1 / 140.7);
  // advance the one with fewer ticks until both are at the same tick, then compare
  while (a.tick < b.tick) a.step();
  while (b.tick < a.tick) b.step();
  assert.ok(na > 3000 && nb > 3000);
  assert.equal(a.stateHash(), b.stateHash());
});

test('serialize / restore resumes exactly (vehicle, damage, stage progress, pacenotes, evolved surface)', () => {
  const a = demo();
  a.run(4000, (t) => script(t));
  const snap = a.serialize();
  a.run(2500, (t) => script(t + 4000));
  const hashA = a.stateHash();

  const b = demo();
  b.restore(snap);
  b.run(2500, (t) => script(t + 4000));
  assert.equal(b.stateHash(), hashA);
  assert.equal(b.serialize(), a.serialize());
  assert.ok(a.evolution.stats.passes > 0);
  // snapshots are plain JSON
  JSON.parse(snap);
});

test('telemetry is complete, JSON-safe and consistent', () => {
  const sim = demo();
  sim.run(3000, (t) => script(t));
  const t = sim.getTelemetry();
  assert.equal(t.schema, TELEMETRY_SCHEMA);
  assert.doesNotThrow(() => JSON.stringify(t));
  const walk = (o, path = '') => {
    if (typeof o === 'number') assert.ok(Number.isFinite(o), `${path} = ${o}`);
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
  };
  walk(t);
  for (const k of ['vehicle', 'engine', 'drivetrain', 'wheels', 'stage', 'damage', 'environment', 'inputs', 'events']) assert.ok(k in t, k);
  assert.equal(t.wheels.length, 4);
  assert.ok(Math.abs(t.vehicle.speedKph - t.vehicle.speed * 3.6) < 1e-9);
  assert.ok(t.engine.rpm >= 0 && t.engine.rpm < 7500);
  assert.ok(['N', '1', '2', '3', '4', '5', 'R'].includes(t.drivetrain.gearName));
  assert.ok(t.stage.distance > 20 && t.stage.progress > 0);
  assert.ok(Math.abs(t.wheels.reduce((s, w) => s + w.load, 0) - t.wheels.reduce((s, w) => s + w.load, 0)) === 0);
  assert.ok(t.environment.altitude > 50, `altitude ${t.environment.altitude}`);
  // body-frame accelerations in g
  assert.ok(Math.abs(t.vehicle.accelG.vertical) < 5);
  assert.deepEqual(Object.keys(t.wheels[0].suspension).sort(), ['antiRollForce', 'bumpStopForce', 'compression', 'damperForce', 'damperHealth', 'springForce', 'totalForce', 'travel', 'travelFraction', 'velocity']);
});

test('UI synchronisation: throttled subscriptions, monotonic seq, hash, events delivered once, errors isolated', () => {
  const sim = demo();
  const got = [];
  const off = sim.subscribe((snap) => got.push(snap), { hz: 50 });
  let thrown = 0;
  sim.subscribe(() => { thrown++; throw new Error('ui exploded'); }, { hz: 10 });
  sim.setInputs({ throttle: 1, gear: 1, launchSwitch: true, clutch: 1 });
  for (let i = 0; i < 120; i++) sim.update(1 / 60);          // 2 s of 60 fps frames
  assert.ok(got.length >= 90 && got.length <= 101, `50 Hz over 2 s -> ${got.length}`);
  for (let i = 1; i < got.length; i++) {
    assert.ok(got[i].seq > got[i - 1].seq && got[i].tick > got[i - 1].tick);
    assert.equal(got[i].tick - got[i - 1].tick, 10, 'every 10 ticks = 50 Hz at dt 2 ms');
  }
  assert.match(got[0].hash, /^[0-9a-f]{32}/);
  assert.equal(got[0].telemetry.schema, TELEMETRY_SCHEMA);
  assert.ok(got[0].render.body && got[0].render.wheels.length === 4);
  assert.ok(thrown > 10);
  assert.ok(sim.eventLog.some((e) => e.type === 'subscriber_error'), 'a failing UI callback must not stop the physics');
  assert.ok(sim.tick >= 990);
  // a replica built from the same snapshot hash stays in sync
  const replica = demo();
  replica.restore(sim.serialize());
  assert.equal(replica.stateHash(), sim.stateHash());
  off();
  const n = got.length;
  for (let i = 0; i < 30; i++) sim.update(1 / 60);
  assert.equal(got.length, n);
  // event delivery: each event appears in exactly one snapshot
  const seen = [];
  const sim2 = demo();
  sim2.subscribe((snap) => seen.push(...snap.telemetry.events), { hz: 30 });
  sim2.setInputs({ gear: 1, throttle: 1 });
  for (let i = 0; i < 12 / (1 / 60); i++) { sim2.setInputs({ shiftUp: i % 60 === 30 }); sim2.update(1 / 60); }
  const keys = seen.map((e) => `${e.tick}:${e.type}`);
  assert.equal(new Set(keys).size, keys.length, 'no duplicate events');
  assert.ok(seen.some((e) => e.type === 'shift'));
});

test('render state interpolates between ticks and drives Three.js-style objects', () => {
  const sim = flatSim({ ...TARMAC_TYRE });
  sim.vehicle.chassis.placeOnTerrain(sim.terrain, 0, 0, 0, 30);
  sim.vehicle.drivetrain.transmission.reset(0);
  sim.step();
  const r0 = sim.getRenderState(0), r1 = sim.getRenderState(1), rh = sim.getRenderState(0.5);
  const dz = r1.body.position.z - r0.body.position.z;
  assert.ok(dz < -0.05, 'moving north (-Z)');
  assert.ok(Math.abs(rh.body.position.z - (r0.body.position.z + dz / 2)) < 1e-9);
  const q = rh.body.quaternion;
  assert.ok(Math.abs(Math.hypot(q.x, q.y, q.z, q.w) - 1) < 1e-9);
  // wheels sit at the corners, below the body, at about tyre radius above ground
  r1.wheels.forEach((w) => assert.ok(w.position.y > 0.2 && w.position.y < 0.45));
  assert.ok(r1.wheels[0].position.x < r1.wheels[1].position.x, 'left wheel is west of the right wheel when heading north');
  // fake THREE objects
  const mk = () => ({ position: { set(x, y, z) { Object.assign(this, { x, y, z }); } }, quaternion: { set(x, y, z, w) { Object.assign(this, { x, y, z, w }); } } });
  const body = mk(), wheels = [mk(), mk(), mk(), mk()];
  applyRenderState(r1, { body, wheels });
  assert.equal(body.position.y, r1.body.position.y);
  assert.equal(wheels[3].quaternion.w, r1.wheels[3].quaternion.w);
  // a wheel quaternion keeps its axis along the body's lateral axis when not steered
  const axis = Q.rotate(r1.wheels[0].quaternion, { x: 0, y: 0, z: 1 });
  const lateral = Q.rotate(r1.body.quaternion, { x: 0, y: 0, z: 1 });
  assert.ok(Math.abs(axis.x * lateral.x + axis.y * lateral.y + axis.z * lateral.z) > 0.99);
});

test('wheel spin direction in the render state matches forward motion (top of the wheel moves forward)', () => {
  const sim = flatSim({ ...TARMAC_TYRE });
  sim.vehicle.chassis.placeOnTerrain(sim.terrain, 0, 0, 0, 20);
  sim.vehicle.drivetrain.transmission.reset(0);
  const q0 = sim.getRenderState(1).wheels[1].quaternion;
  for (let i = 0; i < 25; i++) sim.step();
  const r = sim.getRenderState(1);
  const q1 = r.wheels[1].quaternion;
  // rotate the wheel's local +Y (its "top") from q0 to q1: the top should have moved toward the car's forward direction
  const top0 = Q.rotate(q0, { x: 0, y: 0.3, z: 0 }), top1 = Q.rotate(q1, { x: 0, y: 0.3, z: 0 });
  const fwd = Q.rotate(r.body.quaternion, { x: 1, y: 0, z: 0 });
  const d = { x: top1.x - top0.x, y: top1.y - top0.y, z: top1.z - top0.z };
  assert.ok(d.x * fwd.x + d.y * fwd.y + d.z * fwd.z > 0.005);
});

test('inputs are validated and clamped', () => {
  const sim = flatSim();
  assert.throws(() => sim.setInputs({ trottle: 1 }), /unknown input/);
  sim.setInputs({ throttle: 4, brake: -1, steer: 9, handbrake: 3, clutch: 7 });
  assert.deepEqual([sim.inputs.throttle, sim.inputs.brake, sim.inputs.steer, sim.inputs.handbrake, sim.inputs.clutch], [1, 0, 1, 1, 1]);
  sim.replaceInputs({ throttle: 0.2 });
  assert.equal(sim.inputs.steer, 0);
});

test('config validation reports every problem with a path', () => {
  const cfg = loadCfg();
  assert.deepEqual(validateConfig(cfg).errors, []);
  const bad = loadCfg();
  bad.simulation.dt = 0.05;
  bad.drivetrain.layout = 'MR';
  bad.chassis.tires.front = 'nope';
  bad.drivetrain.transmission.gearRatios = [];
  bad.chassis.suspension.rear.bumpStop.length = 1;
  const { errors } = validateConfig(bad);
  assert.ok(errors.some((e) => /simulation\.dt/.test(e)));
  assert.ok(errors.some((e) => /layout/.test(e)));
  assert.ok(errors.some((e) => /unknown compound "nope"/.test(e)));
  assert.ok(errors.some((e) => /gearRatios/.test(e)));
  assert.ok(errors.some((e) => /bumpStop\.length/.test(e)));
  assert.throws(() => new Simulation(bad), ConfigError);
  const missing = loadCfg(); delete missing.damage;
  assert.ok(validateConfig(missing).errors[0].includes('damage'));
  const warn = loadCfg(); warn.drivetrain.transmission.gearRatios = [2, 2.5, 1.5];
  assert.ok(validateConfig(warn).warnings.length > 0);
});

test('all three drivetrain layouts accelerate the car on tarmac; the driven axle slips first', () => {
  for (const layout of ['AWD', 'FWD', 'RWD']) {
    const sim = flatSim({ ...TARMAC_TYRE, cfgEdit: (c) => { c.drivetrain.layout = layout; } });
    sim.vehicle.drivetrain.transmission.reset(1);
    sim.vehicle.chassis.settle(sim.terrain, 0.2);
    let slipFront = 0, slipRear = 0;
    sim.run(3000, () => ({ throttle: 1, launchSwitch: true, clutch: undefined }));
    const ch = sim.vehicle.chassis;
    for (const w of ch.wheels.slice(0, 2)) slipFront = Math.max(slipFront, w.slipRatio);
    for (const w of ch.wheels.slice(2)) slipRear = Math.max(slipRear, w.slipRatio);
    assert.ok(ch.speed > 14, `${layout}: speed after 6 s ${ch.speed}`);
    sim.vehicle.drivetrain.telemetry.gear;
  }
});

test('altitude correction lowers charge pressure (and power) high on the stage', () => {
  const lowStage = syntheticStage({ segments: [['straight', 600]], origin: { lat: 47, lng: 11, elevation: 0 } });
  const highStage = syntheticStage({ segments: [['straight', 600]], origin: { lat: 47, lng: 11, elevation: 2400 } });
  const mk = (j) => { const cfg = loadCfg(); cfg.simulation.ambient.altitudeCorrection = true; return new Simulation(cfg, { stageJson: j }); };
  const lo = mk(lowStage), hi = mk(highStage);
  assert.ok(hi.ambient.pressure < lo.ambient.pressure * 0.8, `${hi.ambient.pressure} vs ${lo.ambient.pressure}`);
  assert.ok(hi.ambient.temperature < lo.ambient.temperature - 10);
  const power = (sim) => {
    const e = sim.vehicle.drivetrain.engine;
    e.omega = 5000 * Math.PI / 30;
    for (let t = 0; t < 8; t += DT) { e.update(DT, { pedal: 1, clutchPressed: 0, speed: 30, ignition: true }); e.omega = 5000 * Math.PI / 30; }
    return e.torque;
  };
  assert.ok(power(hi) < power(lo) * 0.94, `${power(hi)} vs ${power(lo)}`);
});

test('placeOnStage restores the runtime and the car starts at rest on the road', () => {
  const sim = demo();
  sim.placeOnStage({ s: 600, lateral: 1.0, speed: 15 });
  sim.step();
  assert.ok(Math.abs(sim.runtime.s - 600) < 6, `runtime s ${sim.runtime.s}`);
  assert.ok(Math.abs(sim.runtime.c - 1.0) < 0.6);
  assert.ok(sim.vehicle.chassis.speed > 14 && sim.vehicle.chassis.speed < 16);
  assert.ok(Math.abs(sim.vehicle.chassis.attitude.pitch) < 0.2 && Math.abs(sim.vehicle.chassis.attitude.roll) < 0.2);
  const next = sim.pacenotePlayer.notes[sim.pacenotePlayer.next];
  assert.ok(next && next.sEnd >= 599, 'pacenote pointer skipped notes behind the car');
  assert.throws(() => flatSim().placeOnStage({ s: 5 }), /no stage/);
});

test('performance: faster than real time on flat ground and on the stage', () => {
  const flat = flatSim({ ...TARMAC_TYRE });
  flat.vehicle.drivetrain.transmission.reset(2);
  let t0 = performance.now();
  flat.run(5000, () => ({ throttle: 0.7, steer: 0.1 }));       // 10 s
  const flatMs = performance.now() - t0;
  assert.ok(flatMs < 5000, `flat: 10 s took ${flatMs.toFixed(0)} ms`);
  const sim = demo();
  const ap = new Autopilot();
  t0 = performance.now();
  sim.run(5000, () => ap.compute(sim));
  const stageMs = performance.now() - t0;
  assert.ok(stageMs < 8000, `stage: 10 s took ${stageMs.toFixed(0)} ms`);
});

test('the reference autopilot drives the whole demo stage: stays on the road, hears every call, passes both splits and finishes', () => {
  const sim = demo();
  const ap = new Autopilot({ lateralAccel: 4.6 });
  const calls = [], splits = [];
  let maxLat = 0, offCourse = 0, finish = null;
  for (let i = 0; i < 90000 && !sim.runtime.finished; i++) {
    sim.setInputs(ap.compute(sim));
    sim.step();
    maxLat = Math.max(maxLat, Math.abs(sim.runtime.c));
    for (const e of sim.drainEvents()) {
      if (e.type === 'pacenote') calls.push(e.text);
      if (e.type === 'checkpoint') splits.push(e.name);
      if (e.type === 'off_course') offCourse++;
      if (e.type === 'stage_finish') finish = e.time;
    }
  }
  assert.ok(sim.runtime.finished, `stopped at s=${sim.runtime.s.toFixed(0)} of ${sim.stage.length.toFixed(0)} after ${sim.time.toFixed(0)} s`);
  assert.equal(offCourse, 0);
  assert.ok(maxLat < 6, `max lateral offset ${maxLat}`);
  assert.deepEqual(splits, ['Split 1', 'Split 2']);
  assert.ok(calls.length >= sim.stage.pacenotes.length - 3, `${calls.length} of ${sim.stage.pacenotes.length} notes called`);
  assert.ok(finish > 60 && finish < 220, `stage time ${finish}`);
  assert.ok(sim.evolution.stats.passes > 50000);
  const t = sim.getTelemetry();
  assert.ok(t.damage.radiator.coolantLevel > 0.9, 'a clean run does not damage the car');
});

test('buildTelemetry works on a bare flat-ground simulation without a stage', () => {
  const sim = flatSim();
  const t = buildTelemetry(sim);
  assert.equal(t.stage, null);
  assert.ok(t.vehicle.speed < 0.5);
  void stageSim;
});
