/**
 * Terrain interface used by the chassis.
 *
 *   sample(x, z, id) -> { height, nx, ny, nz, layers }
 *
 * `height` is world Y of the drivable surface at world (x, z); (nx,ny,nz) the unit surface
 * normal; `layers` the surface layer stack (see SurfaceLibrary). `id` identifies the caller
 * (wheel index) so implementations can keep per-caller search caches.
 */

export class FlatTerrain {
  /** Planar ground: a single sample per wheel is exact, so the tyre-envelope multi-sampling is skipped. */
  get envelope() { return false; }

  /** @param {{height?:number, layers?:Array}} [opts] */
  constructor({ height = 0, layers = [{ type: 'tarmac' }] } = {}) {
    this.height = height;
    this.layers = layers;
  }
  sample() { return { height: this.height, nx: 0, ny: 1, nz: 0, layers: this.layers }; }
}

/**
 * Terrain from an analytic height function h(x, z). Normals come from central differences.
 * Handy for ramps, crests, banked corners and test rigs.
 */
export class FunctionTerrain {
  constructor(heightFn, layersFn = () => [{ type: 'tarmac' }], eps = 0.05) {
    this.h = heightFn; this.layersFn = layersFn; this.eps = eps;
  }
  sample(x, z) {
    const e = this.eps, h = this.h;
    const dhdx = (h(x + e, z) - h(x - e, z)) / (2 * e);
    const dhdz = (h(x, z + e) - h(x, z - e)) / (2 * e);
    const inv = 1 / Math.sqrt(dhdx * dhdx + 1 + dhdz * dhdz);
    return { height: h(x, z), nx: -dhdx * inv, ny: inv, nz: -dhdz * inv, layers: this.layersFn(x, z) };
  }
}
