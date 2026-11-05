/**
 * Deterministic PRNG (mulberry32). All stochastic behaviour in the engine
 * (stone strikes, procedural terrain noise) draws from instances of this class
 * so a run is a pure function of (config, seed, inputs).
 */
export class Rng {
  constructor(seed = 1) {
    this.state = seed >>> 0 || 0x9e3779b9;
  }
  /** Uniform float in [0, 1). */
  next() {
    let t = (this.state = (this.state + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(lo, hi) { return lo + (hi - lo) * this.next(); }
  int(n) { return Math.floor(this.next() * n); }
  /** Standard normal via Box-Muller (consumes two uniforms, keeps no hidden state). */
  gaussian() {
    const u = Math.max(this.next(), 1e-12);
    const v = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  getState() { return this.state; }
  setState(s) { this.state = s >>> 0; }
}

/** Stateless integer hash -> [0,1). Used for spatially coherent procedural noise. */
export function hash2(ix, iy, seed = 0) {
  let h = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263) + Math.imul(seed | 0, 2147483647)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** 1-D value noise with smooth interpolation, range [-1, 1]. */
export function valueNoise1D(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * f * (f * (f * 6 - 15) + 10);
  const a = hash2(i, 0, seed) * 2 - 1;
  const b = hash2(i + 1, 0, seed) * 2 - 1;
  return a + (b - a) * u;
}

/** Fractal 1-D noise (sum of octaves), roughly within [-1, 1]. */
export function fbm1D(x, seed = 0, octaves = 3, lacunarity = 2, gain = 0.5) {
  let amp = 1, freq = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise1D(x * freq, seed + o * 101);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}
