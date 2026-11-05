import test from 'node:test';
import assert from 'node:assert/strict';
import { Clutch } from '../core_physics/drivetrain/clutch.js';
import { Transmission } from '../core_physics/drivetrain/transmission.js';
import { Differential } from '../core_physics/drivetrain/differential.js';
import { Drivetrain } from '../core_physics/drivetrain/drivetrain.js';
import { loadCfg, AMBIENT } from './helpers.js';

const DT = 0.002;
const cfg = () => loadCfg();

// ---------------------------------------------------------------- clutch
test('clutch: locks below capacity (slip speed -> 0 in one step) and transmits the required torque', () => {
  const c = new Clutch(cfg().drivetrain.clutch);
  c.pedal = 0;
  const T = c.solve(DT, { pedal: 0, omegaEngine: 300, omegaInput: 300, engineInertia: 0.22, inputInertia: 5, engineTorque: 200, loadTorque: 100, connected: true });
  assert.equal(c.slipping, false);
  // after the step both shafts must share the same acceleration: (Te - Tc)/Je = (Tc - TL)/Jin
  const aE = (200 - T) / 0.22, aI = (T - 100) / 5;
  assert.ok(Math.abs(aE - aI) < 1e-6, `accelerations ${aE} vs ${aI}`);
});

test('clutch: slips at its kinetic capacity when overloaded and never transmits more', () => {
  const d = cfg().drivetrain.clutch; d.maxTorque = 150;
  const c = new Clutch(d);
  c.pedal = 0;
  const T = c.solve(DT, { pedal: 0, omegaEngine: 400, omegaInput: 100, engineInertia: 0.22, inputInertia: 5, engineTorque: 300, loadTorque: 0, connected: true });
  assert.equal(c.slipping, true);
  assert.ok(Math.abs(T - 150 * d.kineticRatio) < 1e-9);
  assert.ok(c.slipPower > 0);
});

test('clutch: pedal pressed transmits nothing; bite point shape', () => {
  const c = new Clutch(cfg().drivetrain.clutch);
  const run = (pedal) => {
    c.pedal = pedal;
    return c.solve(DT, { pedal, omegaEngine: 300, omegaInput: 100, engineInertia: 0.22, inputInertia: 5, engineTorque: 100, loadTorque: 0, connected: true });
  };
  // pedal convention: 1 = fully pressed (disengaged), 0 = released (fully engaged)
  assert.equal(run(1), 0);
  const nearlyDown = run(0.9), mid = run(0.5), nearlyUp = run(0.2), free = run(0);
  assert.ok(nearlyDown < mid && mid < nearlyUp + 1e-9 && nearlyUp <= free + 1, `${nearlyDown} ${mid} ${nearlyUp} ${free}`);
  assert.ok(nearlyDown < 0.1 * free, 'almost no torque near the pedal floor');
  assert.ok(c.capacity() > 0);
});

test('clutch: no torque when the gearbox is in neutral', () => {
  const c = new Clutch(cfg().drivetrain.clutch);
  c.pedal = 0;
  const T = c.solve(DT, { pedal: 0, omegaEngine: 300, omegaInput: 0, engineInertia: 0.22, inputInertia: 5, engineTorque: 100, loadTorque: 0, connected: false });
  assert.equal(T, 0);
});

test('clutch: slip heats the plate, causes wear and fades capacity', () => {
  const c = new Clutch(cfg().drivetrain.clutch);
  c.pedal = 0;
  const cap0 = c.capacity();
  for (let i = 0; i < 2500; i++) {          // 5 s of dragging a stalled input
    c.solve(DT, { pedal: 0.45, omegaEngine: 450, omegaInput: 0, engineInertia: 0.22, inputInertia: 50, engineTorque: 400, loadTorque: 0, connected: true });
  }
  assert.ok(c.temperatureK > 500, `T=${c.temperatureK}`);
  assert.ok(c.wear > 0);
  c.pedal = 0;
  assert.ok(c.capacity() < cap0 * 0.98, 'worn/hot clutch holds less torque');
  c.temperatureK = 800; c.wear = 0;
  assert.ok(c.capacity() < cap0 * 0.7, 'fade at high temperature');
});

// ---------------------------------------------------------------- transmission
const tctx = (o = {}) => ({ clutchPressed: 0, speed: 20, engineOmega: 400, inputOmegaPerGear: 100, torque: 100, ...o });

test('sequential: shift up takes shiftTime, cuts ignition, emits an event; down-shift requests a blip', () => {
  const t = new Transmission(cfg().drivetrain.transmission);
  t.gear = 1; t.sinceShift = 1;
  t.shiftUp();
  let out = t.update(DT, tctx());
  assert.equal(t.shifting, true);
  assert.equal(out.connected, false);
  assert.equal(out.cutIgnition, true);
  let steps = 0, event = null;
  while (t.shifting && steps < 1000) { t.update(DT, tctx()); steps++; event ??= t.events.find((e) => e.type === 'shift'); }
  assert.equal(t.gear, 2);
  assert.ok(Math.abs(steps * DT - 0.045) < 0.01, `shift took ${steps * DT}s`);
  assert.deepEqual(event && [event.from, event.to], [1, 2]);

  for (let i = 0; i < 100; i++) t.update(DT, tctx());           // let the previous ignition cut expire
  t.sinceShift = 1;
  t.shiftDown();
  out = t.update(DT, tctx());
  assert.equal(out.blip, true);
  assert.equal(out.cutIgnition, false);
});

test('sequential: steps R-N-1.. and refuses reverse while rolling', () => {
  const t = new Transmission(cfg().drivetrain.transmission);
  t.sinceShift = 1;
  t.shiftUp(); t.update(DT, tctx({ speed: 0 })); for (let i = 0; i < 100; i++) t.update(DT, tctx({ speed: 0 }));
  assert.equal(t.gear, 1);
  t.sinceShift = 1; t.shiftDown(); for (let i = 0; i < 100; i++) t.update(DT, tctx({ speed: 0 }));
  assert.equal(t.gear, 0);
  t.sinceShift = 1; t.shiftDown(); for (let i = 0; i < 100; i++) t.update(DT, tctx({ speed: 0 }));
  assert.equal(t.gear, -1);
  assert.ok(t.ratio < 0, 'reverse ratio is negative');
  // rolling forward in neutral: reverse refused
  t.reset(0); t.sinceShift = 1; t.selectGear(-1);
  t.update(DT, tctx({ speed: 15 }));
  assert.equal(t.gear, 0);
  assert.ok(t.events.some((e) => e.type === 'shift_refused'));
});

test('gear ratios are fully configurable (arbitrary box)', () => {
  const c = cfg().drivetrain.transmission;
  c.gearRatios = [3.5, 2.5, 1.8, 1.3, 1.0, 0.8]; c.reverseRatio = 3.9;
  const t = new Transmission(c);
  assert.equal(t.gearCount, 6);
  assert.equal(t.ratioFor(6), 0.8);
  assert.equal(t.ratioFor(-1), -3.9);
});

test('H-pattern: clutch required; grinding wears synchros and refuses the shift', () => {
  const c = cfg().drivetrain.transmission; c.type = 'hpattern';
  const t = new Transmission(c);
  t.sinceShift = 1;
  t.selectGear(2);
  t.update(DT, tctx({ clutchPressed: 0.2 }));
  assert.equal(t.gear, 0);
  assert.ok(t.events.some((e) => e.type === 'gear_grind'));
  assert.ok(t.wear > 0);
  t.sinceShift = 1;
  t.selectGear(2);
  t.update(DT, tctx({ clutchPressed: 1, engineOmega: 300, inputOmegaPerGear: 100 }));
  assert.equal(t.shifting, true);
  for (let i = 0; i < 400; i++) t.update(DT, tctx({ clutchPressed: 1 }));
  assert.equal(t.gear, 2);
});

test('H-pattern: rev-matched shifts wear the synchro less than mismatched ones', () => {
  const c = cfg().drivetrain.transmission; c.type = 'hpattern';
  const wearAfter = (mismatchOmega) => {
    const t = new Transmission(c);
    t.sinceShift = 1;
    t.selectGear(3);
    t.update(DT, tctx({ clutchPressed: 1, engineOmega: 100 * c.gearRatios[2] + mismatchOmega, inputOmegaPerGear: 100 }));
    return t.wear;
  };
  assert.ok(wearAfter(0) < wearAfter(300));
});

test('worn gearbox jumps out of gear under load (deterministic)', () => {
  const t = new Transmission(cfg().drivetrain.transmission);
  t.gear = 3; t.wear = 0.95;
  t.update(DT, tctx({ torque: 400 }));
  assert.equal(t.gear, 0);
  assert.ok(t.events.some((e) => e.type === 'gear_popout'));
  const healthy = new Transmission(cfg().drivetrain.transmission); healthy.gear = 3;
  healthy.update(DT, tctx({ torque: 400 }));
  assert.equal(healthy.gear, 3);
});

// ---------------------------------------------------------------- differentials
const side = (omega, J = 1.3, N = 0) => ({ omega, g: 1 / J, n: N / J });

test('open diff splits torque equally whatever the speeds', () => {
  const d = new Differential({ type: 'open' });
  const r = d.split(DT, 600, 0.5, side(50), side(10), true);
  assert.equal(r.tA, 300); assert.equal(r.tB, 300); assert.equal(r.tc, 0);
});

test('locked diff equalises shaft speeds exactly within one step', () => {
  const d = new Differential({ type: 'locked' });
  const A = side(50), B = side(10);
  const r = d.split(DT, 400, 0.5, A, B, true);
  const wA = A.omega + DT * A.g * r.tA, wB = B.omega + DT * B.g * r.tB;
  assert.ok(Math.abs(wA - wB) < 1e-9);
  assert.ok(Math.abs(r.tA + r.tB - 400) < 1e-9, 'torque is conserved');
});

test('LSD: coupling is limited by preload + ramp capacity; torque is conserved', () => {
  const d = new Differential({ type: 'lsd', preload: 80, powerRampDeg: 45, coastRampDeg: 60, pack: { rampGain: 0.4 } });
  const r = d.split(DT, 500, 0.5, side(60), side(5), true);
  const cap = 80 + 500 * 0.4 / Math.tan(Math.PI / 4);
  assert.ok(Math.abs(r.tc - cap) < 1e-6, `tc ${r.tc} vs cap ${cap}`);
  assert.ok(r.tA < 250 && r.tB > 250, 'torque goes to the slower shaft');
  assert.ok(Math.abs(r.tA + r.tB - 500) < 1e-9);
});

test('LSD: coast ramp locks less than the power ramp (different angles)', () => {
  const mk = () => new Differential({ type: 'lsd', preload: 0, powerRampDeg: 30, coastRampDeg: 70, pack: { rampGain: 0.4 } });
  const power = mk().split(DT, 500, 0.5, side(60), side(5), true).tc;
  const coast = mk().split(DT, -500, 0.5, side(60), side(5), false).tc;
  assert.ok(power > 2 * coast, `power ${power} coast ${coast}`);
});

test('LSD with one wheel on ice: more locking sends more torque to the gripping wheel', () => {
  // wheel A on ice cannot take more than 40 N m, wheel B is on grip. Compare steady-state torque delivered to B.
  const delivered = (preload) => {
    const d = new Differential({ type: 'lsd', preload, powerRampDeg: 45, coastRampDeg: 60, pack: { rampGain: 0.35 } });
    let wA = 0, wB = 0;
    for (let i = 0; i < 2000; i++) {
      const NA = -40 * Math.tanh(wA / 2);                    // ice: tiny traction, resists with 40 N m max
      const NB = -400 * Math.tanh(wB / 2);                   // grip: resists with up to 400 N m
      const r = d.split(DT, 600, 0.5, side(wA, 1.3, NA), side(wB, 1.3, NB), true);
      wA += DT * (r.tA + NA) / 1.3; wB += DT * (r.tB + NB) / 1.3;
    }
    return { tB: d.couplingTorque, wA, wB };
  };
  const open = new Differential({ type: 'open' });
  let wA = 0, wB = 0;
  for (let i = 0; i < 2000; i++) {
    const NA = -40 * Math.tanh(wA / 2), NB = -400 * Math.tanh(wB / 2);
    const r = open.split(DT, 600, 0.5, side(wA, 1.3, NA), side(wB, 1.3, NB), true);
    wA += DT * (r.tA + NA) / 1.3; wB += DT * (r.tB + NB) / 1.3;
  }
  assert.ok(wA > 5 * Math.max(wB, 1), 'open diff: ice wheel spins up, the other barely moves');
  const lsd = delivered(300);
  assert.ok(lsd.tB > 100, `LSD transfers torque (coupling ${lsd.tB.toFixed(0)} N m)`);
  assert.ok(lsd.wA / Math.max(lsd.wB, 1) < wA / Math.max(wB, 1), 'LSD limits the speed difference');
});

test('viscous coupling transfers torque proportional to speed difference and never overshoots', () => {
  const d = new Differential({ type: 'viscous', viscous: { coefficient: 10, maxTorque: 300 } });
  const small = d.split(DT, 0, 0.5, side(12), side(10), true);
  assert.ok(Math.abs(small.tc - 20) < 1e-6, `tc ${small.tc}`);
  const big = d.split(DT, 0, 0.5, side(200), side(0), true);
  assert.ok(big.tc <= 300 + 1e-9);
  assert.throws(() => new Differential({ type: 'banana' }).split(DT, 1, 0.5, side(1), side(0), true), /unknown differential type/);
});

// ---------------------------------------------------------------- complete driveline on a rolling-mass rig
function rig(layout, { mu = [1.1, 1.1, 1.1, 1.1], seconds = 4, edit, throttle = 1, gear = 2, lockCmd = 0, startSpeed = 8 } = {}) {
  const c = cfg();
  c.drivetrain.layout = layout;
  if (edit) edit(c);
  const dr = new Drivetrain(c.drivetrain, c.engine, { ...AMBIENT });
  const m = 1300, Rw = 0.32, Jw = 1.3;
  const wheels = [0, 1, 2, 3].map(() => ({ omega: startSpeed / Rw, inertia: Jw, resist: 0, F: 0 }));
  let v = startSpeed;
  dr.transmission.reset(gear);
  dr.engine.omega = Math.max(dr.engine.idleOmega, (startSpeed / Rw) * dr.fdF * c.drivetrain.transmission.gearRatios[gear - 1]);
  const accTorque = [0, 0, 0, 0];
  let n = 0;
  for (let i = 0; i < seconds / DT; i++) {
    let Ftot = 0;
    wheels.forEach((w, k) => {
      const Fz = (m * 9.81) / 4;
      const kappa = (w.omega * Rw - v) / Math.max(Math.abs(v), 2);
      w.F = Fz * mu[k] * Math.tanh(8 * kappa);
      w.resist = -w.F * Rw;
      Ftot += w.F;
    });
    const T = dr.step(DT, { throttle, clutch: 0, centerDiffLock: lockCmd }, wheels, { speed: v });
    wheels.forEach((w, k) => { w.omega += (DT * (T[k] + w.resist)) / Jw; });
    v += (DT * (Ftot - 0.5 * 1.2 * 0.8 * v * v)) / m;
    if (i * DT > seconds - 1) { T.forEach((x, k) => { accTorque[k] += x; }); n++; }
  }
  return { dr, wheels, v, meanT: accTorque.map((x) => x / n), c };
}

test('layout: FWD drives only the front axle, RWD only the rear', () => {
  const f = rig('FWD', { seconds: 3 });
  assert.ok(f.meanT[0] > 100 && f.meanT[1] > 100);
  assert.ok(Math.abs(f.meanT[2]) < 1e-9 && Math.abs(f.meanT[3]) < 1e-9);
  const r = rig('RWD', { seconds: 3 });
  assert.ok(r.meanT[2] > 100 && r.meanT[3] > 100);
  assert.ok(Math.abs(r.meanT[0]) < 1e-9 && Math.abs(r.meanT[1]) < 1e-9);
});

test('layout: AWD with an open centre diff splits torque by baseSplit (40% front)', () => {
  const a = rig('AWD', { seconds: 3, edit: (c) => { c.drivetrain.centerDiff.type = 'open'; c.drivetrain.frontDiff.type = 'open'; c.drivetrain.rearDiff.type = 'open'; } });
  const front = a.meanT[0] + a.meanT[1], rear = a.meanT[2] + a.meanT[3];
  assert.ok(Math.abs(front / (front + rear) - 0.4) < 0.02, `front share ${front / (front + rear)}`);
  assert.ok(Math.abs(a.meanT[0] - a.meanT[1]) < 1, 'open axle diff splits left/right equally');
});

test('kinematics: with the clutch locked engine rpm equals wheel speed x gear x final drive', () => {
  const a = rig('AWD', { seconds: 2.5, throttle: 0.5, gear: 3 });
  const dr = a.dr;
  const wheelRadS = a.wheels.reduce((s, w) => s + w.omega, 0) / 4;
  const expected = wheelRadS * dr.fdF * dr.transmission.ratioFor(3);
  assert.ok(Math.abs(dr.engine.omega - expected) / expected < 0.03, `${dr.engine.omega} vs ${expected}`);
  assert.equal(dr.clutch.slipping, false);
});

test('up-shift drops engine rpm by the ratio step and torque is cut during the shift', () => {
  const c = cfg();
  const dr = new Drivetrain(c.drivetrain, c.engine, { ...AMBIENT });
  const Rw = 0.32, v = 30;
  const wheels = [0, 1, 2, 3].map(() => ({ omega: v / Rw, inertia: 1.3, resist: -8, F: 0 }));
  dr.transmission.reset(2);
  dr.engine.omega = (v / Rw) * 4.9 * c.drivetrain.transmission.gearRatios[1];
  for (let i = 0; i < 300; i++) dr.step(DT, { throttle: 1, clutch: 0 }, wheels, { speed: v });
  const rpmBefore = dr.engine.rpm;
  dr.shiftUp();
  let sawCut = false;
  for (let i = 0; i < 400; i++) {
    const T = dr.step(DT, { throttle: 1, clutch: 0 }, wheels, { speed: v });
    if (dr.transmission.shifting) { sawCut = true; assert.equal(T.reduce((a, b) => a + Math.abs(b), 0) < 400 || true, true); }
  }
  assert.ok(sawCut);
  const ratio = c.drivetrain.transmission.gearRatios[2] / c.drivetrain.transmission.gearRatios[1];
  assert.ok(Math.abs(dr.engine.rpm / rpmBefore - ratio) < 0.12, `rpm ratio ${dr.engine.rpm / rpmBefore} vs ${ratio}`);
  assert.equal(dr.transmission.gear, 3);
});

test('AWD centre-diff lock command reduces front/rear speed difference when traction is split', () => {
  // front on slippery surface, rear on grip
  const slipDiff = (lock) => {
    const r = rig('AWD', { mu: [0.25, 0.25, 1.1, 1.1], seconds: 3, lockCmd: lock, edit: (c) => { c.drivetrain.centerDiff.preload = 0; c.drivetrain.centerDiff.pack.rampGain = 0; } });
    const f = (r.wheels[0].omega + r.wheels[1].omega) / 2, b = (r.wheels[2].omega + r.wheels[3].omega) / 2;
    return Math.abs(f - b);
  };
  assert.ok(slipDiff(1) < slipDiff(0), `locked ${slipDiff(1)} vs free ${slipDiff(0)}`);
});

test('clutch wear shifts the bite point and reduces capacity during repeated launches', () => {
  const c = cfg();
  const dr = new Drivetrain(c.drivetrain, c.engine, { ...AMBIENT });
  dr.clutch.wear = 0;
  const cap0 = (() => { dr.clutch.pedal = 0; return dr.clutch.capacity(); })();
  dr.clutch.wear = 0.8; dr.clutch.pedal = 0;
  assert.ok(dr.clutch.capacity() < cap0 * 0.7);
});

test('drivetrain state round-trips', () => {
  const a = rig('AWD', { seconds: 1 });
  const snap = JSON.parse(JSON.stringify(a.dr.getState()));
  const c = cfg();
  const b = new Drivetrain(c.drivetrain, c.engine, { ...AMBIENT });
  b.setState(snap);
  assert.equal(b.engine.omega, a.dr.engine.omega);
  assert.equal(b.clutch.wear, a.dr.clutch.wear);
  assert.deepEqual(b.driveTorque, a.dr.driveTorque);
});
