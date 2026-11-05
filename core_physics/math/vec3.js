/**
 * Minimal 3-vector helpers on plain {x, y, z} objects, so results can be handed
 * straight to `THREE.Vector3.copy()` / `.set()` without a dependency on Three.
 *
 * World frame (Three.js compatible, right-handed, Y up):
 *   +X = East, +Y = Up, +Z = South  (North = -Z)
 */
export const V3 = {
  create: (x = 0, y = 0, z = 0) => ({ x, y, z }),
  clone: (a) => ({ x: a.x, y: a.y, z: a.z }),
  set(o, x, y, z) { o.x = x; o.y = y; o.z = z; return o; },
  copy(o, a) { o.x = a.x; o.y = a.y; o.z = a.z; return o; },
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  scale: (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s }),
  addScaled: (a, b, s) => ({ x: a.x + b.x * s, y: a.y + b.y * s, z: a.z + b.z * s }),
  dot: (a, b) => a.x * b.x + a.y * b.y + a.z * b.z,
  cross: (a, b) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),
  lengthSq: (a) => a.x * a.x + a.y * a.y + a.z * a.z,
  length: (a) => Math.hypot(a.x, a.y, a.z),
  distance: (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
  normalize(a, fallback = { x: 1, y: 0, z: 0 }) {
    const l = Math.hypot(a.x, a.y, a.z);
    return l > 1e-12 ? { x: a.x / l, y: a.y / l, z: a.z / l } : { x: fallback.x, y: fallback.y, z: fallback.z };
  },
  lerp: (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t }),
  /** Component of `a` perpendicular to unit vector `n`. */
  reject: (a, n) => {
    const d = a.x * n.x + a.y * n.y + a.z * n.z;
    return { x: a.x - n.x * d, y: a.y - n.y * d, z: a.z - n.z * d };
  },
  isFinite: (a) => Number.isFinite(a.x) && Number.isFinite(a.y) && Number.isFinite(a.z),
};
