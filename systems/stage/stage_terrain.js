import { lateralProfile } from './spline.js';

/**
 * Terrain backed by a TrackSpline. Implements the chassis terrain interface
 * `sample(x, z, id, yHint) -> {height, nx, ny, nz, layers, ...}`.
 *
 * Height = road centreline elevation + banking plane (-c tan(bank)) + crown/shoulder/verge profile
 *          - rut depth from the dynamic surface-evolution field.
 * The normal is analytic (gradient along and across the road, with the arc-length metric
 * correction inside bends) plus the rut-wall gradient, so ruts steer tyres without extra force terms.
 */
export class StageTerrain {
  /**
   * @param {import('./spline.js').TrackSpline} spline
   * @param {{evolution?: object}} [opts]
   */
  constructor(spline, opts = {}) {
    this.spline = spline;
    this.road = spline.road;
    this.evolution = opts.evolution ?? null;
    this.last = { s: 0, c: 0, onRoad: true, id: -1 };
  }

  setEvolution(evo) { this.evolution = evo; }

  sample(x, z, id = 0, yHint) {
    const sp = this.spline, rd = this.road;
    const q = sp.nearest(x, z, yHint);
    const f = q.frame, c = q.c;
    const half = f.width * 0.5;
    const prof = lateralProfile(c, f.width, rd);

    let height = f.y - c * f.tanBank + prof.h;
    let dhdc = -f.tanBank + prof.dhdc;
    let dhdl = (f.grade - c * f.dTanBankDl) / Math.max(0.2, 1 - f.kappa * c);

    const onRoad = Math.abs(c) <= half;
    const onShoulder = !onRoad && Math.abs(c) <= half + rd.shoulderWidth;
    let layers;
    if (onRoad) layers = sp.layersAt(q.s);
    else if (onShoulder) layers = rd.shoulderLayers;
    else layers = rd.verge.layers;

    const evo = this.evolution;
    if (evo && onRoad) {
      const e = evo.sample(q.s, c);
      height -= e.rut;
      dhdc -= e.drutDc;
      dhdl -= e.drutDs;
      layers = evo.layersAt(layers, q.s, c, e);
    }

    const gx = dhdl * f.tx + dhdc * f.rx;
    const gz = dhdl * f.tz + dhdc * f.rz;
    const inv = 1 / Math.sqrt(gx * gx + 1 + gz * gz);
    this.last.s = q.s; this.last.c = c; this.last.onRoad = onRoad; this.last.id = id;
    return { height, nx: -gx * inv, ny: inv, nz: -gz * inv, layers, s: q.s, c, onRoad, width: f.width };
  }

  /** Height at (x, z) without the evolution field (for placing props). */
  baseHeight(x, z) {
    const q = this.spline.nearest(x, z);
    const f = q.frame;
    return f.y - q.c * f.tanBank + lateralProfile(q.c, f.width, this.road).h;
  }
}
