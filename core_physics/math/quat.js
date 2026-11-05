import { V3 } from './vec3.js';

/**
 * Quaternion helpers on plain {x, y, z, w} objects (same layout as THREE.Quaternion).
 *
 * Vehicle body frame: +X forward, +Y up, +Z right. A body-to-world quaternion
 * `q` maps a body-frame vector to world via `Q.rotate(q, v)`.
 */
export const Q = {
  identity: () => ({ x: 0, y: 0, z: 0, w: 1 }),
  clone: (q) => ({ x: q.x, y: q.y, z: q.z, w: q.w }),
  mul: (a, b) => ({
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
  }),
  conj: (q) => ({ x: -q.x, y: -q.y, z: -q.z, w: q.w }),
  normalize(q) {
    const l = Math.hypot(q.x, q.y, q.z, q.w);
    if (l < 1e-12) return { x: 0, y: 0, z: 0, w: 1 };
    return { x: q.x / l, y: q.y / l, z: q.z / l, w: q.w / l };
  },
  fromAxisAngle(axis, angle) {
    const h = angle * 0.5, s = Math.sin(h);
    return { x: axis.x * s, y: axis.y * s, z: axis.z * s, w: Math.cos(h) };
  },
  /** Exponential map of a rotation vector (axis * angle). */
  fromRotationVector(v) {
    const a = Math.hypot(v.x, v.y, v.z);
    if (a < 1e-9) return Q.normalize({ x: v.x * 0.5, y: v.y * 0.5, z: v.z * 0.5, w: 1 });
    const h = a * 0.5, k = Math.sin(h) / a;
    return { x: v.x * k, y: v.y * k, z: v.z * k, w: Math.cos(h) };
  },
  /** Rotate vector v by q (body -> world). */
  rotate(q, v) {
    const tx = 2 * (q.y * v.z - q.z * v.y);
    const ty = 2 * (q.z * v.x - q.x * v.z);
    const tz = 2 * (q.x * v.y - q.y * v.x);
    return {
      x: v.x + q.w * tx + (q.y * tz - q.z * ty),
      y: v.y + q.w * ty + (q.z * tx - q.x * tz),
      z: v.z + q.w * tz + (q.x * ty - q.y * tx),
    };
  },
  /** Inverse rotation (world -> body). */
  rotateInv(q, v) { return Q.rotate(Q.conj(q), v); },
  /** Orthonormal basis columns of the body frame expressed in world coordinates. */
  toBasis(q) {
    return {
      x: Q.rotate(q, { x: 1, y: 0, z: 0 }), // forward
      y: Q.rotate(q, { x: 0, y: 1, z: 0 }), // up
      z: Q.rotate(q, { x: 0, y: 0, z: 1 }), // right
    };
  },
  /** Build a quaternion from three orthonormal basis vectors (columns). */
  fromBasis(bx, by, bz) {
    const m00 = bx.x, m01 = by.x, m02 = bz.x;
    const m10 = bx.y, m11 = by.y, m12 = bz.y;
    const m20 = bx.z, m21 = by.z, m22 = bz.z;
    const tr = m00 + m11 + m22;
    let q;
    if (tr > 0) {
      const s = Math.sqrt(tr + 1) * 2;
      q = { w: 0.25 * s, x: (m21 - m12) / s, y: (m02 - m20) / s, z: (m10 - m01) / s };
    } else if (m00 > m11 && m00 > m22) {
      const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
      q = { w: (m21 - m12) / s, x: 0.25 * s, y: (m01 + m10) / s, z: (m02 + m20) / s };
    } else if (m11 > m22) {
      const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
      q = { w: (m02 - m20) / s, x: (m01 + m10) / s, y: 0.25 * s, z: (m12 + m21) / s };
    } else {
      const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
      q = { w: (m10 - m01) / s, x: (m02 + m20) / s, y: (m12 + m21) / s, z: 0.25 * s };
    }
    return Q.normalize(q);
  },
  /** Orientation facing `forward` with `up` as the approximate up direction. */
  lookAlong(forward, up = { x: 0, y: 1, z: 0 }) {
    const f = V3.normalize(forward);
    let r = V3.cross(f, up);
    if (V3.lengthSq(r) < 1e-10) r = V3.cross(f, { x: 0, y: 0, z: 1 });
    r = V3.normalize(r);
    const u = V3.cross(r, f);
    return Q.fromBasis(f, u, r);
  },
};
