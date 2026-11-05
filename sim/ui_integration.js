/**
 * Integration layer between the physics engine and the EA Rally UI (`/ui_and_integration`, `main.js`).
 *
 * The UI side owns: the event bus, the state store (tuning + stage data), the Three.js viewport, the HUD and the
 * `physicsBridge` singleton that runs the frame loop, reads the keyboard and broadcasts telemetry. This module does
 * not edit any of it. `installRallyEngine(bridge, ...)` swaps four methods on that existing singleton so the same loop,
 * input smoothing, hotkeys and listeners now drive the real simulation:
 *
 *     import { installRallyEngine } from './sim/ui_integration.js';
 *     installRallyEngine(physicsBridge, { eventBus, RALLY_EVENTS, stateStore, config });
 *
 * Everything here is pure ES (no DOM, no fs) so it runs in the browser and in Node tests.
 *
 * Coordinate systems
 *   engine : x = East, y = Up, z = South  (right-handed; +heading is clockwise compass bearing)
 *   UI     : x = East, y = Up, z = NORTH  (the stage compiler maps latitude to +z)  -> a mirror in z.
 * Positions are converted (z -> -z), quaternions mirror as (x, y, z, w) -> (-x, -y, z, w), and the car yaw handed to the
 * viewport is the compass bearing in degrees (forward = (sin yaw, cos yaw) in UI x/z), exactly what the viewport expects.
 */

import { Simulation } from './simulation.js';
import { Stage } from '../systems/stage/stage.js';
import { Rng } from '../core_physics/math/rng.js';
import { clamp } from '../core_physics/math/util.js';
import { G } from '../core_physics/math/constants.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
const PSI_PER_KPA = 0.14503774;
const KPA_PER_PSI = 6.894757;
const NUMBER_WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

// ----------------------------------------------------------------------------------------------------------------
// coordinates
// ----------------------------------------------------------------------------------------------------------------

/** Engine world position -> UI world position (mirror in z). */
export const toUiPosition = (p) => ({ x: p.x, y: p.y, z: -p.z });
/** UI world position -> engine world position. */
export const fromUiPosition = (p) => ({ x: p.x, y: p.y, z: -p.z });
/** Engine quaternion -> UI quaternion (mirror in z: rotation axes are pseudovectors). */
export const toUiQuaternion = (q) => ({ x: -q.x, y: -q.y, z: q.z, w: q.w });

// ----------------------------------------------------------------------------------------------------------------
// stages: UI stage object -> engine GPS stage (gps_stage_schema.json)
// ----------------------------------------------------------------------------------------------------------------

const SURFACE_LAYERS = {
  tarmac: { layers: [{ type: 'tarmac' }], crown: 0.02 },
  gravel: { layers: [{ type: 'gravel', depth: 0.045 }, { type: 'packed_dirt' }], crown: 0.025 },
  rocky: { layers: [{ type: 'gravel', depth: 0.015 }, { type: 'packed_dirt' }], crown: 0.03 },
  snow: { layers: [{ type: 'snow', depth: 0.08 }, { type: 'packed_dirt' }], crown: 0.02 },
};

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 2147483647;
}

/**
 * Convert a stage as produced by the UI's StageCompiler / `rally_stage_schema.json` (`waypoints` with lat/lon/elevation/width)
 * into a stage JSON that validates against `gps_stage_schema.json`.
 *
 * The physics uses the geodetic fields (lat, lon, elevation, width); the UI's own x/y/z, camber and distance fields are
 * derived data and are not trusted (in the shipped sample stages `distance` does not agree with the lat/lon geometry).
 * Fewer than four waypoints are densified by linear interpolation so the spline has something to fit.
 *
 * @param {object} ui UI stage
 * @param {object} [opts]
 * @param {'engine'|'ui'} [opts.pacenotes] 'engine' (default) lets the engine derive notes from the geometry; 'ui' carries
 *        the stage's authored notes over as explicit notes, with distances multiplied by `lengthScale`
 * @param {number} [opts.lengthScale] engine path length / UI `totalLengthMeters`
 * @returns {object} gps stage JSON
 */
export function uiStageToGpsStage(ui, opts = {}) {
  const wps = (ui.waypoints ?? []).filter((w) => Number.isFinite(w.lat) && Number.isFinite(w.lon));
  if (wps.length < 2) throw new RangeError(`stage "${ui.id}" needs at least 2 waypoints with lat/lon`);
  const startAlt = ui.startPoint?.alt ?? wps[0].elevation ?? 100;
  let pts = wps.map((w) => ({ lat: w.lat, lng: w.lon, ele: w.elevation ?? w.alt ?? startAlt, width: w.width ?? ui.baseRoadWidthMeters ?? 6 }));
  while (pts.length < 4) {                                    // densify: split the longest gap
    let bi = 0, bd = -1;
    for (let i = 0; i < pts.length - 1; i++) {
      const d = Math.hypot(pts[i + 1].lat - pts[i].lat, pts[i + 1].lng - pts[i].lng);
      if (d > bd) { bd = d; bi = i; }
    }
    const a = pts[bi], b = pts[bi + 1];
    pts.splice(bi + 1, 0, { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2, ele: (a.ele + b.ele) / 2, width: (a.width + b.width) / 2 });
  }
  const surf = SURFACE_LAYERS[ui.surface] ?? SURFACE_LAYERS.gravel;
  // sparse fixes (hundreds of metres apart) need no GPS-noise smoothing; dense recorded tracks do
  let spacing = 0;
  for (let i = 0; i < pts.length - 1; i++) spacing += Math.hypot((pts[i + 1].lat - pts[i].lat) * 111320, (pts[i + 1].lng - pts[i].lng) * 111320 * Math.cos((pts[i].lat * Math.PI) / 180));
  spacing /= pts.length - 1;
  const dense = spacing < 40;
  const clampWidth = (w) => clamp(w, 2.5, 30);
  return {
    schemaVersion: '1.0',
    id: String(ui.id ?? 'ui-stage'),
    name: String(ui.name ?? 'UI stage'),
    country: String(ui.region ?? ''),
    seed: hashSeed(String(ui.id ?? 'ui-stage')),
    track: {
      lat: pts.map((p) => p.lat),
      lng: pts.map((p) => p.lng),
      elevation: pts.map((p) => p.ele),
      width: pts.map((p) => clampWidth(p.width)),
    },
    road: {
      defaultWidth: clampWidth(ui.baseRoadWidthMeters ?? pts[0].width),
      crownSlope: surf.crown,
      shoulderWidth: clamp(ui.shoulderWidthMeters ?? 1.5, 0, 20),
      defaultLayers: clone(surf.layers),
    },
    processing: dense
      ? { horizontalSmoothing: 2.5, elevationSmoothing: 8, curvatureSmoothing: 5, verticalCurvatureSmoothing: 6, apexCurvatureSmoothing: 8 }
      : { horizontalSmoothing: 0, elevationSmoothing: 0, curvatureSmoothing: 8, verticalCurvatureSmoothing: 12, apexCurvatureSmoothing: 12 },
    pacenotes: opts.pacenotes === 'ui' && ui.pacenotes?.length
      ? { mode: 'explicit', severityScale: 'six_easiest', notes: ui.pacenotes.map((n) => uiNoteToExplicit(n, opts.lengthScale ?? 1)) }
      : { mode: 'auto', severityScale: 'six_easiest' },
  };
}

/** One authored UI pacenote -> an explicit note of gps_stage_schema.json. */
export function uiNoteToExplicit(n, scale = 1) {
  const dir = n.direction === 'left' || n.direction === 'right' ? n.direction : null;
  let type = 'custom';
  if (n.type === 'jump' || n.type === 'crest' || n.type === 'dip' || n.type === 'bump') type = n.type;
  else if (n.type === 'hazard') type = 'caution';
  else if (dir) type = dir;
  const out = { distance: Math.max(0, (n.distance ?? 0) * scale), type, modifiers: n.modifier && n.modifier !== 'none' ? [String(n.modifier)] : [], text: String(n.call ?? type) };
  if (Number.isInteger(n.severity) && n.severity >= 0) out.severity = n.severity;
  if (n.type === 'hazard') out.priority = 2;
  return out;
}

const MODIFIER_DETAIL = {
  long: 'Long corner', tightens: 'Tightens on exit', opens: 'Opens on exit', caution: 'Caution', into: 'Link to next', off_camber: 'Off camber',
  over_crest: 'Crest on entry', dont_cut: "Don't cut",
};

/** Engine pacenote -> the shape the UI's co-driver expects: {distance, call, type, severity, direction, modifier, detail}. */
export function toUiPacenote(note) {
  const words = note.tokens.map((t) => (t in NUMBER_WORDS ? String(NUMBER_WORDS[t]) : t));
  const call = words.join(' ').replace(/^./, (c) => c.toUpperCase());
  const isTurn = note.type === 'corner' || note.type === 'hairpin' || note.type === 'square';
  const mod = note.modifiers?.[0] ?? (isTurn ? 'none' : note.type);
  return {
    id: note.id,
    distance: Math.round(note.s),
    call,
    type: isTurn ? 'turn' : note.type,
    severity: isTurn ? note.severity : 6,
    direction: note.direction || 'straight',
    modifier: mod,
    detail: note.modifiers?.length ? note.modifiers.map((m) => MODIFIER_DETAIL[m] ?? m).join(', ') : (note.type === 'hairpin' ? 'Hairpin' : ''),
    apexDistance: Math.round(note.sApex ?? note.s),
  };
}

// ----------------------------------------------------------------------------------------------------------------
// tuning: UI `currentTuning` -> engine config
// ----------------------------------------------------------------------------------------------------------------

const BASELINE_RIDE_HEIGHT_MM = { front: 140, rear: 150 };
const COMPOUND_MAP = [
  [/snow|ice|stud/i, 'rally_snow_studded_15'],
  [/gravel|dirt|rock|loose|acropolis|mud/i, 'rally_gravel_15'],
  [/tarmac|asphalt|slick|road|wet/i, 'rally_tarmac_18'],
];

/** Equivalent clutch-pack ramp gain for a "lock %" figure: 100 % = able to hand over the entire input torque (K = 0.5 at 45 deg). */
const lockToGain = (pct) => 0.5 * clamp(pct, 0, 100) / 100;

/**
 * Map the UI's `currentTuning` (springs in N/mm, locks in %, pressure in psi, boost in bar absolute, ...) to an engine config.
 * Returns a new config bundle (the input is not modified), tyre setup overrides and a report of what was applied / ignored.
 * Out-of-range values are clamped to physically sane limits and listed in `report.warnings`.
 *
 * Unit assumptions (documented because the UI schema does not state them): spring rate is the coil spring in N/mm
 * (wheel rate = rate x motionRatio^2); damping is at the damper in N s/m; anti-roll rates are at the wheel in N/mm;
 * ride height is measured in mm against a 140/150 mm (front/rear) baseline; peakBoostBar is absolute pressure.
 */
export function tuningToConfig(tuning, baseConfig) {
  const cfg = clone(baseConfig);
  const setup = {};
  const report = { applied: [], ignored: [], warnings: [], info: [] };
  const num = (path, v, lo, hi) => {
    if (!Number.isFinite(v)) { report.warnings.push(`${path}: not a number (${v}), ignored`); return undefined; }
    if (v < lo || v > hi) { report.warnings.push(`${path}: ${v} outside [${lo}, ${hi}], clamped`); v = clamp(v, lo, hi); }
    report.applied.push(path);
    return v;
  };
  const seen = new Set();
  const take = (section, key) => { seen.add(`${section}.${key}`); return tuning?.[section]?.[key]; };

  // --- suspension ----------------------------------------------------------------------------------------
  for (const axis of ['front', 'rear']) {
    const sus = cfg.chassis.suspension[axis];
    const A = axis;
    let v = take('suspension', `${A}SpringRate`);
    if (v !== undefined) { v = num(`suspension.${A}SpringRate`, v, 15, 250); if (v !== undefined) sus.springRate = v * 1000; }
    const kw = sus.springRate * sus.motionRatio ** 2;
    v = take('suspension', `${A}RideHeight`);
    if (v !== undefined) {
      v = num(`suspension.${A}RideHeight`, v, 80, 260);
      if (v !== undefined) sus.preload = (kw * (v - BASELINE_RIDE_HEIGHT_MM[axis])) / 1000;     // spring-seat height <-> preload force
    }
    const bump = take('suspension', `${A}BumpDamping`), reb = take('suspension', `${A}ReboundDamping`), fast = take('suspension', `${A}FastBumpDamping`);
    if (bump !== undefined) { const b = num(`suspension.${A}BumpDamping`, bump, 500, 15000); if (b !== undefined) sus.damper.bumpSlow = b; }
    if (reb !== undefined) { const r = num(`suspension.${A}ReboundDamping`, reb, 500, 20000); if (r !== undefined) sus.damper.reboundSlow = r; }
    if (fast !== undefined) { const f = num(`suspension.${A}FastBumpDamping`, fast, 200, 12000); if (f !== undefined) sus.damper.bumpFast = f; }
    if (bump !== undefined || reb !== undefined || fast !== undefined) {
      // keep the engine's high-speed rebound at the same fraction of low-speed rebound as the high-speed bump is of low-speed bump
      sus.damper.reboundFast = sus.damper.reboundSlow * (sus.damper.bumpFast / Math.max(sus.damper.bumpSlow, 1));
    }
    v = take('suspension', `${A}AntiRollBar`);
    if (v !== undefined) { v = num(`suspension.${A}AntiRollBar`, v, 0, 400); if (v !== undefined) sus.antiRollBar.stiffness = v * 1000 * sus.antiRollBar.armLength ** 2; }
    v = take('suspension', `${A}CamberDeg`);
    if (v !== undefined) { v = num(`suspension.${A}CamberDeg`, v, -6, 3); if (v !== undefined) sus.staticCamberDeg = v; }
    v = take('suspension', `${A}ToeDeg`);
    if (v !== undefined) { v = num(`suspension.${A}ToeDeg`, v, -1.5, 1.5); if (v !== undefined) sus.staticToeDeg = v; }
  }

  // --- differentials -----------------------------------------------------------------------------------------
  const d = tuning?.differential ?? {};
  const diffType = String(take('differential', 'type') ?? 'lsd').toLowerCase();
  const engineType = /open/.test(diffType) ? 'open' : /spool|locked|solid/.test(diffType) ? 'locked' : /visc/.test(diffType) ? 'viscous' : 'lsd';
  for (const key of ['centerDiff', 'frontDiff', 'rearDiff']) {
    cfg.drivetrain[key].type = key === 'centerDiff' && cfg.drivetrain.layout !== 'AWD' ? cfg.drivetrain[key].type : engineType;
  }
  const packGain = (pack) => pack?.rampGain ?? (pack?.mu && pack?.surfaces && pack?.meanRadius && pack?.rampRadius ? (pack.mu * pack.surfaces * pack.meanRadius) / (2 * pack.rampRadius) : 0.35);
  const setLock = (diff, accel, decel, preload, base) => {
    const dd = cfg.drivetrain[diff];
    // power side: ramp 45 deg (capacity = K * |T_in|), K from the requested lock %
    let kAccel = packGain(dd.pack);
    if (accel !== undefined) {
      const a = num(`differential.${base}Accel`, accel, 0, 100);
      if (a !== undefined) { kAccel = lockToGain(a); dd.powerRampDeg = 45; }
    }
    dd.pack = { ...(dd.pack ?? {}), rampGain: kAccel };
    // coast side: pick the ramp angle that gives the requested coast lock with the same pack: tan(theta) = K / lockGain
    if (decel !== undefined) {
      const c = num(`differential.${base}Decel`, decel, 0, 100);
      if (c !== undefined) {
        const cg = lockToGain(c);
        dd.coastRampDeg = cg > 1e-6 ? clamp((Math.atan(kAccel / cg) * 180) / Math.PI, 20, 89) : 89;
      }
    }
    if (preload !== undefined) { const p = num(`differential.${base}Preload`, preload, 0, 600); if (p !== undefined) dd.preload = p; }
  };
  setLock('frontDiff', take('differential', 'frontAccelLock'), take('differential', 'frontDecelLock'), take('differential', 'frontPreloadNm'), 'front');
  setLock('rearDiff', take('differential', 'rearAccelLock'), take('differential', 'rearDecelLock'), take('differential', 'rearPreloadNm'), 'rear');
  const sf = take('differential', 'centerTorqueSplitFront'), sr = take('differential', 'centerTorqueSplitRear');
  if (sf !== undefined) {
    const front = clamp(sr !== undefined ? sf / Math.max(sf + sr, 1e-9) : sf / 100, 0.1, 0.9);
    cfg.drivetrain.centerDiff.baseSplit = front;
    report.applied.push('differential.centerTorqueSplitFront');
  }
  const cl = take('differential', 'centerLockRatio');
  if (cl !== undefined) {
    const c = num('differential.centerLockRatio', cl, 0, 100);
    if (c !== undefined) { cfg.drivetrain.centerDiff.pack = { ...(cfg.drivetrain.centerDiff.pack ?? {}), rampGain: lockToGain(c) }; cfg.drivetrain.centerDiff.powerRampDeg = 45; cfg.drivetrain.centerDiff.coastRampDeg = 60; }
  }
  void d;

  // --- transmission --------------------------------------------------------------------------------------------
  const tType = String(take('transmission', 'type') ?? 'sequential').toLowerCase();
  cfg.drivetrain.transmission.type = /h_?pattern|manual/.test(tType) ? 'hpattern' : 'sequential';
  const ratios = take('transmission', 'gearRatios');
  if (Array.isArray(ratios) && ratios.length >= 1 && ratios.every((r) => Number.isFinite(r) && r > 0.3 && r < 8)) {
    cfg.drivetrain.transmission.gearRatios = ratios.slice();
    report.applied.push('transmission.gearRatios');
  } else if (ratios !== undefined) report.warnings.push('transmission.gearRatios: need an array of ratios in (0.3, 8); ignored');
  const rev = take('transmission', 'reverseRatio');
  if (rev !== undefined) { const r = num('transmission.reverseRatio', rev, 1, 8); if (r !== undefined) cfg.drivetrain.transmission.reverseRatio = r; }
  const fd = take('transmission', 'finalDriveRatio');
  if (fd !== undefined) { const f = num('transmission.finalDriveRatio', fd, 2, 8); if (f !== undefined) cfg.drivetrain.finalDrive = { front: f, rear: f }; }
  const st = take('transmission', 'shiftTimeMs');
  if (st !== undefined) { const s = num('transmission.shiftTimeMs', st, 15, 600); if (s !== undefined) { cfg.drivetrain.transmission.sequential.shiftTime = s / 1000; cfg.drivetrain.transmission.hPattern.shiftTime = Math.max(s / 1000, 0.12); } }
  const cf = take('transmission', 'clutchFrictionTorque');
  if (cf !== undefined) { const c = num('transmission.clutchFrictionTorque', cf, 150, 3000); if (c !== undefined) cfg.drivetrain.clutch.maxTorque = c; }

  // --- engine ----------------------------------------------------------------------------------------------------
  const e = cfg.engine.engine;
  const baseTorquePeak = Math.max(...e.torqueCurve.map((p) => p[1]));
  const baseLimiter = cfg.engine.ecu.revLimiter.rpm;
  const maxRpm = take('engine', 'maxRpm'), idle = take('engine', 'idleRpm'), peakT = take('engine', 'peakTorqueNm'), boostBar = take('engine', 'peakBoostBar');
  const als = take('engine', 'antiLagSystem');
  for (const k of ['displacementLiters', 'cylinders', 'aspiration', 'peakPowerBhp', 'revLimiter', 'redlineRpm']) take('engine', k);
  let rpmScale = 1;
  const mr = maxRpm !== undefined ? num('engine.maxRpm', maxRpm, 5000, 12000) : undefined;
  if (mr !== undefined) rpmScale = mr / baseLimiter;
  // boost target: scale the ECU map only; the dyno reference stays, so more boost genuinely means more charge density
  const baseGauge = Math.max(...baseConfig.engine.ecu.boostTargetMap.z.flat());
  let densityFactor = 1;
  if (boostBar !== undefined) {
    const bb = num('engine.peakBoostBar', boostBar, 1.0, 4.0);
    if (bb !== undefined) {
      const gauge = Math.max(0, (bb - 1.01325) * 100);
      const k = gauge / baseGauge;
      cfg.engine.ecu.boostTargetMap.z = cfg.engine.ecu.boostTargetMap.z.map((row) => row.map((v) => v * k));
      cfg.engine.ecu.boostControl.overboostKPa = Math.max(cfg.engine.ecu.boostControl.overboostKPa, gauge * 1.4);
      cfg.engine.turbo.wastegate.maxControlPressure = Math.max(cfg.engine.turbo.wastegate.maxControlPressure, gauge * 1300);
      densityFactor = (101.325 + gauge) / (101.325 + baseGauge);
    }
  }
  // peak torque is "what the dyno shows at the chosen boost": divide out the density change so the figure is honoured
  let torqueScale = 1;
  const pt = peakT !== undefined ? num('engine.peakTorqueNm', peakT, 150, 1200) : undefined;
  if (pt !== undefined) torqueScale = pt / (baseTorquePeak * densityFactor);
  const scaleX = (pairs, fx = rpmScale, fy = 1) => pairs.map(([x, y]) => [x * fx, y * fy]);
  if (rpmScale !== 1 || torqueScale !== 1) {
    e.torqueCurve = scaleX(e.torqueCurve, rpmScale, torqueScale);
    e.dynoBoostKPa = scaleX(e.dynoBoostKPa, rpmScale);
    e.volumetricEfficiency = scaleX(e.volumetricEfficiency, rpmScale);
    const ecu = cfg.engine.ecu;
    ecu.throttleMap.x = ecu.throttleMap.x.map((x) => x * rpmScale);
    ecu.boostTargetMap.x = ecu.boostTargetMap.x.map((x) => x * rpmScale);
    ecu.revLimiter.rpm = baseLimiter * rpmScale;
    ecu.launch.rpm *= rpmScale; ecu.als.minRpm *= rpmScale;
    // engine friction scales with speed: keep the same torque loss at the same fraction of the rev range
    e.friction.f1 /= rpmScale; e.friction.f2 /= rpmScale * rpmScale;
    // a wider rev range moves proportionally more air: size the turbo for it so it spools at the same fractions of the range
    cfg.engine.turbo.turbine.flowCoefficient *= rpmScale;
    cfg.engine.turbo.compressor.chokeFlow *= rpmScale;
  }
  if (idle !== undefined) {
    const i = num('engine.idleRpm', idle, 600, 2500);
    if (i !== undefined) { e.idleRpm = i; e.stallRpm = Math.min(e.stallRpm, i * 0.45); }
  }
  if (als !== undefined) {
    seen.add('engine.antiLagSystem');
    const mode = String(als).toLowerCase();
    const a = cfg.engine.ecu.als;
    if (mode === 'off' || mode === 'none') a.enabled = false;
    else if (mode === 'mild') { a.retardDeg = 35; a.boostTargetKPa = 80; }
    else if (mode === 'aggressive') { a.retardDeg = 50; a.boostTargetKPa = 130; a.throttle = 0.12; }
    report.applied.push('engine.antiLagSystem');
  }
  if (baseTorquePeak) {
    const peakPower = Math.max(...e.torqueCurve.map(([r, t]) => t * ((r * Math.PI) / 30))) * 1.341e-3;
    const claimed = tuning?.engine?.peakPowerBhp;
    if (Number.isFinite(claimed) && Math.abs(peakPower - claimed) / claimed > 0.2) {
      report.info.push(`engine: the scaled curve gives ~${peakPower.toFixed(0)} bhp but peakPowerBhp is ${claimed}; peak torque and rpm limits are authoritative`);
    }
  }

  // --- tyres & brakes ---------------------------------------------------------------------------------------------
  const compound = take('tires_and_brakes', 'tireCompound');
  if (compound !== undefined) {
    const hit = COMPOUND_MAP.find(([re]) => re.test(String(compound)));
    if (hit) { setup.compoundFront = hit[1]; setup.compoundRear = hit[1]; report.applied.push('tires_and_brakes.tireCompound'); }
    else report.warnings.push(`tires_and_brakes.tireCompound "${compound}" has no engine compound; keeping the configured one`);
  }
  const pf = take('tires_and_brakes', 'frontTirePressurePsi'), pr = take('tires_and_brakes', 'rearTirePressurePsi');
  if (pf !== undefined) { const p = num('tires_and_brakes.frontTirePressurePsi', pf, 10, 45); if (p !== undefined) setup.pressureFrontKPa = p * KPA_PER_PSI; }
  if (pr !== undefined) { const p = num('tires_and_brakes.rearTirePressurePsi', pr, 10, 45); if (p !== undefined) setup.pressureRearKPa = p * KPA_PER_PSI; }
  const bias = take('tires_and_brakes', 'brakeBiasFrontPercent'), mbt = take('tires_and_brakes', 'maxBrakeTorqueNm'), hbt = take('tires_and_brakes', 'handbrakeTorqueNm');
  const br = cfg.chassis.brakes;
  let b = bias !== undefined ? num('tires_and_brakes.brakeBiasFrontPercent', bias, 40, 80) : undefined;
  if (b !== undefined) br.frontBias = b / 100;
  if (mbt !== undefined) {
    const m = num('tires_and_brakes.maxBrakeTorqueNm', mbt, 1000, 12000);
    if (m !== undefined) { br.maxTorqueFront = m; br.maxTorqueRear = (m * (1 - br.frontBias)) / br.frontBias; }
  }
  if (hbt !== undefined) { const h = num('tires_and_brakes.handbrakeTorqueNm', hbt, 0, 12000); if (h !== undefined) br.handbrakeTorqueRear = h; }

  // --- everything else -------------------------------------------------------------------------------------------------
  for (const [section, vals] of Object.entries(tuning ?? {})) {
    if (!vals || typeof vals !== 'object') continue;
    for (const key of Object.keys(vals)) if (!seen.has(`${section}.${key}`) && section !== 'visual_parts') report.ignored.push(`${section}.${key}`);
    if (section === 'visual_parts') report.ignored.push('visual_parts.*');
  }
  return { config: cfg, setup, report };
}

// ----------------------------------------------------------------------------------------------------------------
// telemetry: engine -> the UI's telemetry_schema.json payload
// ----------------------------------------------------------------------------------------------------------------

const WHEEL_KEYS = ['fl', 'fr', 'rl', 'rr'];
const round = (v, d = 2) => { const f = 10 ** d; return Math.round(v * f) / f; };

function diffLockPct(diff, typeIsLocked) {
  if (typeIsLocked) return 100;
  const cap = diff.capacity;
  if (cap === Infinity || cap < 0) return 100;
  if (!(cap > 1e-6)) return 0;
  return clamp((100 * Math.abs(diff.couplingTorque)) / cap, 0, 100);
}

/**
 * Build the telemetry payload the UI broadcasts (`config/telemetry_schema.json`) from a running Simulation, plus extra
 * fields the engine can offer (position/rotation/wheel transforms in UI coordinates, damage, surface).
 *
 * @param {import('./simulation.js').Simulation} sim
 * @param {object} ctx { timestamp, inputs (UI inputs), uiTravelMm, peakBoostBar, uiNotes (engine note -> ui note cache) }
 */
export function toUiTelemetry(sim, ctx = {}) {
  const v = sim.vehicle, ch = v.chassis, dr = v.drivetrain, eng = dr.engine, tr = dr.transmission;
  const tel = ctx.telemetry ?? sim.getTelemetry();
  const uiTravel = ctx.uiTravelMm ?? 280;
  const att = ch.attitude;
  const wheelsT = tel.wheels;
  const inputs = ctx.inputs ?? sim.inputs;
  const sf = ch.specificForce;
  const boostBar = tel.engine.boost.gaugeKPa / 100;

  const suspension = {}, tires = {};
  WHEEL_KEYS.forEach((k, i) => {
    const w = ch.wheels[i], t = wheelsT[i];
    const frac = clamp(w.z / w.susp.travel, 0, 1);
    const scale = uiTravel / (w.susp.travel * 1000);
    suspension[k] = {
      // travelMm is anchored so the static ride height reads uiTravel/2 (the viewport offsets wheels by travelMm - 140);
      // compressionPct is the true fraction of the physical travel in use
      travelMm: round(clamp(uiTravel / 2 - (w.z - w.z0) * 1000 * scale, 0, uiTravel), 1),
      maxTravelMm: uiTravel,
      compressionPct: round(frac * 100, 1),
      damperVelocityMs: round(-w.zdot * scale, 3),
      bottomedOut: w.z > w.susp.travel - 0.004,
      // engine-native values for tools that want physical units
      physical: { compressionMm: round(w.z * 1000, 1), travelMm: round(w.susp.travel * 1000, 1), springForce: round(w.suspOut.spring, 0), damperForce: round(w.suspOut.damper, 0), loadN: round(w.fn, 0) },
    };
    tires[k] = {
      coreTempC: round(t.tire.coreTempC, 1),
      surfaceTempC: round(t.tire.surfaceTempC, 1),
      pressurePsi: round(t.tire.pressureKPa * PSI_PER_KPA, 2),
      slipAngleDeg: round(t.slipAngleDeg, 2),
      slipRatio: round(t.slipRatio, 3),
      gripUtilPct: Math.round(clamp(t.tire.saturation * 100, 0, 100)),
      surfaceContact: t.contact,
      wear: round(t.tire.wear, 4),
      surface: t.surface.type,
    };
  });

  let activePacenote = null, totalDistance = 0, distance = 0, progress = 0, elapsed = 0;
  if (sim.stage) {
    totalDistance = sim.stage.length; distance = sim.runtime.s; progress = sim.runtime.progress * 100; elapsed = sim.runtime.elapsed;
    const next = sim.pacenotePlayer.notes.find((n) => n.sEnd >= distance - 5);
    if (next) {
      const ui = ctx.uiNotes?.get(next.id) ?? toUiPacenote(next);
      activePacenote = { call: ui.call, distanceToApexM: Math.max(0, Math.round((next.sApex ?? next.s) - distance)), severity: ui.severity, direction: ui.direction, modifier: ui.modifier, detail: ui.detail };
    }
  }

  const gearNum = tr.gear;
  const position = toUiPosition(ch.position);
  return {
    timestamp: ctx.timestamp ?? 0,
    tick: sim.tick,
    vehicle: {
      speedKph: round(ch.speed * 3.6, 1),
      speedMph: round(ch.speed * 2.236936, 1),
      engineRpm: Math.round(eng.rpm),
      gear: gearNum,
      throttle: round(inputs.throttle ?? 0, 2),
      brake: round(inputs.brake ?? 0, 2),
      clutch: round(dr.telemetry.clutchPedal ?? 0, 2),
      handbrake: round(inputs.handbrake ?? 0, 2),
      steeringAngleDeg: round((-ch.steerAngle * 180) / Math.PI, 1),         // UI convention: + = right
      turboBoostBar: round(boostBar, 2),
      peakBoostBar: round(ctx.peakBoostBar ?? boostBar, 2),
      antiLagActive: !!tel.engine.antiLag,
      limiterActive: !!tel.engine.limiter,
    },
    gForces: {
      lateralG: round(sf.z / G, 2),                                          // + = right
      longitudinalG: round(sf.x / G, 2),
      verticalG: round(sf.y / G, 2),
      yawRateDegS: round((-ch.angularVelocity.y * 180) / Math.PI, 1),         // + = turning right (clockwise)
    },
    suspension,
    tires,
    drivetrain: {
      frontDiffLockPct: round(diffLockPct(dr.frontDiff, dr.frontDiff.type === 'locked'), 1),
      centerDiffLockPct: round(dr.layout === 'AWD' ? diffLockPct(dr.centerDiff, dr.centerDiff.type === 'locked') : 0, 1),
      rearDiffLockPct: round(diffLockPct(dr.rearDiff, dr.rearDiff.type === 'locked'), 1),
      wheelSpinRps: Object.fromEntries(WHEEL_KEYS.map((k, i) => [k, round(ch.wheels[i].omega / (2 * Math.PI), 2)])),
    },
    stageProgress: {
      currentDistanceM: Math.round(distance),
      totalDistanceM: Math.round(totalDistance),
      progressPercent: Math.min(100, Math.round(progress)),
      elapsedTimeSec: round(elapsed, 1),
      deltaSec: 0,
      ...(activePacenote ? { activePacenote } : {}),         // omitted (not null) when there is none: telemetry_schema.json types it as an object
    },
    // --- extras (not in telemetry_schema.json; ignored by consumers that do not know them) -----------------------------
    position,
    rotation: { yawDeg: round((att.heading * 180) / Math.PI, 3), pitchDeg: round((att.pitch * 180) / Math.PI, 2), rollDeg: round((att.roll * 180) / Math.PI, 2) },
    quaternion: toUiQuaternion(ch.quaternion),
    wheelTransforms: sim.getRenderState().wheels.map((w) => ({ position: toUiPosition(w.position), quaternion: toUiQuaternion(w.quaternion), spinAngle: w.spinAngle })),
    damage: tel.damage,
    stateHash: ctx.stateHash,
  };
}

// ----------------------------------------------------------------------------------------------------------------
// the link: drives a UI physics bridge with the engine
// ----------------------------------------------------------------------------------------------------------------

/**
 * Connects a Simulation to the UI. Created by `installRallyEngine`; usable directly with any object that exposes the
 * PhysicsBridge fields the UI reads (`inputs`, `position`, `rotation`, ...).
 */
export class RallyEngineLink {
  /**
   * @param {object} deps
   * @param {object} deps.bridge       the UI's PhysicsBridge instance
   * @param {object} deps.eventBus     UI event bus ({on, emit})
   * @param {object} deps.RALLY_EVENTS UI event names
   * @param {object} deps.stateStore   UI state store ({currentTuning, activeStage, ...})
   * @param {object} deps.config       engine config bundle (the parsed /config/*.json files, incl. gpsStageSchema)
   * @param {object} [deps.options]    { uiTravelMm, autoShiftUpMargin, autoShiftDownRpm, seed,
   *                                   pacenoteSource: 'auto' (UI's authored notes when the stage has them, else engine) | 'ui' | 'engine' }
   */
  constructor({ bridge, eventBus, RALLY_EVENTS, stateStore, config, options = {} }) {
    this.bridge = bridge;
    this.bus = eventBus;
    this.EV = RALLY_EVENTS;
    this.store = stateStore;
    this.baseConfig = config;
    this.opt = { uiTravelMm: 280, autoShiftUpMargin: 200, autoShiftDownRpm: 2800, seed: 1, pacenoteSource: 'auto', ...options };
    this.rng = new Rng(this.opt.seed);               // audio-only randomness (backfire pops); never feeds the physics
    this.sim = null;
    this.stage = null;
    this.uiNotes = new Map();
    this.report = null;
    this.peakBoostBar = 0;
    this.prev = { bov: false, bottomed: [false, false, false, false] };
    this.lastTelemetry = null;
    this.errors = [];
    this._offs = [];
    this._pendingRebuild = false;
    this._stageRef = null;
    this.rebuild({ keepPose: false });
    // tuning sliders can fire many events per second: coalesce them into one rebuild at the next frame
    this._offs.push(this.bus.on(this.EV.TUNING_UPDATED, (p) => { if (p?.section !== 'visual_parts') this._pendingRebuild = true; }));
    // the UI bridge already calls resetVehicle() on stage events; only rebuild here if that did not happen
    const onStage = () => { if (this._stageRef !== this.store.activeStage) this.rebuild({ keepPose: false }); };
    this._offs.push(this.bus.on(this.EV.STAGE_SELECTED, onStage));
    this._offs.push(this.bus.on(this.EV.STAGE_COMPILED, onStage));
  }

  get redlineRpm() { return this.store.currentTuning?.engine?.redlineRpm ?? this.sim.config.engine.ecu.revLimiter.rpm * 0.93; }

  /** (Re)build the simulation from the current UI tuning and stage. Returns the mapping report. */
  rebuild({ keepPose = false } = {}) {
    let pose = null;
    if (keepPose && this.sim?.stage) {
      const ch = this.sim.vehicle.chassis;
      pose = { s: this.sim.runtime.s, lateral: this.sim.runtime.c, speed: ch.forwardSpeed, gear: this.sim.vehicle.drivetrain.transmission.gear };
    }
    this._pendingRebuild = false;
    this._stageRef = this.store.activeStage;
    const mapped = tuningToConfig(this.store.currentTuning ?? {}, this.baseConfig);
    this.report = mapped.report;
    let stage = null;
    let uiOriginals = null;
    const ui = this.store.activeStage;
    if (ui?.waypoints?.length >= 2) {
      try {
        let json = uiStageToGpsStage(ui, { pacenotes: 'engine' });
        stage = Stage.fromJson(json, this.baseConfig.gpsStageSchema);
        const authored = ui.pacenotes?.length > 0;
        if (this.opt.pacenoteSource === 'ui' || (this.opt.pacenoteSource !== 'engine' && authored)) {
          if (authored) {
            // the UI's distances are in its own metres (its sample stages are not consistent with their own lat/lon): rescale to the engine path
            const lengthScale = stage.length / Math.max(1, ui.totalLengthMeters ?? stage.length);
            json = uiStageToGpsStage(ui, { pacenotes: 'ui', lengthScale });
            stage = Stage.fromJson(json, this.baseConfig.gpsStageSchema);
            uiOriginals = ui.pacenotes.slice().sort((a, b) => a.distance - b.distance);
          }
        }
      } catch (err) {
        stage = null;
        this.errors.push(`stage "${ui?.id}": ${err.message}`);
        this.bus.emit?.(this.EV.NOTIFICATION, { title: 'Stage error', message: `Could not build physics stage: ${err.message}` });
      }
    }
    this.stage = stage;
    this.sim = new Simulation(mapped.config, { stage: stage ?? undefined, setup: mapped.setup });
    this.sim.setInputs({ alsSwitch: mapped.config.engine.ecu.als.enabled });
    this.uiNotes.clear();
    if (stage) {
      stage.pacenotes.forEach((n, i) => {
        const authored = uiOriginals?.[i];
        this.uiNotes.set(n.id, authored ? { ...authored, id: n.id, engineDistance: Math.round(n.s) } : toUiPacenote(n));
      });
    }
    this.peakBoostBar = 0;
    this.prev = { bov: false, bottomed: [false, false, false, false] };
    this.sim.vehicle.drivetrain.transmission.reset(1);
    if (pose && stage) {
      this.sim.placeOnStage({ s: Math.min(pose.s, stage.length - 5), lateral: pose.lateral, speed: Math.max(0, pose.speed) });
      this.sim.vehicle.drivetrain.transmission.reset(Math.max(1, pose.gear));
      this.sim.vehicle.drivetrain.engine.omega = Math.max(this.sim.vehicle.drivetrain.engine.idleOmega, (Math.max(0, pose.speed) / 0.318) * mapped.config.drivetrain.finalDrive.front * (mapped.config.drivetrain.transmission.gearRatios[Math.max(1, pose.gear) - 1] ?? 1));
    }
    this._syncBridge();
    if (this.report.warnings.length) {
      this.bus.emit?.(this.EV.NOTIFICATION, { title: 'Tuning notes', message: this.report.warnings.slice(0, 3).join(' | ') });
    }
    return this.report;
  }

  reset() {
    this.rebuild({ keepPose: false });
    this.bridge.stageDistanceM = 0; this.bridge.stageTimeSec = 0; this.bridge.lastPacenoteIndex = -1;
  }

  shift(dir) {
    const dr = this.sim.vehicle.drivetrain;
    if (dir > 0) dr.shiftUp(); else dr.shiftDown();
  }

  /** Advance one UI frame. */
  step(dt) {
    if (this._pendingRebuild) this.rebuild({ keepPose: true });
    const b = this.bridge, sim = this.sim, dr = sim.vehicle.drivetrain, tr = dr.transmission;
    const inp = b.inputs;
    // gearbox: automatic mode mirrors the UI's behaviour (shift near the redline / below 2800 rpm)
    if (inp.isAutomatic && !tr.shifting) {
      const rpm = dr.engine.rpm;
      if (tr.gear === 0) dr.selectGear(1);
      else if (rpm > this.redlineRpm - this.opt.autoShiftUpMargin && tr.gear < tr.gearCount && inp.throttle > 0.3) dr.shiftUp();
      else if (rpm < this.opt.autoShiftDownRpm && tr.gear > 1 && sim.vehicle.chassis.speed > 3) dr.shiftDown();
    }
    sim.setInputs({
      throttle: inp.throttle, brake: inp.brake, steer: inp.steer, handbrake: inp.handbrake,
      clutch: inp.clutch > 0.02 ? inp.clutch : null,
      launchSwitch: sim.vehicle.chassis.speed < 2 && inp.clutch > 0.5 && inp.throttle > 0.8,
    });
    sim.update(dt);
    this._syncBridge();
    this._emitEvents();
  }

  /** Publish the per-frame telemetry to the UI event bus. */
  broadcast(timestamp) {
    const sim = this.sim;
    this.peakBoostBar = Math.max(this.peakBoostBar, sim.vehicle.drivetrain.engine.turbo.boostGaugePa / 100000);
    const payload = toUiTelemetry(sim, { timestamp, inputs: this.bridge.inputs, uiTravelMm: this.opt.uiTravelMm, peakBoostBar: this.peakBoostBar, uiNotes: this.uiNotes, stateHash: sim.stateHash({ surface: false }) });
    this.lastTelemetry = payload;
    this.bus.emit(this.EV.TELEMETRY_UPDATE, payload);
    this.bus.emit?.(this.EV.PHYSICS_TICK, { tick: sim.tick, time: sim.time });
    return payload;
  }

  /** Keep the bridge's public fields (read directly by the viewport) in sync with the engine state. */
  _syncBridge() {
    const b = this.bridge, sim = this.sim, ch = sim.vehicle.chassis, dr = sim.vehicle.drivetrain;
    const att = ch.attitude;
    b.position = toUiPosition(ch.position);
    b.velocity = { x: ch.velocity.x, y: ch.velocity.y, z: -ch.velocity.z };
    b.rotation = { yaw: (att.heading * 180) / Math.PI, pitch: (att.pitch * 180) / Math.PI, roll: (att.roll * 180) / Math.PI };
    b.angularVelocity = { yaw: (-ch.angularVelocity.y * 180) / Math.PI, pitch: 0, roll: 0 };
    b.speedMs = ch.speed; b.speedKph = ch.speed * 3.6;
    b.engineRpm = dr.engine.rpm;
    b.gear = dr.transmission.gear;
    b.turboBoostBar = dr.engine.turbo.boostGaugePa / 100000;
    b.peakBoostBar = this.peakBoostBar;
    b.steeringAngleDeg = (-ch.steerAngle * 180) / Math.PI;
    b.stageDistanceM = sim.runtime ? sim.runtime.s : sim.odometer;
    b.stageTimeSec = sim.runtime ? sim.runtime.elapsed : sim.time;
    b.isAirborne = ch.wheels.every((w) => !w.contact);
    if (b.wheels) {
      WHEEL_KEYS.forEach((k, i) => {
        const w = ch.wheels[i], t = b.wheels[k];
        if (!t) return;
        const frac = clamp(w.z / w.susp.travel, 0, 1);
        t.suspensionTravelMm = clamp(this.opt.uiTravelMm / 2 - (w.z - w.z0) * 1000 * (this.opt.uiTravelMm / (w.susp.travel * 1000)), 0, this.opt.uiTravelMm);
        t.compressionPct = frac * 100;
        t.bottomedOut = w.z > w.susp.travel - 0.004;
        t.slipAngleDeg = (w.slipAngle * 180) / Math.PI;
        t.slipRatio = w.slipRatio;
        t.rotationRad = w.angle;
        t.steerAngleDeg = (-w.steer * 180) / Math.PI;
        t.onGround = w.contact;
        t.coreTempC = w.tire.coreK - 273.15; t.surfaceTempC = w.tire.surfaceK - 273.15;
        t.pressurePsi = (w.tire.pressurePa / 1000) * PSI_PER_KPA;
        t.gripUtilPct = Math.round(clamp(w.tire.out.saturation * 100, 0, 100));
        t.angularVelocityRps = w.omega / (2 * Math.PI);
      });
    }
  }

  /** Translate engine events (and a few derived edges) into the UI's audio / HUD events. */
  _emitEvents() {
    const sim = this.sim, EV = this.EV, bus = this.bus, ch = sim.vehicle.chassis, eng = sim.vehicle.drivetrain.engine;
    const gearName = (g) => g;
    for (const e of sim.drainEvents()) {
      switch (e.type) {
        case 'shift':
          if (e.to > 0) {
            bus.emit(EV.GEAR_SHIFT, { gear: gearName(e.to), direction: e.to > e.from ? 'up' : 'down' });
            if (e.to > e.from && eng.turbo.boostGaugePa > 80000) { bus.emit(EV.TURBO_BLOWOFF); bus.emit(EV.BACKFIRE_POP); }   // audio cue; same trigger as the UI's own gearbox
          }
          break;
        case 'pacenote': {
          const ui = this.uiNotes.get(e.id);
          if (ui) bus.emit(EV.PACENOTE_TRIGGER, ui);
          break;
        }
        case 'body_impact': bus.emit(EV.VEHICLE_COLLISION, { zone: e.zone, energyJ: e.energy, severity: clamp(e.energy / 20000, 0, 1) }); break;
        case 'radiator_puncture': bus.emit(EV.NOTIFICATION, { title: 'Damage', message: 'Radiator punctured - coolant leaking' }); break;
        case 'tie_rod_bent': bus.emit(EV.NOTIFICATION, { title: 'Damage', message: `Bent tie-rod (${['FL', 'FR', 'RL', 'RR'][e.wheel]})` }); break;
        case 'engine_seized': bus.emit(EV.NOTIFICATION, { title: 'Engine', message: 'Engine seized' }); break;
        case 'engine_stall': bus.emit(EV.NOTIFICATION, { title: 'Engine', message: 'Engine stalled' }); break;
        case 'gear_grind': bus.emit(EV.NOTIFICATION, { title: 'Gearbox', message: 'Gear grind' }); break;
        case 'off_course': bus.emit(EV.NOTIFICATION, { title: 'Stage', message: 'Off course' }); break;
        case 'checkpoint': bus.emit(EV.NOTIFICATION, { title: e.name, message: `${e.time.toFixed(1)} s` }); break;
        case 'stage_finish': bus.emit(EV.NOTIFICATION, { title: 'Stage complete', message: `${e.time.toFixed(1)} s` }); break;
        default: break;
      }
    }
    // blow-off valve: rising edge of the valve opening with real boost behind it
    const bov = eng.turbo.bovOpen > 0.5 && eng.turbo.boostGaugePa > 40000;
    if (bov && !this.prev.bov) bus.emit(EV.TURBO_BLOWOFF);
    this.prev.bov = bov;
    // exhaust pops while anti-lag works or the limiter / shift cut is cutting fuel
    const popRate = eng.out.alsActive ? 7 : eng.out.fuelCut && eng.rpm > 3000 ? 14 : 0;
    if (popRate > 0 && this.rng.next() < popRate * (1 / 60)) bus.emit(EV.BACKFIRE_POP);
    // suspension bottoming
    ch.wheels.forEach((w, i) => {
      const b = w.z > w.susp.travel - 0.004;
      if (b && !this.prev.bottomed[i]) bus.emit(EV.BOTTOM_OUT, { wheelId: WHEEL_KEYS[i], energyJ: w.impactEnergy });
      this.prev.bottomed[i] = b;
    });
  }

  dispose() { for (const off of this._offs) off?.(); this._offs.length = 0; }
}

/**
 * Wire the engine into the UI's `physicsBridge` singleton without editing it. After this call the bridge's frame loop,
 * keyboard handling, input smoothing and listeners are unchanged, but the physics and telemetry come from the engine.
 * @returns {RallyEngineLink}
 */
export function installRallyEngine(bridge, { eventBus, RALLY_EVENTS, stateStore, config, options }) {
  const link = new RallyEngineLink({ bridge, eventBus, RALLY_EVENTS, stateStore, config, options });
  bridge._stepPhysics = (dt) => { bridge.tickCount = (bridge.tickCount ?? 0) + 1; link.step(dt); };
  bridge._broadcastTelemetry = (timestamp) => { link.broadcast(timestamp); };
  bridge.resetVehicle = () => link.reset();
  bridge.shiftGear = (dir) => link.shift(dir);
  bridge.setStageSpline = (spline) => { bridge.stageSpline = spline; };     // the engine owns the road; keep the reference for the viewport
  bridge.engineLink = link;
  return link;
}
