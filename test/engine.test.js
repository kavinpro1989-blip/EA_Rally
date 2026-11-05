import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../core_physics/drivetrain/engine.js';
import { loadCfg, AMBIENT } from './helpers.js';

const DT = 0.002;
const RPM = Math.PI / 30;

/** Run the engine with crank speed held by a dyno (infinite inertia) for `seconds`. */
function hold(engine, rpm, seconds, ctrl) {
  for (let t = 0; t < seconds; t += DT) {
    engine.update(DT, { clutchPressed: 0, speed: 30, ignition: true, alsSwitch: false, ...ctrl });
    engine.omega = rpm * RPM;
  }
}
const make = (edit) => { const cfg = loadCfg(); if (edit) edit(cfg.engine); return new Engine(cfg.engine, { ...AMBIENT }); };

test('steady WOT torque reproduces the dyno curve above the boost threshold', () => {
  for (const rpm of [3000, 3500, 4000, 5000, 6000, 6800]) {
    const e = make();
    e.omega = rpm * RPM;
    hold(e, rpm, 8, { pedal: 1 });
    const ref = e.torqueCurve.eval(rpm);
    assert.ok(Math.abs(e.torque - ref) / ref < 0.1, `${rpm} rpm: ${e.torque.toFixed(0)} vs dyno ${ref.toFixed(0)} N m`);
  }
});

test('boost is regulated to the ECU target without oscillating', () => {
  for (const rpm of [4000, 5500, 6500]) {
    const e = make();
    e.omega = rpm * RPM;
    hold(e, rpm, 6, { pedal: 1 });
    const samples = [];
    for (let t = 0; t < 4; t += DT) {
      e.update(DT, { clutchPressed: 0, speed: 30, ignition: true, pedal: 1 });
      e.omega = rpm * RPM;
      samples.push(e.out.boostKPa);
    }
    const target = e.out.boostTargetKPa;
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    assert.ok(Math.abs(mean - target) / target < 0.08, `${rpm}: mean boost ${mean.toFixed(0)} vs target ${target}`);
    assert.ok(Math.max(...samples) - Math.min(...samples) < 12, `${rpm}: boost ripple ${Math.max(...samples) - Math.min(...samples)}`);
  }
});

test('turbo lag: boost builds progressively and faster at higher rpm', () => {
  const timeToBoost = (rpm) => {
    const e = make();
    e.omega = rpm * RPM;
    hold(e, rpm, 1.5, { pedal: 0 });
    let t = 0;
    while (t < 5) {
      e.update(DT, { clutchPressed: 0, speed: 30, ignition: true, pedal: 1 });
      e.omega = rpm * RPM;
      t += DT;
      if (e.out.boostKPa > 0.9 * e.out.boostTargetKPa) return t;
    }
    return Infinity;
  };
  const t3 = timeToBoost(3000), t5 = timeToBoost(5000);
  assert.ok(t3 > 0.5, `3000 rpm should show lag (${t3})`);
  assert.ok(t5 < t3, `lag should shrink with rpm (${t5} vs ${t3})`);
  assert.ok(t5 < 1.2);
});

test('wastegate opens as boost nears target and stays shut below it', () => {
  const e = make();
  e.omega = 3000 * RPM;
  hold(e, 3000, 0.3, { pedal: 1 });
  assert.ok(e.turbo.wgOpen < 0.05, 'gate shut while boost builds');
  hold(e, 6000, 6, { pedal: 1 });
  assert.ok(e.turbo.wgOpen > 0.1, 'gate bleeding exhaust energy at target boost');
});

test('blow-off valve vents boost when the throttle is slammed shut', () => {
  const e = make();
  e.omega = 5000 * RPM;
  hold(e, 5000, 6, { pedal: 1 });
  const b0 = e.out.boostKPa;
  hold(e, 5000, 0.25, { pedal: 0 });
  assert.ok(b0 > 120);
  assert.ok(e.turbo.boostGaugePa / 1000 < 0.6 * b0, `boost after lift ${e.turbo.boostGaugePa / 1000}`);
});

test('anti-lag retains boost on lift; without it boost collapses', () => {
  const after = (als) => {
    const e = make();
    e.omega = 5000 * RPM;
    hold(e, 5000, 6, { pedal: 1, alsSwitch: als });
    const b0 = e.out.boostKPa;
    let tqMax = -1e9, tqMin = 1e9;
    for (let t = 0; t < 1.0; t += DT) {
      e.update(DT, { clutchPressed: 0, speed: 30, ignition: true, pedal: 0, alsSwitch: als });
      e.omega = 5000 * RPM;
      if (t > 0.3) { tqMax = Math.max(tqMax, e.torque); tqMin = Math.min(tqMin, e.torque); }
    }
    return { b0, b1: e.out.boostKPa, exhaust: e.exhaustTempK, active: e.out.alsActive, tqMax, tqMin };
  };
  const on = after(true), off = after(false);
  assert.ok(on.active);
  assert.ok(on.b1 > 0.6 * on.b0, `ALS kept ${on.b1.toFixed(0)} of ${on.b0.toFixed(0)} kPa`);
  assert.ok(off.b1 < 0.25 * off.b0, `no ALS: ${off.b1.toFixed(0)} of ${off.b0.toFixed(0)} kPa`);
  assert.ok(on.exhaust > off.exhaust + 150, 'ALS runs a much hotter exhaust (retarded, enriched)');
  assert.ok(on.tqMax < 60 && on.tqMin > -80, `ALS must not drive the car hard (${on.tqMin.toFixed(0)}..${on.tqMax.toFixed(0)} N m)`);
});

test('anti-lag shuts itself off when the exhaust gets too hot (turbo protection)', () => {
  const e = make((c) => { c.ecu.als.maxExhaustTempK = 1050; });
  e.omega = 5000 * RPM;
  hold(e, 5000, 4, { pedal: 1, alsSwitch: true });
  let activeSeen = false, droppedAfter = false;
  for (let t = 0; t < 4; t += DT) {
    e.update(DT, { clutchPressed: 0, speed: 30, ignition: true, pedal: 0, alsSwitch: true });
    e.omega = 5000 * RPM;
    if (e.out.alsActive) activeSeen = true; else if (activeSeen) droppedAfter = true;
  }
  assert.ok(activeSeen && droppedAfter);
});

test('rev limiter cuts fuel with hysteresis', () => {
  const e = make();
  e.omega = 6000 * RPM;
  let cutSeen = false, maxRpm = 0;
  for (let t = 0; t < 3; t += DT) {
    e.update(DT, { clutchPressed: 0, speed: 30, ignition: true, pedal: 1 });
    e.integrate(DT, 0);                                   // free-revving crank
    maxRpm = Math.max(maxRpm, e.rpm);
    if (e.out.fuelCut) cutSeen = true;
  }
  assert.ok(cutSeen);
  assert.ok(maxRpm < 7200, `limiter overshoot ${maxRpm}`);
  assert.ok(e.rpm > 6500, 'bounces on the limiter rather than falling away');
});

test('idle controller holds idle rpm and recovers from a load step', () => {
  const e = make();
  for (let t = 0; t < 4; t += DT) { e.update(DT, { pedal: 0, clutchPressed: 0, speed: 0, ignition: true }); e.integrate(DT, 0); }
  assert.ok(Math.abs(e.rpm - 1100) < 120, `idle ${e.rpm}`);
  for (let t = 0; t < 3; t += DT) { e.update(DT, { pedal: 0, clutchPressed: 0, speed: 0, ignition: true }); e.integrate(DT, 40); }
  assert.ok(e.running && e.rpm > 800, `load step: ${e.rpm}`);
});

test('engine stalls under too much load and restarts with the starter', () => {
  const e = make();
  const events = [];
  for (let t = 0; t < 3; t += DT) { e.update(DT, { pedal: 0, clutchPressed: 0, speed: 0, ignition: true }); events.push(...e.events); e.integrate(DT, 400); }
  assert.ok(events.some((x) => x.type === 'engine_stall'));
  assert.equal(e.running, false);
  for (let t = 0; t < 2; t += DT) { e.update(DT, { pedal: 0, clutchPressed: 0, speed: 0, ignition: true, starter: true }); e.integrate(DT, 0); }
  assert.equal(e.running, true);
});

test('altitude (lower ambient pressure) reduces torque; a blocked intercooler runs hotter and weaker', () => {
  const steady = (amb, blockage = 0) => {
    const cfg = loadCfg();
    const e = new Engine(cfg.engine, amb);
    e.omega = 5000 * RPM;
    hold(e, 5000, 8, { pedal: 1, intercoolerBlockage: blockage });
    return { torque: e.torque, intake: e.intakeTempK, boost: e.out.boostKPa };
  };
  const sea = steady({ ...AMBIENT });
  const alt = steady({ pressure: 80000, temperature: 283 });
  const dirty = steady({ ...AMBIENT }, 0.8);
  // gauge boost is held by the ECU, so absolute charge pressure (and torque) falls ~ with ambient pressure
  assert.ok(alt.torque < sea.torque * 0.97 && alt.torque > sea.torque * 0.85, `altitude ${alt.torque} vs ${sea.torque}`);
  assert.ok(dirty.intake > sea.intake + 25, `blocked IC intake ${dirty.intake} vs ${sea.intake}`);
  assert.ok(dirty.torque < sea.torque * 0.92, `blocked IC torque ${dirty.torque} vs ${sea.torque}`);
});

test('ignition retard lowers torque and raises exhaust temperature (launch control)', () => {
  const e = make();
  e.omega = 4500 * RPM;
  hold(e, 4500, 5, { pedal: 1, launchSwitch: true, clutchPressed: 1, speed: 0 });
  assert.ok(e.out.launchActive);
  const e2 = make();
  e2.omega = 4500 * RPM;
  hold(e2, 4500, 5, { pedal: 1, clutchPressed: 1, speed: 0 });
  assert.ok(e.exhaustTempK > e2.exhaustTempK + 20, 'retarded ignition dumps heat into the exhaust');
  assert.ok(e.torque < 0.9 * e2.torque, `retard must cut torque (${e.torque.toFixed(0)} vs ${e2.torque.toFixed(0)})`);
});

test('engine state serialises and restores exactly', () => {
  const a = make();
  a.omega = 4000 * RPM;
  hold(a, 4000, 2, { pedal: 0.7 });
  const snap = JSON.parse(JSON.stringify(a.getState()));
  const b = make();
  b.setState(snap);
  hold(a, 4000, 1, { pedal: 1 });
  hold(b, 4000, 1, { pedal: 1 });
  assert.equal(a.torque, b.torque);
  assert.equal(a.turbo.pPlenum, b.turbo.pPlenum);
});

test('config errors in tables are reported clearly', () => {
  assert.throws(() => make((c) => { c.engine.torqueCurve = [[3000, 1], [2000, 2]]; }), /strictly increasing/);
});
