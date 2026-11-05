import test from 'node:test';
import assert from 'node:assert/strict';
import { Table1D, Table2D } from '../core_physics/math/tables.js';
import { Q } from '../core_physics/math/quat.js';
import { V3 } from '../core_physics/math/vec3.js';
import { Rng, fbm1D } from '../core_physics/math/rng.js';
import { wrapPi, smoothstep, lag, approach } from '../core_physics/math/util.js';

test('Table1D linear interpolation, clamping and extrapolation', () => {
  const t = new Table1D([[0, 0], [10, 100], [20, 100]]);
  assert.equal(t.eval(5), 50);
  assert.equal(t.eval(-5), 0);
  assert.equal(t.eval(99), 100);
  const lin = new Table1D([[0, 0], [10, 100]], { extrapolate: 'linear' });
  assert.equal(lin.eval(20), 200);
});

test('Table1D smooth (PCHIP) is monotone and passes through the samples', () => {
  const pts = [[0, 0], [1, 1], [2, 1.1], [3, 5], [4, 5.2]];
  const t = new Table1D(pts, { smooth: true });
  for (const [x, y] of pts) assert.ok(Math.abs(t.eval(x) - y) < 1e-12);
  let prev = -Infinity;
  for (let x = 0; x <= 4; x += 0.01) { const v = t.eval(x); assert.ok(v >= prev - 1e-9, `non-monotone at ${x}`); prev = v; }
  assert.ok(t.eval(2.5) < 5 && t.eval(2.5) > 1.1);   // no overshoot
});

test('Table1D rejects malformed input', () => {
  assert.throws(() => new Table1D([[0, 0]]), /at least 2/);
  assert.throws(() => new Table1D([[0, 0], [0, 1]]), /strictly increasing/);
  assert.throws(() => new Table1D([[0, 0], [1, NaN]]), /not finite/);
  assert.throws(() => new Table1D({ x: [0, 1], y: [0] }), /length mismatch/);
});

test('Table2D bilinear', () => {
  const t = new Table2D({ x: [0, 10], y: [0, 1], z: [[0, 10], [100, 110]] });
  assert.equal(t.eval(0, 0), 0);
  assert.equal(t.eval(10, 1), 110);
  assert.equal(t.eval(5, 0.5), 55);
  assert.equal(t.eval(-5, 2), 100);   // clamped
  assert.throws(() => new Table2D({ x: [0, 1], y: [0, 1], z: [[0, 1]] }), /one row per y/);
});

test('quaternion rotation, inverse and basis round trip', () => {
  const q = Q.normalize(Q.mul(Q.fromAxisAngle({ x: 0, y: 1, z: 0 }, 0.7), Q.fromAxisAngle({ x: 1, y: 0, z: 0 }, -0.3)));
  const v = { x: 1.2, y: -0.4, z: 2.2 };
  const back = Q.rotateInv(q, Q.rotate(q, v));
  assert.ok(V3.distance(back, v) < 1e-12);
  const B = Q.toBasis(q);
  const q2 = Q.fromBasis(B.x, B.y, B.z);
  assert.ok(V3.distance(Q.rotate(q2, v), Q.rotate(q, v)) < 1e-12);
  // rotation about +Y by +90 deg turns forward (+X) toward -Z (left / counter-clockwise from above)
  const r = Q.rotate(Q.fromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI / 2), { x: 1, y: 0, z: 0 });
  assert.ok(Math.abs(r.x) < 1e-12 && Math.abs(r.z + 1) < 1e-12);
});

test('rotation-vector exponential matches axis-angle', () => {
  const a = Q.fromRotationVector({ x: 0, y: 0.6, z: 0 });
  const b = Q.fromAxisAngle({ x: 0, y: 1, z: 0 }, 0.6);
  assert.ok(Math.abs(a.y - b.y) < 1e-12 && Math.abs(a.w - b.w) < 1e-12);
});

test('Rng is deterministic and uniform enough', () => {
  const a = new Rng(42), b = new Rng(42);
  for (let i = 0; i < 100; i++) assert.equal(a.next(), b.next());
  const r = new Rng(7);
  let sum = 0;
  for (let i = 0; i < 20000; i++) sum += r.next();
  assert.ok(Math.abs(sum / 20000 - 0.5) < 0.01);
  const g = new Rng(3);
  let m = 0, v = 0; const n = 20000;
  const xs = Array.from({ length: n }, () => g.gaussian());
  xs.forEach((x) => { m += x / n; });
  xs.forEach((x) => { v += (x - m) ** 2 / n; });
  assert.ok(Math.abs(m) < 0.03 && Math.abs(v - 1) < 0.05);
  // state save / restore
  const s = new Rng(1); s.next(); const st = s.getState(); const x1 = s.next(); s.setState(st); assert.equal(s.next(), x1);
  assert.ok(Math.abs(fbm1D(3.3, 1)) <= 1);
});

test('utility functions', () => {
  assert.ok(Math.abs(wrapPi(3 * Math.PI) - Math.PI) < 1e-12);
  assert.ok(Math.abs(wrapPi(-3 * Math.PI - 0.1) - (Math.PI - 0.1)) < 1e-12);
  assert.equal(smoothstep(0, 1, 0.5), 0.5);
  assert.ok(Math.abs(lag(0, 1, 1, 1) - (1 - Math.exp(-1))) < 1e-12);
  assert.equal(lag(0, 1, 0, 0.1), 1);
  assert.equal(approach(0, 10, 3), 3);
  assert.equal(approach(0, 2, 3), 2);
});
