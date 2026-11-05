import { clamp } from '../math/util.js';

/**
 * Multi-layer surface resolution.
 *
 * A surface sample is a stack of layers from top to bottom, e.g.
 *     [{type:'gravel', depth:0.04}, {type:'packed_dirt'}]
 * The last entry is the base (no depth). A loose layer may also carry `sinkage` [m] (rut depth) which adds
 * bulldozing resistance. A loose layer of depth d "absorbs" the tyre with
 * weight 1 - exp(-d / penetrationDepth); the remainder falls through to the layer below.
 * Grip, stiffness, rolling resistance, heat exchange and wear are weighted by those shares,
 * so a thin film of gravel on tarmac behaves like ball-bearings while a deep bed behaves
 * like gravel, with a smooth transition in between.
 */
export class SurfaceLibrary {
  /** @param {object} cfg surfaces.json */
  constructor(cfg) {
    this.defs = cfg.surfaces;
    for (const [name, d] of Object.entries(this.defs)) {
      for (const k of ['category', 'friction', 'slideRatio', 'stiffness', 'rollingResistance']) {
        if (d[k] === undefined) throw new RangeError(`surfaces.${name}.${k} is required`);
      }
      if (!(d.friction > 0)) throw new RangeError(`surfaces.${name}.friction must be > 0`);
    }
    this.categories = cfg.categories ?? ['tarmac', 'wet_tarmac', 'dirt', 'gravel', 'mud', 'snow', 'ice'];
  }

  has(type) { return Object.prototype.hasOwnProperty.call(this.defs, type); }

  def(type) {
    const d = this.defs[type];
    if (!d) throw new RangeError(`unknown surface type "${type}"`);
    return d;
  }

  /**
   * Resolve a layer stack into blended surface properties.
   * @param {Array<{type:string,depth?:number}>} layers top -> bottom
   * @param {Record<string,number>} tireGrip per-category tyre grip multipliers
   * @param {number} ambientK
   * @param {object} [out] reused result object
   */
  resolve(layers, tireGrip, ambientK, out = {}) {
    let remaining = 1;
    let friction = 0, slide = 0, stiff = 0, crr = 0, heat = 0, abr = 0, press = 0, roadK = 0, rough = 0;
    let bestW = -1, bestType = layers[layers.length - 1].type;
    let depthDrag = 0, looseDepth = 0;
    for (let i = 0; i < layers.length; i++) {
      const L = layers[i];
      const d = this.def(L.type);
      const isBase = i === layers.length - 1;
      let w;
      if (isBase) w = remaining;
      else {
        const depth = L.depth ?? 0;
        if (depth <= 0) continue;
        const lam = Math.max(d.penetrationDepth ?? 0.03, 1e-4);
        w = remaining * (1 - Math.exp(-depth / lam));
        depthDrag += (d.depthResistance ?? 0) * Math.min(depth + 1.5 * (L.sinkage ?? 0), 0.2);
        looseDepth += depth;
      }
      remaining -= w;
      const grip = tireGrip[d.category] ?? 1;
      friction += w * d.friction * grip;
      slide += w * d.slideRatio;
      stiff += w * d.stiffness;
      crr += w * d.rollingResistance;
      heat += w * (d.heatTransfer ?? 1);
      abr += w * (d.abrasiveness ?? 1);
      press += w * (d.pressureSensitivity ?? 0);
      rough += w * (d.roughness ?? 0);
      const rk = Math.min(ambientK + (d.roadTempOffsetK ?? 0), d.roadTempCapK ?? Infinity);
      roadK += w * rk;
      if (w > bestW) { bestW = w; bestType = L.type; }
    }
    out.friction = friction;
    out.slideRatio = clamp(slide, 0.5, 1);
    out.stiffness = stiff;
    out.rollingResistance = crr + depthDrag;
    out.heatTransfer = heat;
    out.abrasiveness = abr;
    out.pressureSensitivity = press;
    out.roadTempK = roadK;
    out.roughness = rough;
    out.dominant = bestType;
    out.looseDepth = looseDepth;
    return out;
  }
}
