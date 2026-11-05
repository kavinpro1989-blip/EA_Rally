import { fbm1D } from '../../core_physics/math/rng.js';
import { G } from '../../core_physics/math/constants.js';
import { clamp } from '../../core_physics/math/util.js';

/** Centripetal Catmull-Rom (Barry-Goldman) between P1 and P2. Points are {x,y,z}. */
function catmullRom(P0, P1, P2, P3, u, out) {
  const a = 0.5;
  const d01 = Math.max(Math.hypot(P1.x - P0.x, P1.y - P0.y, P1.z - P0.z) ** a, 1e-6);
  const d12 = Math.max(Math.hypot(P2.x - P1.x, P2.y - P1.y, P2.z - P1.z) ** a, 1e-6);
  const d23 = Math.max(Math.hypot(P3.x - P2.x, P3.y - P2.y, P3.z - P2.z) ** a, 1e-6);
  const t0 = 0, t1 = d01, t2 = t1 + d12, t3 = t2 + d23;
  const t = t1 + (t2 - t1) * u;
  for (const k of ['x', 'y', 'z']) {
    const A1 = ((t1 - t) * P0[k] + (t - t0) * P1[k]) / (t1 - t0);
    const A2 = ((t2 - t) * P1[k] + (t - t1) * P2[k]) / (t2 - t1);
    const A3 = ((t3 - t) * P2[k] + (t - t2) * P3[k]) / (t3 - t2);
    const B1 = ((t2 - t) * A1 + (t - t0) * A2) / (t2 - t0);
    const B2 = ((t3 - t) * A2 + (t - t1) * A3) / (t3 - t1);
    out[k] = ((t2 - t) * B1 + (t - t1) * B2) / (t2 - t1);
  }
  return out;
}

/** Gaussian smoothing of an array with edge-normalised weights. sigma in samples. */
export function gaussianSmooth(arr, sigma, closed = false) {
  if (!(sigma > 0.3)) return Float64Array.from(arr);
  const n = arr.length, r = Math.ceil(sigma * 3);
  const w = new Float64Array(2 * r + 1);
  for (let k = -r; k <= r; k++) w[k + r] = Math.exp(-(k * k) / (2 * sigma * sigma));
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0, wsum = 0;
    for (let k = -r; k <= r; k++) {
      let j = i + k;
      if (closed) j = ((j % n) + n) % n;
      else if (j < 0 || j >= n) continue;
      sum += w[k + r] * arr[j]; wsum += w[k + r];
    }
    out[i] = sum / wsum;
  }
  return out;
}

/**
 * Local 3D Cartesian track spline built from a parsed stage definition.
 *
 *   world axes: x = East, y = Up, z = -North.
 *
 * Pipeline: dedupe -> centripetal Catmull-Rom through the GPS fixes -> uniform arc-length resampling
 * -> optional Gaussian smoothing of GPS noise (horizontal / elevation) -> frames (heading,
 * signed curvature, grade, vertical curvature) -> banking (measured or procedural superelevation
 * + noise). Curvature sign: positive = turning LEFT. Bank sign: positive = right side lower.
 */
export class TrackSpline {
  static build(def) {
    const pts = def.points, proc = def.processing;
    const closed = def.closed;
    const nP = pts.length;
    const segCount = closed ? nP : nP - 1;
    const at = (i) => {
      if (closed) return pts[((i % nP) + nP) % nP];
      if (i < 0) return { x: 2 * pts[0].x - pts[1].x, y: 2 * pts[0].y - pts[1].y, z: 2 * pts[0].z - pts[1].z };
      if (i >= nP) return { x: 2 * pts[nP - 1].x - pts[nP - 2].x, y: 2 * pts[nP - 1].y - pts[nP - 2].y, z: 2 * pts[nP - 1].z - pts[nP - 2].z };
      return pts[i];
    };

    // 1. dense Catmull-Rom polyline
    const dx = [], dy = [], dz = [], dw = [], db = [];
    const tmp = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < segCount; i++) {
      const P1 = at(i), P2 = at(i + 1);
      const len = Math.hypot(P2.x - P1.x, P2.y - P1.y, P2.z - P1.z);
      const m = clamp(Math.ceil(len / 0.4), 4, 4000);
      const last = i === segCount - 1;
      const pa = pts[((i % nP) + nP) % nP], pb = pts[(((i + 1) % nP) + nP) % nP];
      for (let k = 0; k < m + (last && !closed ? 1 : 0); k++) {
        const u = k / m;
        catmullRom(at(i - 1), P1, P2, at(i + 2), u, tmp);
        dx.push(tmp.x); dy.push(tmp.y); dz.push(tmp.z);
        dw.push(pa.width + (pb.width - pa.width) * u);
        db.push(pa.bank === null ? NaN : pa.bank + (pb.bank - pa.bank) * u);
      }
    }
    if (closed) { dx.push(dx[0]); dy.push(dy[0]); dz.push(dz[0]); dw.push(dw[0]); db.push(db[0]); }

    // 2. uniform arc-length resample
    const nd = dx.length;
    const cum = new Float64Array(nd);
    for (let i = 1; i < nd; i++) cum[i] = cum[i - 1] + Math.hypot(dx[i] - dx[i - 1], dy[i] - dy[i - 1], dz[i] - dz[i - 1]);
    const total = cum[nd - 1];
    const ds = proc.sampleSpacing;
    let n = Math.max(8, Math.round(total / ds) + 1);
    const step = total / (n - 1);
    let X = new Float64Array(n), Y = new Float64Array(n), Z = new Float64Array(n), W = new Float64Array(n), BM = new Float64Array(n);
    let j = 0;
    for (let k = 0; k < n; k++) {
      const target = k * step;
      while (j < nd - 2 && cum[j + 1] < target) j++;
      const seg = cum[j + 1] - cum[j];
      const f = seg > 1e-12 ? (target - cum[j]) / seg : 0;
      X[k] = dx[j] + (dx[j + 1] - dx[j]) * f;
      Y[k] = dy[j] + (dy[j + 1] - dy[j]) * f;
      Z[k] = dz[j] + (dz[j + 1] - dz[j]) * f;
      W[k] = dw[j] + (dw[j + 1] - dw[j]) * f;
      BM[k] = db[j] + (db[j + 1] - db[j]) * f;
    }
    const sampleStep = step;

    // 3. smoothing of GPS noise
    X = gaussianSmooth(X, proc.horizontalSmoothing / sampleStep, closed);
    Z = gaussianSmooth(Z, proc.horizontalSmoothing / sampleStep, closed);
    Y = gaussianSmooth(Y, proc.elevationSmoothing / sampleStep, closed);

    // 4. arc lengths
    const S = new Float64Array(n), L = new Float64Array(n);   // 3D and horizontal
    for (let i = 1; i < n; i++) {
      const hx = X[i] - X[i - 1], hz = Z[i] - Z[i - 1], hy = Y[i] - Y[i - 1];
      L[i] = L[i - 1] + Math.hypot(hx, hz);
      S[i] = S[i - 1] + Math.hypot(hx, hy, hz);
    }

    // 5. frames
    const T = {
      n, closed, step: sampleStep, length: S[n - 1], horizontalLength: L[n - 1],
      s: S, l: L, x: X, y: Y, z: Z, width: W,
      tx: new Float64Array(n), tz: new Float64Array(n), rx: new Float64Array(n), rz: new Float64Array(n),
      heading: new Float64Array(n), kappa: new Float64Array(n), grade: new Float64Array(n),
      kv: new Float64Array(n), bank: new Float64Array(n), tanBank: new Float64Array(n),
    };
    for (let i = 0; i < n; i++) {
      const a = closed ? (i - 1 + n - 1) % (n - 1) : Math.max(i - 1, 0);
      const b = closed ? (i + 1) % (n - 1) : Math.min(i + 1, n - 1);
      let tx = X[b] - X[a], tz = Z[b] - Z[a];
      if (closed && i === n - 1) { tx = X[1] - X[n - 2]; tz = Z[1] - Z[n - 2]; }
      const h = Math.hypot(tx, tz) || 1;
      T.tx[i] = tx / h; T.tz[i] = tz / h;
      T.rx[i] = -T.tz[i]; T.rz[i] = T.tx[i];
      T.heading[i] = Math.atan2(T.tx[i], -T.tz[i]);
    }
    // unwrap heading
    for (let i = 1; i < n; i++) {
      let d = T.heading[i] - T.heading[i - 1];
      while (d > Math.PI) { T.heading[i] -= 2 * Math.PI; d -= 2 * Math.PI; }
      while (d < -Math.PI) { T.heading[i] += 2 * Math.PI; d += 2 * Math.PI; }
    }
    const kRaw = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const a = Math.max(i - 1, 0), b = Math.min(i + 1, n - 1);
      const dl = L[b] - L[a];
      kRaw[i] = dl > 1e-9 ? -(T.heading[b] - T.heading[a]) / dl : 0;      // left turn positive
    }
    T.kappa = gaussianSmooth(kRaw, proc.curvatureSmoothing / sampleStep);
    for (let i = 0; i < n; i++) {
      const a = Math.max(i - 1, 0), b = Math.min(i + 1, n - 1);
      const dl = L[b] - L[a];
      T.grade[i] = dl > 1e-9 ? (Y[b] - Y[a]) / dl : 0;
    }
    const yS = gaussianSmooth(Y, proc.verticalCurvatureSmoothing / sampleStep);
    for (let i = 0; i < n; i++) {
      const a = Math.max(i - 1, 0), b = Math.min(i + 1, n - 1);
      const ia = Math.max(a - 1, 0), ib = Math.min(b + 1, n - 1);
      const dl = L[ib] - L[ia];
      const g0 = (yS[a] - yS[ia]) / Math.max(L[a] - L[ia], 1e-9);
      const g2 = (yS[ib] - yS[b]) / Math.max(L[ib] - L[b], 1e-9);
      T.kv[i] = dl > 1e-9 ? (g2 - g0) / dl : 0;
    }

    T.yTrend = gaussianSmooth(Y, 60 / sampleStep);       // long-wavelength trend for crest/dip prominence
    T.ySmooth = yS;
    T.kappaRobust = gaussianSmooth(kRaw, proc.apexCurvatureSmoothing / sampleStep);

    // 6. banking
    const measured = !Number.isNaN(BM[0]);
    const seed = def.seed ?? 1;
    const bank = new Float64Array(n);
    const maxBank = (proc.maxBankDeg * Math.PI) / 180;
    for (let i = 0; i < n; i++) {
      if (measured) { bank[i] = (BM[i] * Math.PI) / 180; continue; }
      const k = T.kappa[i];
      const super_ = Math.min(maxBank, Math.atan(proc.bankFraction * Math.abs(k) * proc.designSpeed * proc.designSpeed / G));
      const noise = ((proc.bankNoiseDeg * Math.PI) / 180) * fbm1D(S[i] / proc.bankNoiseWavelength, seed, 3);
      bank[i] = -Math.sign(k) * super_ + noise;       // inside of the corner lower (right side lower = positive)
    }
    T.bank = measured ? bank : gaussianSmooth(bank, 8 / sampleStep);
    for (let i = 0; i < n; i++) T.tanBank[i] = Math.tan(T.bank[i]);

    return new TrackSpline(T, def);
  }

  constructor(data, def) {
    Object.assign(this, data);
    this.def = def;
    this.road = def.road;
    this._buildGrid(25);
  }

  _buildGrid(cell) {
    this.cell = cell;
    this.grid = new Map();
    for (let i = 0; i < this.n; i++) {
      const key = this._key(Math.floor(this.x[i] / cell), Math.floor(this.z[i] / cell));
      let b = this.grid.get(key);
      if (!b) this.grid.set(key, (b = []));
      b.push(i);
    }
  }
  _key(ix, iz) { return ix * 73856093 ^ iz * 19349663; }

  /** Index of the sample at or before arc length s, and fraction towards the next. */
  locate(s) {
    s = clamp(s, 0, this.length);
    const S = this.s;
    let lo = 0, hi = this.n - 2;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (S[mid] <= s) lo = mid; else hi = mid - 1;
    }
    const seg = S[lo + 1] - S[lo];
    return { i: lo, t: seg > 1e-12 ? (s - S[lo]) / seg : 0 };
  }

  /** Interpolated frame at arc length s. */
  sampleAt(s) {
    const { i, t } = this.locate(s);
    return this._interp(i, t);
  }

  _interp(i, t) {
    const j = i + 1;
    const lerp = (a) => a[i] + (a[j] - a[i]) * t;
    let tx = lerp(this.tx), tz = lerp(this.tz);
    const h = Math.hypot(tx, tz) || 1;
    tx /= h; tz /= h;
    const y = lerp(this.y);
    const dl = this.l[j] - this.l[i];
    return {
      s: lerp(this.s), x: lerp(this.x), y, z: lerp(this.z), tx, tz, rx: -tz, rz: tx,
      heading: lerp(this.heading), kappa: lerp(this.kappa), bank: lerp(this.bank), tanBank: lerp(this.tanBank),
      width: lerp(this.width), grade: dl > 1e-9 ? (this.y[j] - this.y[i]) / dl : 0,
      dTanBankDl: dl > 1e-9 ? (this.tanBank[j] - this.tanBank[i]) / dl : 0, kv: lerp(this.kv), index: i, t,
    };
  }

  /**
   * Closest point on the track to world (x, z). `yHint` resolves overlapping sections (bridges).
   * @returns {{s:number,c:number,dist:number,frame:object}|null}
   */
  nearest(x, z, yHint) {
    const cell = this.cell;
    const ix = Math.floor(x / cell), iz = Math.floor(z / cell);
    let best = null, bestCost = Infinity;
    for (let ring = 1; ring <= 4 && !best; ring++) {
      for (let a = -ring; a <= ring; a++) {
        for (let b = -ring; b <= ring; b++) {
          if (ring > 1 && Math.abs(a) < ring && Math.abs(b) < ring) continue;
          const bucket = this.grid.get(this._key(ix + a, iz + b));
          if (!bucket) continue;
          for (const i of bucket) {
            for (let seg = i - 1; seg <= i; seg++) {
              if (seg < 0 || seg >= this.n - 1) continue;
              const x0 = this.x[seg], z0 = this.z[seg];
              const ex = this.x[seg + 1] - x0, ez = this.z[seg + 1] - z0;
              const len2 = ex * ex + ez * ez;
              let t = len2 > 1e-12 ? ((x - x0) * ex + (z - z0) * ez) / len2 : 0;
              t = clamp(t, 0, 1);
              const px = x0 + ex * t, pz = z0 + ez * t;
              let cost = (x - px) ** 2 + (z - pz) ** 2;
              if (yHint !== undefined) {
                const py = this.y[seg] + (this.y[seg + 1] - this.y[seg]) * t;
                const dy = Math.abs(yHint - py);
                if (dy > 3) cost += (dy - 3) ** 2 * 4;      // different level -> penalise (bridges, overpasses)
              }
              if (cost < bestCost) { bestCost = cost; best = { seg, t }; }
            }
          }
        }
      }
    }
    if (!best) return this._nearestLinear(x, z);
    return this._pack(best.seg, best.t, x, z);
  }

  _nearestLinear(x, z) {
    let bestCost = Infinity, best = null;
    for (let seg = 0; seg < this.n - 1; seg++) {
      const x0 = this.x[seg], z0 = this.z[seg];
      const ex = this.x[seg + 1] - x0, ez = this.z[seg + 1] - z0;
      const len2 = ex * ex + ez * ez;
      const t = clamp(len2 > 1e-12 ? ((x - x0) * ex + (z - z0) * ez) / len2 : 0, 0, 1);
      const cost = (x - x0 - ex * t) ** 2 + (z - z0 - ez * t) ** 2;
      if (cost < bestCost) { bestCost = cost; best = { seg, t }; }
    }
    return this._pack(best.seg, best.t, x, z);
  }

  _pack(seg, t, x, z) {
    const f = this._interp(seg, t);
    const c = (x - f.x) * f.rx + (z - f.z) * f.rz;
    return { s: f.s, c, dist: Math.hypot(x - f.x, z - f.z), frame: f };
  }

  /** World position of a point at arc length s and signed lateral offset c (right positive), on the road surface plane. */
  pointAt(s, c = 0) {
    const f = this.sampleAt(s);
    return { x: f.x + f.rx * c, y: f.y - c * f.tanBank, z: f.z + f.rz * c, frame: f };
  }

  /** Surface layer stack of the authored stage at distance s (before dynamic evolution). */
  layersAt(s) {
    const segs = this.def.surfaceSegments;
    let lo = 0, hi = segs.length - 1, found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (segs[mid].fromDistance <= s) { found = mid; lo = mid + 1; } else hi = mid - 1;
    }
    if (found >= 0 && s <= segs[found].toDistance) return segs[found].layers;
    return this.road.defaultLayers;
  }

  /** Triangle strip data for a Three.js BufferGeometry: positions, normals, uvs (Float32Array) and indices (Uint32Array). */
  buildRoadMesh({ lateralSteps = 8, stride = 2, includeShoulders = true } = {}) {
    const rd = this.road;
    const idx = [];
    for (let i = 0; i < this.n; i += stride) idx.push(i);
    if (idx[idx.length - 1] !== this.n - 1) idx.push(this.n - 1);
    const cols = lateralSteps + 1;
    const positions = new Float32Array(idx.length * cols * 3);
    const normals = new Float32Array(idx.length * cols * 3);
    const uvs = new Float32Array(idx.length * cols * 2);
    const indices = new Uint32Array((idx.length - 1) * lateralSteps * 6);
    let pi = 0, ui = 0;
    idx.forEach((i, row) => {
      const f = this._interp(Math.min(i, this.n - 2), i >= this.n - 1 ? 1 : 0);
      const half = f.width * 0.5 + (includeShoulders ? rd.shoulderWidth : 0);
      for (let k = 0; k < cols; k++) {
        const u = k / lateralSteps;
        const c = -half + 2 * half * u;
        const prof = lateralProfile(c, f.width, rd);
        const y = f.y - c * f.tanBank + prof.h;
        positions[pi] = f.x + f.rx * c; positions[pi + 1] = y; positions[pi + 2] = f.z + f.rz * c;
        const dhdc = -f.tanBank + prof.dhdc;
        const dhdl = f.grade / Math.max(0.2, 1 - f.kappa * c);
        const gx = dhdl * f.tx + dhdc * f.rx, gz = dhdl * f.tz + dhdc * f.rz;
        const inv = 1 / Math.sqrt(gx * gx + 1 + gz * gz);
        normals[pi] = -gx * inv; normals[pi + 1] = inv; normals[pi + 2] = -gz * inv;
        uvs[ui++] = u; uvs[ui++] = this.s[i] / 10;
        pi += 3;
      }
    });
    let ii = 0;
    for (let r = 0; r < idx.length - 1; r++) {
      for (let k = 0; k < lateralSteps; k++) {
        const a = r * cols + k, b = a + 1, c = a + cols, d = c + 1;
        indices[ii++] = a; indices[ii++] = c; indices[ii++] = b;
        indices[ii++] = b; indices[ii++] = c; indices[ii++] = d;
      }
    }
    return { positions, normals, uvs, indices };
  }
}

/**
 * Cross-section height offset relative to the banked road plane and its slope dh/dc.
 * Parabolic crown across the carriageway, constant edge cross-fall over the shoulder,
 * then a steeper verge down to a flat floor.
 */
export function lateralProfile(c, width, road) {
  const a = width * 0.5, k = road.crownSlope;
  const ac = Math.abs(c), sg = c < 0 ? -1 : 1;
  const hEdge = -k * a;
  if (ac <= a) return { h: (-k * c * c) / a, dhdc: (-2 * k * c) / a };
  const sh = road.shoulderWidth;
  if (ac <= a + sh) return { h: hEdge - 2 * k * (ac - a), dhdc: sg * -2 * k };
  const hSh = hEdge - 2 * k * sh;
  const v = road.verge;
  const dv = Math.min(ac - a - sh, v.width);
  const slope = v.slope;
  const h = hSh + slope * dv;
  return { h, dhdc: ac - a - sh < v.width ? sg * slope : 0 };
}
