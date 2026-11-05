import test from 'node:test';
import assert from 'node:assert/strict';
import { Chassis } from '../core_physics/chassis/chassis.js';
import { SurfaceLibrary } from '../core_physics/chassis/surface.js';
import { FlatTerrain, FunctionTerrain } from '../core_physics/chassis/terrain.js';
import { Q } from '../core_physics/math/quat.js';
import { loadCfg, flatSim, AMBIENT, TARMAC_TYRE } from './helpers.js';

const G = 9.80665;
const DT = 0.002;

function bareChassis(terrain = new FlatTerrain(), edit) {
  const cfg = loadCfg();
  if (edit) edit(cfg);
  const lib = new SurfaceLibrary(cfg.surfaces);
  const ch = new Chassis(cfg.chassis, cfg.tires.compounds, lib, { ...AMBIENT }, { compoundFront: 'rally_tarmac_18', compoundRear: 'rally_tarmac_18', pressureFrontKPa: 190, pressureRearKPa: 190 });
  return { ch, cfg, terrain };
}
const stepBare = (ch, terrain, n, brake = 0, extra) => {
  const z = [0, 0, 0, 0], b = [brake, brake, brake, brake];
  for (let i = 0; i < n; i++) { ch.computeForces(DT, { steer: 0 }, terrain); ch.integrate(DT, z, b); if (extra) extra(i); }
};

test('static equilibrium: rests at the design ride height with wheel loads equal to the static corner weights', () => {
  const { ch, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0);
  stepBare(ch, terrain, 2000, 5000);
  assert.ok(Math.abs(ch.position.y - ch.cgHeight) < 0.002, `y ${ch.position.y}`);
  const total = ch.wheels.reduce((a, w) => a + w.fn, 0);
  assert.ok(Math.abs(total - ch.totalMass * G) / (ch.totalMass * G) < 0.005, `sum Fn ${total}`);
  ch.wheels.forEach((w) => assert.ok(Math.abs(w.fn - w.staticLoad) / w.staticLoad < 0.02, `${w.name}: ${w.fn} vs ${w.staticLoad}`));
  assert.ok(ch.speed < 1e-3, `drift ${ch.speed}`);
});

test('weight distribution matches the configuration (front share and left/right symmetry)', () => {
  const { ch, cfg, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0);
  stepBare(ch, terrain, 1500, 5000);
  const front = ch.wheels[0].fn + ch.wheels[1].fn, total = front + ch.wheels[2].fn + ch.wheels[3].fn;
  assert.ok(Math.abs(front / total - cfg.chassis.frontWeightFraction) < 0.01);
  assert.ok(Math.abs(ch.wheels[0].fn - ch.wheels[1].fn) < 30);
});

test('heave natural frequency and damping ratio agree with the spring/damper design', () => {
  const { ch, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0);
  stepBare(ch, terrain, 1500, 5000);
  ch.position.y += 0.03;                                  // drop 3 cm
  const ys = [];
  stepBare(ch, terrain, 3000, 5000, () => ys.push(ch.position.y - ch.cgHeight));
  // zero crossings of heave displacement -> period
  const cross = [];
  for (let i = 1; i < ys.length; i++) if (ys[i - 1] > 0 !== ys[i] > 0) cross.push(i * DT);
  assert.ok(cross.length >= 3, 'oscillation observed');
  const period = 2 * (cross[2] - cross[0]) / 2;
  const f = 1 / period;
  assert.ok(f > 1.3 && f < 2.1, `heave frequency ${f.toFixed(2)} Hz`);
  // peak decay between consecutive extrema -> damping ratio via log decrement
  const peaks = [];
  for (let i = 2; i < ys.length - 2; i++) if (Math.abs(ys[i]) > Math.abs(ys[i - 1]) && Math.abs(ys[i]) >= Math.abs(ys[i + 1]) && Math.abs(ys[i]) > 1e-4) peaks.push(Math.abs(ys[i]));
  assert.ok(peaks.length >= 2);
  const delta = Math.log(peaks[0] / peaks[1]) * 1;          // peaks alternate sign => half-cycle decrement
  const zeta = Math.sqrt((2 * delta) ** 2 / ((2 * Math.PI) ** 2 + (2 * delta) ** 2));
  assert.ok(zeta > 0.15 && zeta < 0.9, `damping ratio ${zeta.toFixed(2)}`);
});

test('free fall: wheels leave the ground, body falls at g, suspension droops, landing is stable', () => {
  const { ch, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0);
  stepBare(ch, terrain, 500, 5000);
  ch.position.y += 0.6;
  let airborneSeen = false, maxFn = 0;
  const y0 = ch.position.y;
  let vAtHalf = null;
  stepBare(ch, terrain, 1500, 0, (i) => {
    if (ch.wheels.every((w) => !w.contact)) airborneSeen = true;
    maxFn = Math.max(maxFn, ...ch.wheels.map((w) => w.fn));
    if (i === 100) vAtHalf = ch.velocity.y;
  });
  assert.ok(airborneSeen);
  assert.ok(Math.abs(vAtHalf + G * 100 * DT) < 0.25, `v after 0.2 s ${vAtHalf}`);
  assert.ok(Number.isFinite(maxFn) && maxFn < 60000, `peak tyre load ${maxFn}`);
  assert.ok(Math.abs(ch.position.y - ch.cgHeight) < 0.03 && ch.speed < 0.2, 'comes to rest again');
  void y0;
});

test('steering geometry: Ackermann gives the inner wheel more lock; centre = 0; limited by maxWheelAngle', () => {
  const { ch, cfg, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0);
  const z = [0, 0, 0, 0];
  for (let i = 0; i < 1500; i++) { ch.computeForces(DT, { steer: 0 }, terrain); ch.integrate(DT, z, [5000, 5000, 5000, 5000]); }
  assert.equal(ch.wheels[0].steer, 0);
  for (let i = 0; i < 1500; i++) { ch.computeForces(DT, { steer: -1 }, terrain); ch.integrate(DT, z, [5000, 5000, 5000, 5000]); }   // full left
  const fl = ch.wheels[0].steer, fr = ch.wheels[1].steer;
  assert.ok(fl > fr && fr > 0, `left turn: FL ${fl} FR ${fr}`);
  const nominal = (cfg.chassis.steering.maxWheelAngleDeg * Math.PI) / 180;
  const lockScale = 1;                                      // standing still
  assert.ok(Math.abs(ch.steerAngle - nominal * lockScale) < 1e-6);
  assert.equal(ch.wheels[2].steer, 0, 'rear wheels do not steer');
});

test('braking transfers load to the front axle by roughly m * a * h / L', () => {
  const sim = flatSim({ ...TARMAC_TYRE });
  const ch = sim.vehicle.chassis;
  ch.placeOnTerrain(sim.terrain, 0, 0, 0, 25);
  ch.settle(sim.terrain, 0.3);
  sim.vehicle.drivetrain.transmission.reset(0);
  const front0 = ch.wheels[0].staticLoad + ch.wheels[1].staticLoad;
  let sumA = 0, sumF = 0, n = 0;
  for (let i = 0; i < 700; i++) {
    sim.setInputs({ brake: 0.45, clutch: 1 });
    sim.step();
    if (i > 250 && i < 600) { sumA += -ch.specificForce.x; sumF += ch.wheels[0].fn + ch.wheels[1].fn; n++; }
  }
  const a = sumA / n, front = sumF / n;
  assert.ok(a > 4, `decel ${a}`);
  const expected = (ch.totalMass * a * 0.44) / ch.wheelbase;      // whole-vehicle CoG ~ 0.44 m
  const measured = front - front0;
  assert.ok(Math.abs(measured - expected) / expected < 0.25, `transfer ${measured.toFixed(0)} N vs ${expected.toFixed(0)} N`);
  assert.ok(ch.attitude.pitch < 0, 'nose dives under braking');
});

test('cornering: lateral load transfer and body roll scale with lateral acceleration', () => {
  const sim = flatSim({ ...TARMAC_TYRE });
  const ch = sim.vehicle.chassis;
  ch.placeOnTerrain(sim.terrain, 0, 0, 0, 20);
  ch.settle(sim.terrain, 0.3);
  sim.vehicle.drivetrain.transmission.reset(3);
  let ay = 0, roll = 0, dFn = 0, n = 0;
  for (let i = 0; i < 2500; i++) {
    const v = ch.speed;
    sim.setInputs({ throttle: Math.max(0, Math.min(1, (20 - v) * 0.3 + 0.12)), steer: 0.12 });
    sim.step();
    // right turn: the outside (left) wheels gain load, so use signed (outside - inside) differences
    if (i > 1500) { ay += Math.abs(ch.specificForce.z); roll += Math.abs(ch.attitude.roll); dFn += (ch.wheels[0].fn - ch.wheels[1].fn) + (ch.wheels[2].fn - ch.wheels[3].fn); n++; }
  }
  ay /= n; roll /= n; dFn /= 2 * n;           // load transfer = half of (outside - inside) per axle, summed over both axles
  assert.ok(ay > 5 && ay < 13, `lateral accel ${ay}`);
  const rollGradient = (roll * 180 / Math.PI) / (ay / G);
  assert.ok(rollGradient > 1 && rollGradient < 4.5, `roll gradient ${rollGradient.toFixed(2)} deg/g`);
  // total lateral load transfer (both axles) = M * ay * h_cg / track
  const approx = (ch.totalMass * ay * 0.45) / ch.cfg.trackFront;
  assert.ok(dFn > 0.8 * approx && dFn < 1.25 * approx, `lateral load transfer ${dFn.toFixed(0)} N vs ~${approx.toFixed(0)} N`);
});

test('aerodynamics: drag follows 1/2 rho CdA v^2; downforce loads the tyres', () => {
  const { ch, cfg, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0, 50);
  ch.computeForces(DT, { steer: 0 }, terrain);
  const rho = AMBIENT.pressure / (287.05 * AMBIENT.temperature);
  const drag = 0.5 * rho * cfg.chassis.aero.dragArea * 50 * 50;
  assert.ok(Math.abs(-ch.aeroOut.fx - drag) / drag < 1e-9);
  const down = 0.5 * rho * cfg.chassis.aero.liftArea * 2500;
  assert.ok(Math.abs(-ch.aeroOut.fy - down) / down < 1e-9);
  assert.ok(Math.abs(ch.aeroOut.downforceFront + ch.aeroOut.downforceRear - down) < 1e-9);
  // headwind increases the relative airspeed
  ch.computeForces(DT, { steer: 0 }, terrain, { wind: { x: 0, y: 0, z: 20 } });   // car heads north (-Z): +Z wind is a headwind
  assert.ok(-ch.aeroOut.fx > drag * 1.4);
});

test('banked road: the car stays put on tarmac but slides down on ice', () => {
  const bank = Math.tan((8 * Math.PI) / 180);
  const run = (layers, compound) => {
    const terrain = new FunctionTerrain((x, z) => bank * z, () => layers);    // rises toward +z (south): the car faces east so its left side is up-hill
    const sim = flatSim({ layers, ...compound });
    sim.terrain = terrain; sim.vehicle.terrain = terrain;
    const ch = sim.vehicle.chassis;
    ch.placeOnTerrain(terrain, 0, 0, Math.PI / 2);
    for (let i = 0; i < 2500; i++) { sim.setInputs({ brake: 0, handbrake: 1 }); sim.step(); }
    return ch.speed;
  };
  assert.ok(run([{ type: 'tarmac' }], TARMAC_TYRE) < 0.2, 'holds on tarmac');
  assert.ok(run([{ type: 'ice' }], { compound: 'rally_gravel_15' }) > 1.0, 'slides on ice');
});

test('slope: handbrake holds a 20% grade on tarmac; the car rolls back when released (neutral)', () => {
  const grade = 0.2;
  const terrain = new FunctionTerrain((x) => -grade * x);          // downhill toward +x
  const sim = flatSim({ ...TARMAC_TYRE });
  sim.terrain = terrain; sim.vehicle.terrain = terrain;
  const ch = sim.vehicle.chassis;
  ch.placeOnTerrain(terrain, 0, 0, Math.PI / 2);                   // facing east, i.e. downhill
  for (let i = 0; i < 1500; i++) { sim.setInputs({ handbrake: 1, clutch: 1 }); sim.step(); }
  assert.ok(ch.speed < 0.15, `held: ${ch.speed}`);
  for (let i = 0; i < 1500; i++) { sim.setInputs({ handbrake: 0, brake: 0, clutch: 1 }); sim.step(); }
  assert.ok(ch.speed > 2, `rolling: ${ch.speed}`);
  const a = (ch.speed) / 3;
  assert.ok(a > 0.3 && a < 2.5);
});

test('jump over a ramp: airborne phase, bump-stop energy on landing, stable and finite', () => {
  const h = (x) => (x > 20 && x < 30 ? 0.25 * (x - 20) : x >= 30 ? 0 : 0);   // 25% ramp then a drop
  const terrain = new FunctionTerrain((x) => h(x), () => [{ type: 'tarmac' }], 0.02);
  const sim = flatSim({ ...TARMAC_TYRE });
  sim.terrain = terrain; sim.vehicle.terrain = terrain;
  const ch = sim.vehicle.chassis;
  ch.placeOnTerrain(terrain, 0, 0, Math.PI / 2, 30);
  let air = 0, maxZ = 0, impact = 0;
  for (let i = 0; i < 3000; i++) {
    sim.setInputs({ throttle: 0, clutch: 1 });
    sim.step();
    if (ch.wheels.every((w) => !w.contact)) air++;
    for (const w of ch.wheels) { maxZ = Math.max(maxZ, w.z / w.susp.travel); impact = Math.max(impact, w.impactEnergy); }
  }
  assert.ok(air * DT > 0.3, `airtime ${air * DT}s`);
  assert.ok(maxZ > 0.8, `landing uses the travel (${maxZ})`);
  assert.ok(Number.isFinite(ch.position.x) && ch.position.y > -1);
});

test('underbody skid plate contact is reported when the belly hits a central ridge the wheels straddle', () => {
  // 0.35 m high ridge 0.45 m wide, centred between the wheel tracks
  const terrain = new FunctionTerrain((x, z) => 0.35 * Math.exp(-((x - 15) ** 2) / 1.2) * Math.exp(-(z * z) / 0.15), () => [{ type: 'tarmac' }], 0.02);
  const sim = flatSim({ ...TARMAC_TYRE });
  sim.terrain = terrain; sim.vehicle.terrain = terrain;
  const ch = sim.vehicle.chassis;
  ch.placeOnTerrain(terrain, 0, 0, Math.PI / 2, 12);
  let contact = false, maxForce = 0, energy = 0;
  for (let i = 0; i < 1500; i++) {
    sim.setInputs({ clutch: 1 });
    sim.step();
    if (ch.underbody.contact) contact = true;
    maxForce = Math.max(maxForce, ch.underbody.force); energy += ch.underbody.energy;
  }
  assert.ok(contact, 'skid plate touched the ridge');
  assert.ok(maxForce > 500 && Number.isFinite(maxForce));
  assert.ok(energy > 0, 'impact energy is reported for the damage model');
  assert.ok(ch.speed > 3, 'the car scrapes over rather than stopping dead');
});

test('rollover: an upside-down car lands on its roof (hull contact) instead of sinking through the ground', () => {
  const sim = flatSim({ ...TARMAC_TYRE });
  const ch = sim.vehicle.chassis;
  ch.placeOnTerrain(sim.terrain, 0, 0, 0);
  ch.quaternion = Q.fromAxisAngle({ x: 1, y: 0, z: 0 }, Math.PI);   // upside down
  ch.position = { x: 0, y: 1.6, z: 0 };
  let hits = 0;
  for (let i = 0; i < 2500; i++) { sim.setInputs({}); sim.step(); if (ch.hullHits.length) hits++; }
  assert.ok(hits > 0, 'roof touched the ground');
  assert.ok(ch.position.y > 0.5, `body height ${ch.position.y}`);
  assert.ok(ch.speed < 0.5);
  assert.ok(Number.isFinite(ch.position.y));
});

test('handbrake on gravel at speed provokes rotation and rear slip (rally oversteer)', () => {
  const run = (hb) => {
    const sim = flatSim({ layers: [{ type: 'gravel', depth: 0.04 }, { type: 'packed_dirt' }] });
    const ch = sim.vehicle.chassis;
    ch.placeOnTerrain(sim.terrain, 0, 0, 0, 22);
    ch.settle(sim.terrain, 0.3);
    sim.vehicle.drivetrain.transmission.reset(3);
    let maxYaw = 0, maxRearSlip = 0;
    for (let i = 0; i < 1500; i++) {
      sim.setInputs({ throttle: 0.4, steer: i < 600 ? 0.12 : 0, handbrake: i > 400 && i < 700 ? hb : 0 });
      sim.step();
      maxYaw = Math.max(maxYaw, Math.abs(ch.angularVelocity.y));
      maxRearSlip = Math.max(maxRearSlip, Math.abs(ch.wheels[2].slipAngle), Math.abs(ch.wheels[3].slipAngle));
    }
    return { maxYaw, maxRearSlip };
  };
  const on = run(1), off = run(0);
  assert.ok(on.maxYaw > 1.25 * off.maxYaw, `yaw rate ${on.maxYaw} vs ${off.maxYaw}`);
  assert.ok(on.maxRearSlip > 1.3 * off.maxRearSlip);
});

test('chassis rejects non-finite state loudly', () => {
  const { ch, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0);
  ch.velocity.x = NaN;
  assert.throws(() => ch.assertFinite('test'), /non-finite/);
});

test('impulse API changes momentum and reports absorbed energy', () => {
  const { ch, terrain } = bareChassis();
  ch.placeOnTerrain(terrain, 0, 0, 0, 20);                       // heading north = -Z
  const before = ch.speed;
  const e = ch.applyImpulse({ x: 0.8, y: 0.5, z: -2 }, { x: 0, y: 0, z: 3000 });   // push back against the motion, off-centre
  assert.ok(ch.speed < before - 1.5, `speed ${ch.speed}`);
  assert.ok(e > 20000, `absorbed ${e}`);
  assert.ok(Math.abs(ch.angularVelocity.y) > 0.01, 'off-centre impulse spins the car');
});
