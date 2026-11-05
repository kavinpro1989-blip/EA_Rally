/** Throws a descriptive error for malformed lookup-table axes. */
function checkAxis(xs, label) {
  if (!Array.isArray(xs) || xs.length < 2) throw new RangeError(`${label}: need at least 2 breakpoints`);
  for (let i = 0; i < xs.length; i++) {
    if (!Number.isFinite(xs[i])) throw new RangeError(`${label}: breakpoint ${i} is not finite`);
    if (i > 0 && !(xs[i] > xs[i - 1])) throw new RangeError(`${label}: breakpoints must be strictly increasing (index ${i})`);
  }
}

function endSlope(h0, h1, d0, d1) {
  let m = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1);
  if (Math.sign(m) !== Math.sign(d0)) m = 0;
  else if (Math.sign(d0) !== Math.sign(d1) && Math.abs(m) > 3 * Math.abs(d0)) m = 3 * d0;
  return m;
}

/** Fritsch-Carlson monotone cubic slopes (PCHIP): no overshoot between samples. */
function pchipSlopes(xs, ys) {
  const n = xs.length;
  const h = new Array(n - 1), d = new Array(n - 1), m = new Array(n);
  for (let i = 0; i < n - 1; i++) { h[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
  if (n === 2) { m[0] = m[1] = d[0]; return m; }
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  m[0] = endSlope(h[0], h[1], d[0], d[1]);
  m[n - 1] = endSlope(h[n - 2], h[n - 3], d[n - 2], d[n - 3]);
  return m;
}

/**
 * 1-D lookup table. Config format: [[x, y], ...] or {x: [...], y: [...]}.
 * Linear interpolation by default, monotone cubic with {smooth: true}.
 * Outside the range values are clamped (default) or linearly extrapolated.
 */
export class Table1D {
  constructor(spec, { smooth = false, extrapolate = 'clamp', label = 'Table1D' } = {}) {
    let xs, ys;
    if (Array.isArray(spec)) { xs = spec.map((p) => p[0]); ys = spec.map((p) => p[1]); }
    else if (spec && Array.isArray(spec.x) && Array.isArray(spec.y)) { xs = spec.x.slice(); ys = spec.y.slice(); }
    else throw new TypeError(`${label}: expected [[x,y],...] or {x:[],y:[]}`);
    if (xs.length !== ys.length) throw new RangeError(`${label}: x and y length mismatch`);
    checkAxis(xs, label);
    ys.forEach((y, i) => { if (!Number.isFinite(y)) throw new RangeError(`${label}: y[${i}] is not finite`); });
    this.xs = xs; this.ys = ys; this.smooth = smooth; this.extrapolate = extrapolate;
    this.slopes = smooth ? pchipSlopes(xs, ys) : null;
    this.xMin = xs[0]; this.xMax = xs[xs.length - 1];
    this._i = 0;
  }

  _segment(x) {
    const xs = this.xs, n = xs.length;
    let i = this._i;
    if (i >= n - 1) i = n - 2;
    if (x >= xs[i] && x <= xs[i + 1]) return i;
    let lo = 0, hi = n - 2;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (xs[mid] <= x) lo = mid; else hi = mid - 1;
    }
    this._i = lo;
    return lo;
  }

  eval(x) {
    const { xs, ys } = this;
    const n = xs.length;
    if (x <= xs[0]) {
      if (this.extrapolate === 'linear') {
        const s = this.smooth ? this.slopes[0] : (ys[1] - ys[0]) / (xs[1] - xs[0]);
        return ys[0] + s * (x - xs[0]);
      }
      return ys[0];
    }
    if (x >= xs[n - 1]) {
      if (this.extrapolate === 'linear') {
        const s = this.smooth ? this.slopes[n - 1] : (ys[n - 1] - ys[n - 2]) / (xs[n - 1] - xs[n - 2]);
        return ys[n - 1] + s * (x - xs[n - 1]);
      }
      return ys[n - 1];
    }
    const i = this._segment(x);
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    if (!this.smooth) return ys[i] + (ys[i + 1] - ys[i]) * t;
    const t2 = t * t, t3 = t2 * t;
    const m = this.slopes;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] +
           (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  }

  /** Maximum y over the table (exact for linear tables, sampled for smooth ones). */
  maxY() {
    if (!this.smooth) return Math.max(...this.ys);
    let best = -Infinity;
    const steps = 200;
    for (let i = 0; i <= steps; i++) best = Math.max(best, this.eval(this.xMin + ((this.xMax - this.xMin) * i) / steps));
    return best;
  }
}

/**
 * 2-D bilinear lookup. Config format: {x: [...], y: [...], z: [[...], ...]}
 * where z[j][i] is the value at (x[i], y[j]).
 */
export class Table2D {
  constructor(spec, label = 'Table2D') {
    if (!spec || !Array.isArray(spec.x) || !Array.isArray(spec.y) || !Array.isArray(spec.z)) {
      throw new TypeError(`${label}: expected {x:[],y:[],z:[[]]}`);
    }
    checkAxis(spec.x, `${label}.x`);
    checkAxis(spec.y, `${label}.y`);
    if (spec.z.length !== spec.y.length) throw new RangeError(`${label}: z must have one row per y breakpoint`);
    spec.z.forEach((row, j) => {
      if (!Array.isArray(row) || row.length !== spec.x.length) throw new RangeError(`${label}: z row ${j} must have ${spec.x.length} columns`);
      row.forEach((v, i) => { if (!Number.isFinite(v)) throw new RangeError(`${label}: z[${j}][${i}] is not finite`); });
    });
    this.xs = spec.x.slice(); this.ys = spec.y.slice(); this.z = spec.z.map((r) => r.slice());
  }

  static _find(axis, v) {
    const n = axis.length;
    if (v <= axis[0]) return [0, 0];
    if (v >= axis[n - 1]) return [n - 2, 1];
    let lo = 0, hi = n - 2;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (axis[mid] <= v) lo = mid; else hi = mid - 1;
    }
    return [lo, (v - axis[lo]) / (axis[lo + 1] - axis[lo])];
  }

  eval(x, y) {
    const [i, tx] = Table2D._find(this.xs, x);
    const [j, ty] = Table2D._find(this.ys, y);
    const z = this.z;
    const a = z[j][i] + (z[j][i + 1] - z[j][i]) * tx;
    const b = z[j + 1][i] + (z[j + 1][i + 1] - z[j + 1][i]) * tx;
    return a + (b - a) * ty;
  }
}

/** Convenience: build a Table1D from either a spec or a plain constant. */
export function tableOrConstant(spec, opts) {
  if (typeof spec === 'number') return { eval: () => spec, constant: spec };
  return new Table1D(spec, opts);
}

