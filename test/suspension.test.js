import test from 'node:test';
import assert from 'node:assert/strict';
import { AxleSuspension } from '../core_physics/chassis/suspension.js';
import { loadCfg } from './helpers.js';

const base = () => loadCfg().chassis.suspension.front;
const mk = (edit) => { const c = base(); if (edit) edit(c); return new AxleSuspension(c); };

test('wheel rate = spring rate x motion ratio squared; static compression inverts the spring law', () => {
  const s = mk((c) => { c.helper = null; c.preload = 0; });
  const kw = s.cfg.springRate * s.cfg.motionRatio ** 2;
  assert.ok(Math.abs(s.springForce(0.1) - kw * 0.1) < 1e-9);
  const z = s.staticCompression(3000);
  assert.ok(Math.abs(s.springForce(z) - 3000) < 1e-6);
  assert.equal(s.staticCompression(-5), 0);
});

test('preload: spring carries force at zero travel and delays static compression', () => {
  const none = mk((c) => { c.helper = null; });
  const pre = mk((c) => { c.helper = null; c.preload = 1200; });
  assert.ok(Math.abs(pre.springForce(0) - 1200) < 1e-9);
  assert.ok(pre.staticCompression(3000) < none.staticCompression(3000));
});

test('helper (tender) spring: soft initial rate, force-continuous hand-over to the main spring', () => {
  const s = mk();
  const h = s.helper;
  const ks = (s.kMain * h.k) / (s.kMain + h.k);
  assert.ok(ks < 0.4 * s.kMain, 'series rate is much softer than the main spring');
  assert.ok(Math.abs(s.springRate(0.001) - ks) < 1e-6);
  const zb = s.zBind, eps = 1e-7;
  assert.ok(Math.abs(s.springForce(zb - eps) - s.springForce(zb + eps)) < 0.01, 'no force jump at the bind point');
  assert.ok(Math.abs(s.springRate(zb + 0.01) - s.kMain) < 1e-9);
  // beyond the bind point the force is exactly the main spring with the helper travel consumed
  assert.ok(Math.abs(s.springForce(0.15) - s.kMain * (0.15 - h.bind)) < 1e-6);
});

test('damper: four regimes with configurable knee velocities', () => {
  const s = mk();
  const d = s.dmp;
  const vb = d.vKneeBump, vr = d.vKneeRebound;
  assert.ok(Math.abs(s.damperForce(vb / 2) - d.cBumpSlow * vb / 2) < 1e-9, 'low-speed bump');
  assert.ok(Math.abs(s.damperForce(-vr / 2) + d.cReboundSlow * vr / 2) < 1e-9, 'low-speed rebound');
  const hiB = s.damperForce(vb + 0.3), hiR = s.damperForce(-(vr + 0.3));
  assert.ok(Math.abs(hiB - (d.cBumpSlow * vb + d.cBumpFast * 0.3)) < 1e-9, 'high-speed bump');
  assert.ok(Math.abs(hiR + (d.cReboundSlow * vr + d.cReboundFast * 0.3)) < 1e-9, 'high-speed rebound');
  // slope change at the knee
  const slopeLo = (s.damperForce(vb - 0.01) - s.damperForce(vb - 0.02)) / 0.01;
  const slopeHi = (s.damperForce(vb + 0.02) - s.damperForce(vb + 0.01)) / 0.01;
  assert.ok(slopeHi < slopeLo * 0.6);
  assert.ok(Math.abs(s.damperForce(0.2, 0.5) - 0.5 * s.damperForce(0.2)) < 1e-9, 'health scales damping');
  assert.ok(s.damperForce(-0.3) < 0 && s.damperForce(0.3) > 0);
  assert.ok(Math.abs(s.damperForce(-0.05)) > Math.abs(s.damperForce(0.05)), 'rebound is firmer than bump by default');
});

test('bump stop is progressive and starts `length` before full travel; droop strap pulls back', () => {
  const s = mk();
  const z0 = s.travel - s.bump.length;
  assert.equal(s.bumpStopForce(z0 - 0.001), 0);
  const f1 = s.bumpStopForce(z0 + 0.01), f2 = s.bumpStopForce(z0 + 0.02), f4 = s.bumpStopForce(z0 + 0.04);
  assert.ok(f2 > 2 * f1 && f4 > 2 * f2 - 1, 'progressive (super-linear)');
  assert.ok(s.endStopForce(s.travel + 0.01) > 1e4);
  assert.ok(s.strapForce(-0.01, 0) < 0);
  assert.equal(s.strapForce(0.05, 0), 0);
});

test('anti-roll bar is antisymmetric and follows k * dz / L^2', () => {
  const s = mk();
  const f = s.arbForce(0.12, 0.08);
  const L = s.arb.armLength;
  assert.ok(Math.abs(f - (s.arb.stiffness * 0.04) / (L * L)) < 1e-9);
  assert.ok(Math.abs(s.arbForce(0.08, 0.12) + f) < 1e-12);
  assert.equal(s.arbForce(0.1, 0.1), 0);
  assert.equal(mk((c) => { c.antiRollBar = { stiffness: 0, armLength: 0.25 }; }).arbForce(0.2, 0), 0);
});

test('camber and toe vary with travel (gain) around the static setting', () => {
  const s = mk();
  const z0 = 0.1;
  assert.ok(Math.abs(s.camberAt(z0, z0) - s.staticCamber) < 1e-12);
  assert.ok(s.camberAt(z0 + 0.05, z0) < s.camberAt(z0, z0), 'negative camber gain in bump');
});
