import { validateSchema } from './schema_validator.js';
import { LocalFrame } from './geo.js';

export const STAGE_SCHEMA_VERSION = '1.0';

export class StageSchemaError extends Error {
  constructor(errors) {
    super(`Invalid stage definition:\n${errors.map((e) => `  ${e.path}: ${e.message}`).join('\n')}`);
    this.name = 'StageSchemaError';
    this.errors = errors;
  }
}

const DEFAULTS = {
  road: {
    defaultWidth: 6, crownSlope: 0.025, shoulderWidth: 1.5,
    shoulderLayers: [{ type: 'gravel', depth: 0.015 }, { type: 'packed_dirt' }],
    verge: { slope: -0.35, width: 6, layers: [{ type: 'grass' }] },
    defaultLayers: [{ type: 'gravel', depth: 0.04 }, { type: 'packed_dirt' }],
  },
  processing: {
    sampleSpacing: 1.0, horizontalSmoothing: 0, elevationSmoothing: 6, curvatureSmoothing: 5,
    verticalCurvatureSmoothing: 9, apexCurvatureSmoothing: 8,
    designSpeed: 25, bankFraction: 0.35, maxBankDeg: 8, bankNoiseDeg: 1.2, bankNoiseWavelength: 90,
  },
  pacenotes: { mode: 'auto', severityScale: 'six_easiest', leadTimeSeconds: 5, minLeadDistance: 60, speechRate: 3, notes: [] },
};

/**
 * Parse and validate a GPS stage description (object or JSON text) against `gps_stage_schema.json`.
 *
 * Besides the schema it enforces cross-field rules (parallel arrays of equal length, no
 * duplicate consecutive points, surface segments ordered and inside the stage, known surface
 * types when a SurfaceLibrary is supplied) and converts geodetic coordinates to the local
 * Cartesian frame.
 *
 * @param {object|string} input stage JSON
 * @param {object} schema parsed gps_stage_schema.json
 * @param {{surfaces?: import('../../core_physics/chassis/surface.js').SurfaceLibrary}} [opts]
 * @returns {object} normalised stage definition
 */
export function parseStage(input, schema, opts = {}) {
  if (!schema) throw new TypeError('parseStage needs the parsed gps_stage_schema.json');
  let doc = input;
  if (typeof input === 'string') {
    try { doc = JSON.parse(input); } catch (e) { throw new StageSchemaError([{ path: '$', message: `not valid JSON (${e.message})` }]); }
  }
  const errors = validateSchema(schema, doc);
  if (errors.length) throw new StageSchemaError(errors);

  const t = doc.track;
  const n = t.lat.length;
  const crossErrors = [];
  for (const key of ['lng', 'elevation', 'width', 'bank']) {
    if (t[key] && t[key].length !== n) crossErrors.push({ path: `$.track.${key}`, message: `length ${t[key].length} must equal lat length ${n}` });
  }
  if (crossErrors.length) throw new StageSchemaError(crossErrors);

  const origin = doc.origin ?? { lat: t.lat[0], lng: t.lng[0], elevation: t.elevation[0] };
  const frame = new LocalFrame(origin.lat, origin.lng, origin.elevation ?? t.elevation[0]);

  const road = { ...DEFAULTS.road, ...(doc.road ?? {}), verge: { ...DEFAULTS.road.verge, ...(doc.road?.verge ?? {}) } };
  const processing = { ...DEFAULTS.processing, ...(doc.processing ?? {}) };
  const pacenotes = { ...DEFAULTS.pacenotes, ...(doc.pacenotes ?? {}) };

  const points = [];
  for (let i = 0; i < n; i++) {
    const p = frame.toLocal(t.lat[i], t.lng[i], t.elevation[i]);
    const prev = points[points.length - 1];
    if (prev && Math.hypot(p.x - prev.x, p.z - prev.z, p.y - prev.y) < 0.05) continue;   // drop duplicate fixes
    points.push({
      x: p.x, y: p.y, z: p.z,
      width: t.width ? t.width[i] : road.defaultWidth,
      bank: t.bank ? t.bank[i] : null,
    });
  }
  if (points.length < 4) throw new StageSchemaError([{ path: '$.track', message: 'needs at least 4 distinct points' }]);

  const segErrors = [];
  const surfaceSegments = (doc.surfaces ?? []).slice().sort((a, b) => a.fromDistance - b.fromDistance);
  surfaceSegments.forEach((sg, i) => {
    if (!(sg.toDistance > sg.fromDistance)) segErrors.push({ path: `$.surfaces[${i}]`, message: 'toDistance must be greater than fromDistance' });
    if (i > 0 && sg.fromDistance < surfaceSegments[i - 1].toDistance - 1e-6) segErrors.push({ path: `$.surfaces[${i}]`, message: 'overlaps the previous segment' });
  });
  if (opts.surfaces) {
    const check = (layers, path) => layers.forEach((l, k) => {
      if (!opts.surfaces.has(l.type)) segErrors.push({ path: `${path}[${k}].type`, message: `unknown surface type "${l.type}"` });
    });
    surfaceSegments.forEach((sg, i) => check(sg.layers, `$.surfaces[${i}].layers`));
    check(road.defaultLayers, '$.road.defaultLayers');
    check(road.shoulderLayers, '$.road.shoulderLayers');
    check(road.verge.layers, '$.road.verge.layers');
  }
  for (const [path, layers] of [['$.road.defaultLayers', road.defaultLayers], ['$.road.shoulderLayers', road.shoulderLayers], ['$.road.verge.layers', road.verge.layers],
                                ...surfaceSegments.map((sg, i) => [`$.surfaces[${i}].layers`, sg.layers])]) {
    if (layers.slice(0, -1).some((l) => !(l.depth > 0))) segErrors.push({ path, message: 'every layer except the last (base) needs depth > 0' });
  }
  if (segErrors.length) throw new StageSchemaError(segErrors);

  return {
    id: doc.id, name: doc.name, country: doc.country ?? '', seed: doc.seed ?? 1,
    frame, origin, closed: !!t.closed, points, road, processing, pacenotes,
    surfaceSegments, checkpoints: (doc.checkpoints ?? []).slice().sort((a, b) => a.distance - b.distance),
  };
}
