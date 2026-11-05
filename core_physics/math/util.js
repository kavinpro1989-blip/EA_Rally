import { TWO_PI } from './constants.js';

export const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a, b, t) => a + (b - a) * t;
/** Sign with 0 mapped to +1 (never returns 0). */
export const sgn = (x) => (x < 0 ? -1 : 1);
export const deg2rad = (d) => (d * Math.PI) / 180;
export const rad2deg = (r) => (r * 180) / Math.PI;
export const kelvinToC = (k) => k - 273.15;
export const cToKelvin = (c) => c + 273.15;

export function smoothstep(e0, e1, x) {
  if (e1 === e0) return x >= e1 ? 1 : 0;
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** Wrap an angle to (-pi, pi]. */
export function wrapPi(a) {
  a = a % TWO_PI;
  if (a > Math.PI) a -= TWO_PI;
  else if (a <= -Math.PI) a += TWO_PI;
  return a;
}

/** Exact first-order lag step: unconditionally stable for any dt/tau. */
export function lag(current, target, tau, dt) {
  if (tau <= 0) return target;
  return target + (current - target) * Math.exp(-dt / tau);
}

/** Move `current` toward `target` by at most `maxDelta`. */
export function approach(current, target, maxDelta) {
  const d = target - current;
  if (d > maxDelta) return current + maxDelta;
  if (d < -maxDelta) return current - maxDelta;
  return target;
}

/** Safe divide: returns `fallback` when |den| is below eps. */
export function sdiv(num, den, fallback = 0, eps = 1e-12) {
  return Math.abs(den) < eps ? fallback : num / den;
}

export function assertFinite(value, label) {
  if (!Number.isFinite(value)) throw new RangeError(`${label} must be a finite number, got ${value}`);
  return value;
}

/** FNV-1a 32-bit over a string; used for state hashes (determinism checks / UI desync detection). */
export function fnv1a(str, seed = 0x811c9dc5) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** 64-bit-ish hex digest built from two independently seeded FNV passes. */
export function hashString(str) {
  const a = fnv1a(str);
  const b = fnv1a(str, 0x9747b28c);
  return a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0');
}

/** Deep-ish clone for plain JSON-compatible state objects (numbers, strings, arrays, objects, typed arrays excluded). */
export function cloneState(o) {
  return JSON.parse(JSON.stringify(o));
}
