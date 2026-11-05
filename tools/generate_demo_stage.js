// Generates stages/demo_stage.json: a SYNTHETIC rally stage (not a real road) placed at an
// arbitrary location in central Finland. Geometry is composed from road-book style segments,
// converted to WGS84 with the exact inverse of the engine's local frame, and corrupted with
// small seeded GPS-like noise so the smoothing/resampling pipeline is exercised.
//
//   node tools/generate_demo_stage.js [outfile]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LocalFrame } from '../systems/stage/geo.js';
import { Rng } from '../core_physics/math/rng.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] ?? path.join(here, '..', 'stages', 'demo_stage.json');

const ORIGIN = { lat: 61.45, lng: 26.0, elevation: 120 };
const frame = new LocalFrame(ORIGIN.lat, ORIGIN.lng, ORIGIN.elevation);
const rng = new Rng(7);

// segments: [type, length|angleDeg, radius0, radius1]. Left turns positive.
const SEGMENTS = [
  ['straight', 260],
  ['arc', +40, 120],
  ['straight', 150],
  ['arc', -70, 60],
  ['straight', 80],
  ['arc', +100, 28],                // square-ish left
  ['straight', 120],
  ['arc', -170, 14],                // hairpin right
  ['straight', 200],
  ['arc', +35, 90],
  ['straight', 60],
  ['spiral', -90, 150, 40],         // tightening right
  ['straight', 160],
  ['arc', -40, 70],
  ['arc', +40, 70],                 // S-bend
  ['straight', 330],                // crest on this straight
  ['arc', +22, 200],
  ['straight', 220],
  ['arc', -60, 45],
  ['straight', 240],
  ['arc', +85, 35],
  ['straight', 300],
];

const pts = [];
let x = 0, z = 0, heading = 0.0;     // compass heading, 0 = north
const STEP = 12;                      // metres between GPS fixes (about 1 Hz at 43 km/h)
const push = () => pts.push({ x, z });
push();
const advance = (len, curvatureAt) => {
  let done = 0;
  while (done < len - 1e-9) {
    const d = Math.min(STEP, len - done);
    const k = curvatureAt(done + d / 2, len);
    heading -= k * d;                 // left turn (k>0) reduces compass heading
    x += Math.sin(heading) * d;
    z += -Math.cos(heading) * d;
    done += d;
    push();
  }
};
for (const seg of SEGMENTS) {
  if (seg[0] === 'straight') advance(seg[1], () => 0);
  else if (seg[0] === 'arc') {
    const ang = (Math.abs(seg[1]) * Math.PI) / 180, R = seg[2], sign = Math.sign(seg[1]);
    advance(ang * R, () => sign / R);
  } else {
    const ang = (Math.abs(seg[1]) * Math.PI) / 180, R0 = seg[2], R1 = seg[3], sign = Math.sign(seg[1]);
    // curvature ramps linearly 1/R0 -> 1/R1 ; length from integral of k ds = ang
    const k0 = 1 / R0, k1 = 1 / R1;
    const len = (2 * ang) / (k0 + k1);
    advance(len, (s, L) => sign * (k0 + (k1 - k0) * (s / L)));
  }
}

// cumulative distance for the elevation profile
const cum = [0];
for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
const total = cum[cum.length - 1];
const gauss = (s, c, sigma, h) => h * Math.exp(-((s - c) ** 2) / (2 * sigma * sigma));
const elevationAt = (s) =>
  ORIGIN.elevation + 14 * Math.sin(s / 310) + 6 * Math.sin(s / 97 + 1) + s * 0.004
  + gauss(s, 1560, 14, 5.0)          // sharp crest (radius ~ 40 m) : a jump
  + gauss(s, 2050, 20, -3.0);        // dip

const lat = [], lng = [], elevation = [], width = [];
pts.forEach((p, i) => {
  const jitter = (a) => a * rng.gaussian();
  const g = frame.toGeodetic({ x: p.x + jitter(0.25), y: elevationAt(cum[i]) - ORIGIN.elevation + jitter(0.3), z: p.z + jitter(0.25) });
  lat.push(Number(g.lat.toFixed(7)));
  lng.push(Number(g.lng.toFixed(7)));
  elevation.push(Number(g.h.toFixed(2)));
  width.push(cum[i] > 1500 && cum[i] < 1800 ? 5 : 6.5);
});

const stage = {
  schemaVersion: '1.0',
  id: 'demo-synthetic-01',
  name: 'Demo Stage (synthetic)',
  country: 'FI',
  datum: 'WGS84',
  seed: 20241015,
  track: { lat, lng, elevation, width },
  road: {
    defaultWidth: 6.5, crownSlope: 0.025, shoulderWidth: 1.5,
    defaultLayers: [{ type: 'gravel', depth: 0.045 }, { type: 'packed_dirt' }],
  },
  processing: { sampleSpacing: 1.0, horizontalSmoothing: 2.5, elevationSmoothing: 10, curvatureSmoothing: 5, verticalCurvatureSmoothing: 5, apexCurvatureSmoothing: 8, designSpeed: 26, bankFraction: 0.35, maxBankDeg: 7, bankNoiseDeg: 1.0 },
  surfaces: [
    { fromDistance: 0, toDistance: 1100, layers: [{ type: 'gravel', depth: 0.045 }, { type: 'packed_dirt' }] },
    { fromDistance: 1100, toDistance: 1450, layers: [{ type: 'mud', depth: 0.05 }, { type: 'packed_dirt' }] },
    { fromDistance: 1450, toDistance: 2300, layers: [{ type: 'packed_dirt' }] },
    { fromDistance: 2300, toDistance: Math.floor(total) + 50, layers: [{ type: 'tarmac' }] },
  ],
  pacenotes: { mode: 'auto', severityScale: 'six_easiest', leadTimeSeconds: 5, minLeadDistance: 60, speechRate: 3 },
  checkpoints: [
    { distance: Math.round(total / 3), name: 'Split 1' },
    { distance: Math.round((2 * total) / 3), name: 'Split 2' },
  ],
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(stage));
console.log(`wrote ${out}: ${pts.length} fixes, ${total.toFixed(0)} m`);
