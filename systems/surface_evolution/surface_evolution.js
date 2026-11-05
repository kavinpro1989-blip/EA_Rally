import { clamp, clamp01 } from '../../core_physics/math/util.js';
import { Rng, fbm1D } from '../../core_physics/math/rng.js';
import { hashBytes, bytesToBase64, base64ToBytes } from './bytes.js';

/**
 * Dynamic road-surface field: gravel sweeping, rutting and compaction as cars drive the stage.
 *
 * A regular grid (rows every `ds` m along the stage, columns every `dc` m across the carriageway)
 * stores, per cell:
 *   dLoose     change in loose top-layer depth versus the authored depth [m]  (swept gravel/mud/snow, berms)
 *   rut        depth of the wheel rut [m]; negative values are displaced-material ridges
 *   compaction 0..1 packing of the surface
 *
 * Every tick each wheel in contact deposits a pass: material in its footprint is displaced to the
 * flanks (volume conserved, biased to the side the tyre is sliding towards), ruts deepen toward the
 * bearing-capacity equilibrium, compaction increases with load and distance. Slow lateral flow
 * relaxes steep berms to the material's angle of repose.
 *
 * The StageTerrain queries `sample` (rut depth + gradients, which become part of the terrain height
 * and normal, so ruts guide tyres) and `layersAt` (modified layer stack: reduced loose depth on the
 * racing line, packed snow, deeper mud in ruts).
 */
export class SurfaceEvolution {
  /**
   * @param {import('../stage/spline.js').TrackSpline} spline
   * @param {import('../../core_physics/chassis/surface.js').SurfaceLibrary} surfaces
   * @param {object} [opts] { rowSpacing, columnSpacing, footprintLength, maxBerm, diffusionInterval }
   */
  constructor(spline, surfaces, opts = {}) {
    this.spline = spline;
    this.surfaces = surfaces;
    this.ds = opts.rowSpacing ?? 1.0;
    this.dc = opts.columnSpacing ?? 0.25;
    this.footprint = opts.footprintLength ?? 0.2;
    this.maxBerm = opts.maxBerm ?? 0.15;
    this.diffusionInterval = opts.diffusionInterval ?? 0.25;
    let maxWidth = 0;
    if (spline?.width?.length) {
      for (let i = 0; i < spline.width.length; i++) {
        if (spline.width[i] > maxWidth) maxWidth = spline.width[i];
      }
    }
    maxWidth += 2 * (spline?.road?.shoulderWidth ?? 0);
    this.halfWidth = maxWidth / 2;
    this.rows = Math.ceil(spline.length / this.ds) + 2;
    this.cols = Math.ceil(maxWidth / this.dc) + 1;
    const n = this.rows * this.cols;
    this.dLoose = new Float32Array(n);
    this.rut = new Float32Array(n);
    this.compaction = new Float32Array(n);
    // authored top-layer depth per row (the layer stack is constant across the carriageway)
    this.depth0 = new Float32Array(this.rows);
    for (let r = 0; r < this.rows; r++) {
      const layers = spline.layersAt(Math.min(r * this.ds, spline.length));
      this.depth0[r] = layers.length > 1 ? (layers[0].depth ?? 0) : 0;
    }
    this.dirtyRows = new Set();
    this.timeSinceDiffusion = 0;
    this.stats = { swept: 0, passes: 0 };
    this._cells = [];
    this._sampleOut = { rut: 0, drutDc: 0, drutDs: 0, dLoose: 0, compaction: 0 };
  }

  // --- indexing -----------------------------------------------------------------------------
  _col(c) { return (c + this.halfWidth) / this.dc; }
  _idx(r, j) { return r * this.cols + j; }
  inside(r, j) { return r >= 0 && r < this.rows && j >= 0 && j < this.cols; }

  /** Bilinear sample of a field at (s, c). */
  _bilinear(f, s, c) {
    const fr = s / this.ds, fj = this._col(c);
    const r = Math.floor(fr), j = Math.floor(fj);
    if (r < 0 || r >= this.rows - 1 || j < 0 || j >= this.cols - 1) return 0;
    const tr = fr - r, tj = fj - j;
    const a = f[this._idx(r, j)], b = f[this._idx(r, j + 1)], cc = f[this._idx(r + 1, j)], d = f[this._idx(r + 1, j + 1)];
    return (a * (1 - tj) + b * tj) * (1 - tr) + (cc * (1 - tj) + d * tj) * tr;
  }

  /** Surface perturbation at stage coordinates (s, c). Values are reused between calls. */
  sample(s, c) {
    const o = this._sampleOut;
    const eps = this.dc * 0.5;
    o.rut = this._bilinear(this.rut, s, c);
    o.drutDc = (this._bilinear(this.rut, s, c + eps) - this._bilinear(this.rut, s, c - eps)) / (2 * eps);
    o.drutDs = (this._bilinear(this.rut, s + this.ds * 0.5, c) - this._bilinear(this.rut, s - this.ds * 0.5, c)) / this.ds;
    o.dLoose = this._bilinear(this.dLoose, s, c);
    o.compaction = this._bilinear(this.compaction, s, c);
    return o;
  }

  /**
   * Modify an authored layer stack with the dynamic state at (s, c).
   * @param {Array} base authored layers  @param {number} s @param {number} c  @param {object} e result of `sample`
   */
  layersAt(base, s, c, e = this.sample(s, c)) {
    if (base.length < 2) {
      // single hard layer: only compaction-driven type changes are possible (none)
      return base;
    }
    const top = base[0];
    const def = this.surfaces.def(top.type);
    let depth = ((top.depth ?? 0) + e.dLoose) * (1 - 0.5 * e.compaction);
    const sinkage = Math.max(0, e.rut);
    let type = top.type;
    const ev = def.evolution;
    if (ev?.compactTo && e.compaction > ev.compactThreshold) {
      type = ev.compactTo;
      depth *= 0.4;
    }
    if (depth < 0.002) return base.slice(1);
    // `sinkage` (rut depth) does not thicken the layer; it raises the bulldozing part of the rolling resistance
    return [{ type, depth, sinkage }, ...base.slice(1)];
  }

  // --- pass application -----------------------------------------------------------------------------
  /**
   * Apply a tyre pass.
   * @param {object} p
   * @param {number} p.s @param {number} p.c patch position in stage coordinates
   * @param {number} p.distance wheel travel over the ground this step [m]
   * @param {number} p.load normal load [N]  @param {number} p.width tyre width [m]
   * @param {number} p.slip 0..1 tyre saturation (sliding digs deeper)
   * @param {number} p.lateralBias -1..1 side the tyre slides towards (+1 = right)
   * @param {Array} p.layers authored layers at this row
   */
  applyPass(p) {
    const row = Math.round(p.s / this.ds);
    if (row < 0 || row >= this.rows) return;
    const top = p.layers[0];
    const def = this.surfaces.def(top.type);
    const ev = def.evolution;
    const baseDef = this.surfaces.def(p.layers[p.layers.length - 1].type);
    const dist = Math.max(p.distance, 0);
    if (dist <= 0) return;
    const loadFactor = clamp(p.load / 4000, 0.2, 3);

    // Cells touched by the tyre footprint, weighted by how much of each cell the tyre actually covers
    const half = p.width / 2;
    const jLo = Math.max(0, Math.floor(this._col(p.c - half) - 0.5)), jHi = Math.min(this.cols - 1, Math.ceil(this._col(p.c + half) + 0.5));
    const cells = this._cells;
    cells.length = 0;
    for (let j = jLo; j <= jHi; j++) {
      const cj = j * this.dc - this.halfWidth;
      const overlap = Math.min(p.c + half, cj + this.dc / 2) - Math.max(p.c - half, cj - this.dc / 2);
      if (overlap > 1e-6) cells.push({ j, w: Math.min(1, overlap / this.dc) });
    }
    if (!cells.length) return;
    const j0 = cells[0].j, j1 = cells[cells.length - 1].j;
    this.stats.passes++;

    // 1. loose-material sweep with flank deposition
    if (ev?.loose && p.layers.length > 1) {
      const k = ev.sweepPerMeter * dist * loadFactor * (1 + 4 * clamp01(p.slip));
      const fr = Math.min(0.9, k);
      let removedSum = 0;
      for (const { j, w } of cells) {
        const i = this._idx(row, j);
        const depth = this.depth0[row] + this.dLoose[i];
        const rem = Math.min(depth, depth * fr * w);
        if (rem > 0) { this.dLoose[i] -= rem; removedSum += rem; }
      }
      if (removedSum > 0) {
        const qRight = clamp(0.5 + 0.35 * p.lateralBias, 0.1, 0.9);
        this._deposit(row, j1 + 1, +1, removedSum * qRight, ev);
        this._deposit(row, j0 - 1, -1, removedSum * (1 - qRight), ev);
        this.stats.swept += removedSum * this.dc * this.ds;
        this.dirtyRows.add(row);
      }
    }

    // 2. rutting towards bearing-capacity equilibrium
    const rutDef = ev?.bearingPressure ? ev : (baseDef.evolution ?? null);
    if (rutDef?.bearingPressure) {
      const area = Math.max(p.width, 0.05) * this.footprint;
      const pressure = p.load / area;
      if (pressure > rutDef.bearingPressure) {
        const zEq = Math.min(rutDef.maxRut, (pressure - rutDef.bearingPressure) / rutDef.soilStiffness);
        const gain = 1 - Math.exp(-dist / 0.5);
        let incSum = 0;
        for (const { j, w } of cells) {
          const i = this._idx(row, j);
          const inc = Math.max(0, zEq - this.rut[i]) * gain * w;
          if (inc > 0) { this.rut[i] += inc; incSum += inc; }
        }
        if (incSum > 0) {
          // displaced material rises as ridges beside the rut
          const ridge = (incSum * (ev?.ridgeFraction ?? 0.3)) * 0.5;
          for (const jr of [j0 - 1, j1 + 1]) {
            if (jr >= 0 && jr < this.cols) {
              const ir = this._idx(row, jr);
              this.rut[ir] = Math.max(-0.3 * rutDef.maxRut, this.rut[ir] - ridge);
            }
          }
          this.dirtyRows.add(row);
        }
      }
    }

    // 3. compaction
    const kc = (ev?.compactionPerMeter ?? baseDef.evolution?.compactionPerMeter ?? 0) * dist * loadFactor;
    if (kc > 0) {
      for (const { j, w } of cells) {
        const i = this._idx(row, j);
        this.compaction[i] += (1 - this.compaction[i]) * (1 - Math.exp(-kc * w));
      }
    }
  }

  _deposit(row, col, dir, amount, ev) {
    // Pile the displaced material on the flank column; excess above the berm limit spills outward.
    let left = amount;
    for (let step = 0; step < 6 && left > 1e-9; step++, col += dir) {
      if (col < 0 || col >= this.cols) return;          // lost over the road edge
      const i = this._idx(row, col);
      const room = Math.max(0, this.maxBerm - this.dLoose[i]);
      const put = Math.min(room, left);
      this.dLoose[i] += put;
      left -= put;
    }
  }

  /** Called every tick by the Vehicle with the vehicle state. */
  update(dt, vehicle) {
    const ch = vehicle.chassis;
    const sp = this.spline;
    for (const w of ch.wheels) {
      const ts = w.terrainSample;
      if (!w.contact || !ts || ts.s === undefined || !ts.onRoad) continue;
      const frame = sp.sampleAt(ts.s);
      const vLat = ch.velocity.x * frame.rx + ch.velocity.z * frame.rz;
      const vAlong = ch.velocity.x * frame.tx + ch.velocity.z * frame.tz;
      const dist = Math.hypot(vLat, vAlong) * dt;
      this.applyPass({
        s: ts.s, c: ts.c, distance: dist, load: w.fn, width: w.tire.cfg.width,
        slip: w.tire.out.saturation, lateralBias: Math.tanh(vLat / 4),
        layers: sp.layersAt(ts.s),
      });
    }
    this.timeSinceDiffusion += dt;
    if (this.timeSinceDiffusion >= this.diffusionInterval) {
      this.relax(this.timeSinceDiffusion);
      this.timeSinceDiffusion = 0;
    }
  }

  /** Let steep berms slump to the angle of repose; only rows touched since the last call are processed. */
  relax(dt) {
    const rows = Array.from(this.dirtyRows).sort((a, b) => a - b);
    this.dirtyRows.clear();
    for (const r of rows) {
      const layers = this.spline.layersAt(Math.min(r * this.ds, this.spline.length));
      const ev = layers.length > 1 ? this.surfaces.def(layers[0].type).evolution : null;
      if (!ev?.loose) continue;
      const limit = ev.reposeSlope * this.dc;
      let moved = false;
      for (let pass = 0; pass < 3; pass++) {
        for (let j = 0; j < this.cols - 1; j++) {
          const a = this._idx(r, j), b = a + 1;
          const diff = this.dLoose[a] - this.dLoose[b];
          if (Math.abs(diff) > limit) {
            const m = (Math.abs(diff) - limit) * 0.25 * Math.sign(diff);
            // never move more than is there
            const mm = m > 0 ? Math.min(m, this.depth0[r] + this.dLoose[a]) : -Math.min(-m, this.depth0[r] + this.dLoose[b]);
            this.dLoose[a] -= mm; this.dLoose[b] += mm; moved = true;
          }
        }
      }
      if (moved) this.dirtyRows.add(r);
    }
    void dt;
  }

  /**
   * Age the stage with `count` earlier cars following a plausible racing line: they cut to the
   * inside of bends (offset proportional to curvature), with smooth seeded wander. Produces the
   * swept-clean racing line and berms that later starters find.
   */
  seedWithPasses(count, opts = {}) {
    const rng = new Rng(opts.seed ?? 99);
    const trackWidth = opts.trackWidth ?? 1.55;
    const tyreWidth = opts.tyreWidth ?? 0.2;
    const load = opts.load ?? 3200;
    const lineGain = opts.lineGain ?? 14;
    const sp = this.spline;
    for (let car = 0; car < count; car++) {
      const phase = rng.range(0, 1000);
      const wander = rng.range(0.15, 0.45);
      for (let s = 0; s < sp.length; s += this.ds) {
        const f = sp.sampleAt(s);
        const half = f.width / 2 - 1.1;
        const line = clamp(-sp.kappaRobust[f.index] * lineGain * half, -half, half) + wander * fbm1D(s / 25 + phase, 3, 2);
        const layers = sp.layersAt(s);
        for (const side of [-1, 1]) {
          this.applyPass({
            s, c: line + side * trackWidth / 2, distance: this.ds, load, width: tyreWidth, slip: 0.1 + 0.4 * Math.abs(f.kappa) * 40,
            lateralBias: Math.sign(-f.kappa) * 0.5, layers,
          });
        }
        // front axle passes carry the same line; rears follow in the front tracks
      }
      this.relax(1);
    }
  }

  // --- diagnostics ------------------------------------------------------------------------------------
  /** Loose depth [m] at (s, c) including dynamic changes (0 if no loose layer). */
  looseDepthAt(s, c) {
    const layers = this.spline.layersAt(s);
    if (layers.length < 2) return 0;
    const e = this.sample(s, c);
    return Math.max(0, (layers[0].depth ?? 0) + e.dLoose);
  }

  /** Mean loose depth across a lateral band, for tests / HUD. */
  meanLooseDepth(s, cLo, cHi) {
    let sum = 0, n = 0;
    for (let c = cLo; c <= cHi; c += this.dc) { sum += this.looseDepthAt(s, c); n++; }
    return n ? sum / n : 0;
  }

  stateHash() {
    return hashBytes(new Uint8Array(this.dLoose.buffer)) + hashBytes(new Uint8Array(this.rut.buffer)) + hashBytes(new Uint8Array(this.compaction.buffer));
  }

  getState() {
    return {
      rows: this.rows, cols: this.cols, dLoose: bytesToBase64(new Uint8Array(this.dLoose.buffer)),
      rut: bytesToBase64(new Uint8Array(this.rut.buffer)), compaction: bytesToBase64(new Uint8Array(this.compaction.buffer)),
      dirtyRows: Array.from(this.dirtyRows), timeSinceDiffusion: this.timeSinceDiffusion, stats: { ...this.stats },
    };
  }

  setState(s) {
    if (s.rows !== this.rows || s.cols !== this.cols) throw new RangeError('surface evolution snapshot has different grid dimensions');
    const f32 = (b64) => { const u = base64ToBytes(b64); return new Float32Array(u.buffer, u.byteOffset, u.byteLength / 4); };
    this.dLoose = Float32Array.from(f32(s.dLoose));
    this.rut = Float32Array.from(f32(s.rut));
    this.compaction = Float32Array.from(f32(s.compaction));
    this.dirtyRows = new Set(s.dirtyRows);
    this.timeSinceDiffusion = s.timeSinceDiffusion;
    this.stats = { ...s.stats };
  }

  reset() {
    this.dLoose.fill(0); this.rut.fill(0); this.compaction.fill(0);
    this.dirtyRows.clear(); this.stats = { swept: 0, passes: 0 }; this.timeSinceDiffusion = 0;
  }
}
