import { WGS84_A, WGS84_E2, DEG } from '../../core_physics/math/constants.js';

/** Geodetic (deg, deg, m) -> Earth-centred Earth-fixed [m] on the WGS84 ellipsoid. */
export function geodeticToEcef(latDeg, lngDeg, h = 0) {
  const lat = latDeg * DEG, lng = lngDeg * DEG;
  const s = Math.sin(lat), c = Math.cos(lat);
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * s * s);
  return {
    x: (N + h) * c * Math.cos(lng),
    y: (N + h) * c * Math.sin(lng),
    z: (N * (1 - WGS84_E2) + h) * s,
  };
}

/** ECEF [m] -> geodetic {lat, lng (deg), h (m)} (iterative, converges to < 1e-9 rad in a few steps). */
export function ecefToGeodetic(x, y, z) {
  const p = Math.hypot(x, y);
  const lng = Math.atan2(y, x);
  let lat = Math.atan2(z, p * (1 - WGS84_E2));
  let h = 0;
  for (let i = 0; i < 8; i++) {
    const s = Math.sin(lat);
    const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * s * s);
    h = p / Math.cos(lat) - N;
    lat = Math.atan2(z, p * (1 - (WGS84_E2 * N) / (N + h)));
  }
  return { lat: lat / DEG, lng: lng / DEG, h };
}

/** Great-circle distance on a sphere (haversine) in metres; reference for tests/diagnostics. */
export function haversine(lat1, lng1, lat2, lng2, radius = 6371008.8) {
  const p1 = lat1 * DEG, p2 = lat2 * DEG;
  const dp = p2 - p1, dl = (lng2 - lng1) * DEG;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Local tangent-plane (East-North-Up) frame mapped to the engine's world axes:
 *     world.x = East,  world.y = Up,  world.z = -North      (right-handed, Y up, Three.js compatible)
 * An exact WGS84 -> ECEF -> ENU transform is used (no flat-earth approximation), so the
 * frame stays accurate over tens of kilometres.
 */
export class LocalFrame {
  constructor(latDeg, lngDeg, h = 0) {
    this.lat0 = latDeg; this.lng0 = lngDeg; this.h0 = h;
    const lat = latDeg * DEG, lng = lngDeg * DEG;
    const sl = Math.sin(lat), cl = Math.cos(lat), so = Math.sin(lng), co = Math.cos(lng);
    this.east = { x: -so, y: co, z: 0 };
    this.north = { x: -sl * co, y: -sl * so, z: cl };
    this.up = { x: cl * co, y: cl * so, z: sl };
    this.origin = geodeticToEcef(latDeg, lngDeg, h);
  }

  /** geodetic -> world {x, y, z} */
  toLocal(latDeg, lngDeg, h = 0) {
    const e = geodeticToEcef(latDeg, lngDeg, h);
    const dx = e.x - this.origin.x, dy = e.y - this.origin.y, dz = e.z - this.origin.z;
    const E = dx * this.east.x + dy * this.east.y + dz * this.east.z;
    const N = dx * this.north.x + dy * this.north.y + dz * this.north.z;
    const U = dx * this.up.x + dy * this.up.y + dz * this.up.z;
    return { x: E, y: U, z: -N };
  }

  /** world {x, y, z} -> geodetic {lat, lng, h} */
  toGeodetic(p) {
    const E = p.x, U = p.y, N = -p.z;
    const x = this.origin.x + E * this.east.x + N * this.north.x + U * this.up.x;
    const y = this.origin.y + E * this.east.y + N * this.north.y + U * this.up.y;
    const z = this.origin.z + E * this.east.z + N * this.north.z + U * this.up.z;
    return ecefToGeodetic(x, y, z);
  }
}
