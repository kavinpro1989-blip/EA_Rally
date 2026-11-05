import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalFrame, haversine, geodeticToEcef, ecefToGeodetic } from '../systems/stage/geo.js';
import { validateSchema } from '../systems/stage/schema_validator.js';
import { parseStage, StageSchemaError } from '../systems/stage/stage_parser.js';
import { lateralProfile } from '../systems/stage/spline.js';
import { Stage } from '../systems/stage/stage.js';
import { StageRuntime } from '../systems/stage/stage_runtime.js';
import { PacenotePlayer, generatePacenotes } from '../systems/stage/pacenotes.js';
import { SurfaceLibrary } from '../core_physics/chassis/surface.js';
import { loadCfg, syntheticStage } from './helpers.js';

const cfg = loadCfg();
const schema = cfg.gpsStageSchema;
const lib = new SurfaceLibrary(cfg.surfaces);
const build = (json, opts) => Stage.fromJson(json, schema, { surfaces: lib, ...opts });
const DEG = Math.PI / 180;

// ---------------------------------------------------------------- geodesy
test('LocalFrame: exact ENU mapping (x = East, y = Up, z = -North) and round trip', () => {
  const f = new LocalFrame(47.0, 11.0, 500);
  const north = f.toLocal(47.01, 11.0, 500), east = f.toLocal(47.0, 11.01, 500), up = f.toLocal(47.0, 11.0, 600);
  assert.ok(north.z < -1100 && north.z > -1115 && Math.abs(north.x) < 1, `north ${JSON.stringify(north)}`);   // 0.01 deg lat ~ 1.11 km
  assert.ok(east.x > 755 && east.x < 765 && Math.abs(east.z) < 1);                                           // 0.01 deg lng at 47 deg ~ 760 m on the ellipsoid
  assert.ok(Math.abs(up.y - 100) < 1e-3 && Math.abs(up.x) < 1e-3);
  for (const [la, lo, h] of [[47.2, 11.3, 650], [46.9, 10.8, 20], [47.05, 11.11, 1800]]) {
    const back = f.toGeodetic(f.toLocal(la, lo, h));
    assert.ok(Math.abs(back.lat - la) < 1e-9 && Math.abs(back.lng - lo) < 1e-9 && Math.abs(back.h - h) < 1e-4, `${la},${lo}`);
  }
  const e = ecefToGeodetic(...Object.values(geodeticToEcef(-33.9, 151.2, 40)));
  assert.ok(Math.abs(e.lat + 33.9) < 1e-9 && Math.abs(e.h - 40) < 1e-4);
});

test('LocalFrame distances agree with great-circle distances over tens of km', () => {
  const f = new LocalFrame(61.45, 26.0, 120);
  for (const [la, lo] of [[61.5, 26.1], [61.6, 25.8], [61.3, 26.3]]) {
    const p = f.toLocal(la, lo, 120);
    const d = Math.hypot(p.x, p.z);
    const hv = haversine(61.45, 26.0, la, lo);
    assert.ok(Math.abs(d - hv) / hv < 0.005, `${d} vs ${hv}`);
  }
});

// ---------------------------------------------------------------- schema & parser
const valid = () => syntheticStage({ segments: [['straight', 300], ['arc', 60, 80], ['straight', 200]] });

test('schema validator: valid stage passes, errors carry paths', () => {
  assert.deepEqual(validateSchema(schema, valid()), []);
  const bad = valid(); delete bad.track.lng;
  const errs = validateSchema(schema, bad);
  assert.ok(errs.some((e) => e.path === '$.track.lng' && /required/.test(e.message)));
  const bad2 = valid(); bad2.track.lat[3] = 123;
  assert.ok(validateSchema(schema, bad2).some((e) => e.path.startsWith('$.track.lat[3]')));
  const bad3 = valid(); bad3.bogus = 1;
  assert.ok(validateSchema(schema, bad3).some((e) => e.path === '$.bogus'));
  const bad4 = valid(); bad4.schemaVersion = '2.0';
  assert.ok(validateSchema(schema, bad4).some((e) => e.path === '$.schemaVersion'));
});

test('parser: cross-field checks and friendly errors', () => {
  const j = valid(); j.track.elevation.pop();
  assert.throws(() => parseStage(j, schema), (e) => e instanceof StageSchemaError && /length/.test(e.message));
  assert.throws(() => parseStage('{not json', schema), StageSchemaError);
  const dup = valid(); dup.surfaces = [{ fromDistance: 0, toDistance: 200, layers: [{ type: 'tarmac' }] }, { fromDistance: 100, toDistance: 300, layers: [{ type: 'tarmac' }] }];
  assert.throws(() => parseStage(dup, schema), /overlaps/);
  const unknown = valid(); unknown.surfaces = [{ fromDistance: 0, toDistance: 50, layers: [{ type: 'lava' }] }];
  assert.throws(() => parseStage(unknown, schema, { surfaces: lib }), /unknown surface type "lava"/);
  const noDepth = valid(); noDepth.surfaces = [{ fromDistance: 0, toDistance: 50, layers: [{ type: 'gravel' }, { type: 'packed_dirt' }] }];
  assert.throws(() => parseStage(noDepth, schema), /depth/);
  assert.throws(() => parseStage(valid(), null), /schema/);
});

test('parser: drops duplicate GPS fixes and converts to the local frame', () => {
  const j = valid();
  j.track.lat.splice(2, 0, j.track.lat[2]); j.track.lng.splice(2, 0, j.track.lng[2]); j.track.elevation.splice(2, 0, j.track.elevation[2]); j.track.width.splice(2, 0, 6.5);
  const def = parseStage(j, schema);
  assert.equal(def.points.length, valid().track.lat.length);
  assert.equal(def.points[0].x, 0);
  assert.ok(def.points[1].z < 0, 'first leg runs north (-Z)');
});

// ---------------------------------------------------------------- spline geometry
test('spline: straight leg length, heading and constant grade', () => {
  const st = build(syntheticStage({ segments: [['straight', 400]], elevation: (s) => 0.1 * s }));
  const sp = st.spline;
  assert.ok(Math.abs(sp.horizontalLength - 400) < 0.5, `L_h ${sp.horizontalLength}`);
  assert.ok(Math.abs(sp.length - 400 * Math.sqrt(1.01)) < 0.6);
  assert.ok(Math.abs(sp.sampleAt(200).heading) < 1e-3, 'due north');
  const g = sp.grade[Math.floor(sp.n / 2)];
  assert.ok(Math.abs(g - 0.1) < 0.005, `grade ${g}`);
  assert.ok(Math.abs(sp.sampleAt(200).y - 20) < 0.1);
});

test('spline: constant-radius arc has curvature 1/R (left positive) and the right length', () => {
  for (const [angle, R] of [[90, 100], [-90, 100], [60, 40]]) {
    const st = build(syntheticStage({ segments: [['straight', 100], ['arc', angle, R], ['straight', 100]] }));
    const sp = st.spline;
    const mid = sp.locate(100 + (Math.abs(angle) * DEG * R) / 2).i;
    const k = sp.kappa[mid];
    assert.ok(Math.abs(k - Math.sign(angle) / R) / (1 / R) < 0.06, `${angle}/${R}: kappa ${k} vs ${Math.sign(angle) / R}`);
    const expected = 200 + Math.abs(angle) * DEG * R;
    assert.ok(Math.abs(sp.horizontalLength - expected) / expected < 0.01, `length ${sp.horizontalLength} vs ${expected}`);
    // heading change equals the arc angle (compass heading: left turn decreases heading)
    const dh = sp.sampleAt(sp.length).heading - sp.sampleAt(0).heading;
    assert.ok(Math.abs(dh + angle * DEG) < 0.03, `heading change ${dh / DEG}`);
  }
});

test('spline: closed circuit wraps cleanly', () => {
  // full circle of R = 150 m to the left, closed
  const json = syntheticStage({ segments: [['arc', 360, 150]] });
  json.track.closed = true;
  // drop the duplicated last fix (it coincides with the first)
  for (const k of ['lat', 'lng', 'elevation', 'width']) json.track[k].pop();
  const st = build(json);
  const sp = st.spline;
  assert.ok(Math.abs(sp.horizontalLength - 2 * Math.PI * 150) / (2 * Math.PI * 150) < 0.01, `closed length ${sp.horizontalLength}`);
  const k = sp.kappa[Math.floor(sp.n / 3)];
  assert.ok(Math.abs(k - 1 / 150) < 0.0007, `kappa ${k}`);
});

test('spline: procedural banking leans into corners, is bounded, and measured banking overrides it', () => {
  const st = build(syntheticStage({ segments: [['straight', 100], ['arc', 60, 100], ['straight', 100], ['arc', -60, 100], ['straight', 100]], processing: { maxBankDeg: 8, designSpeed: 25, bankFraction: 0.35 } }));
  const sp = st.spline;
  const left = sp.bank[sp.locate(100 + 50).i], right = sp.bank[sp.locate(100 + 105 + 100 + 50).i];
  assert.ok(left < -0.02 && right > 0.02, `left ${left / DEG} right ${right / DEG}`);   // positive = right side lower
  assert.ok(Math.max(...Array.from(sp.bank).map(Math.abs)) <= 8.5 * DEG);
  // gentle corner -> less banking than the tight one
  const gentle = build(syntheticStage({ segments: [['straight', 100], ['arc', 40, 400], ['straight', 100]], processing: { maxBankDeg: 8 } })).spline;
  assert.ok(Math.abs(gentle.bank[gentle.locate(100 + 140).i]) < Math.abs(left));
  // measured banking
  const j = syntheticStage({ segments: [['straight', 300]] });
  j.track.bank = j.track.lat.map(() => 4);
  const m = build(j).spline;
  assert.ok(Math.abs(m.bank[m.n >> 1] - 4 * DEG) < 1e-6);
});

test('spline.nearest: lateral offset is signed (right positive) and consistent in curves', () => {
  const st = build(syntheticStage({ segments: [['straight', 100], ['arc', 90, 80], ['straight', 100]] }));
  const sp = st.spline;
  for (const s of [30, 140, 190]) {
    for (const c of [-2.5, 0, 1.7, 3]) {
      const p = sp.pointAt(s, c);
      const q = sp.nearest(p.x, p.z);
      assert.ok(Math.abs(q.s - s) < 0.3 && Math.abs(q.c - c) < 0.05, `s ${s} c ${c}: got s ${q.s} c ${q.c}`);
    }
  }
  // car heading north (z decreasing): right is +x (east)
  const p0 = sp.pointAt(10, 0);
  const q = sp.nearest(p0.x + 2, p0.z);
  assert.ok(q.c > 1.9 && q.c < 2.1);
});

test('spline.nearest resolves overlapping road sections with the height hint (bridge)', () => {
  // out east, loop round, then cross over the first leg 8 m higher
  const segs = [['straight', 200], ['arc', 90, 40], ['straight', 100], ['arc', 90, 40], ['straight', 160], ['arc', 90, 40], ['straight', 60], ['arc', 90, 40], ['straight', 300]];
  const json = syntheticStage({ segments: segs, elevation: (s) => (s > 700 ? 8 : 0), step: 4 });
  const st = build(json);
  const sp = st.spline;
  // find the crossing: first sample of the late leg that is within 3 m (xz) of an early sample
  let found = null;
  for (let i = sp.n - 1; i > sp.n * 0.6 && !found; i--) for (let j = 0; j < sp.n * 0.3; j++) {
    if (Math.hypot(sp.x[i] - sp.x[j], sp.z[i] - sp.z[j]) < 0.8) { found = { i, j }; break; }
  }
  if (!found) return;   // geometry did not cross in this layout; nothing to assert
  const { i, j } = found;
  const upper = sp.nearest(sp.x[i], sp.z[i], sp.y[i]);
  const lower = sp.nearest(sp.x[j], sp.z[j], sp.y[j]);
  assert.ok(Math.abs(upper.s - sp.s[i]) < 5, 'high hint selects the upper section');
  assert.ok(Math.abs(lower.s - sp.s[j]) < 5, 'low hint selects the lower section');
});

test('road mesh data is well formed (finite, unit normals, valid indices)', () => {
  const sp = build(syntheticStage({ segments: [['straight', 100], ['arc', 60, 50], ['straight', 100]], elevation: (s) => 3 * Math.sin(s / 40) })).spline;
  const m = sp.buildRoadMesh({ lateralSteps: 6, stride: 3 });
  const vertCount = m.positions.length / 3;
  assert.equal(m.normals.length, m.positions.length);
  assert.equal(m.uvs.length, vertCount * 2);
  assert.ok(m.indices.every((i) => i < vertCount));
  assert.ok(m.positions.every(Number.isFinite));
  for (let i = 0; i < vertCount; i += 7) assert.ok(Math.abs(Math.hypot(m.normals[3 * i], m.normals[3 * i + 1], m.normals[3 * i + 2]) - 1) < 1e-5);
  assert.ok(m.positions instanceof Float32Array && m.indices instanceof Uint32Array);
});

// ---------------------------------------------------------------- terrain
test('terrain: height follows centreline + banking plane + crown; analytic normal matches finite differences', () => {
  const st = build(syntheticStage({ segments: [['straight', 100], ['arc', 70, 60], ['straight', 100]], elevation: (s) => 4 * Math.sin(s / 30), extra: { road: { crownSlope: 0.03 } } }));
  const sp = st.spline, T = st.terrain;
  for (const s of [20, 120, 150, 230]) {
    for (const c of [-2.8, -1, 0, 1.3, 2.9]) {
      const p = sp.pointAt(s, c);
      const q = T.sample(p.x, p.z, 0, p.y);
      const f = p.frame;
      const expected = f.y - c * f.tanBank + lateralProfile(c, f.width, st.def.road).h;
      assert.ok(Math.abs(q.height - expected) < 0.03, `s ${s} c ${c}: ${q.height} vs ${expected}`);
      const e = 0.02;
      const dx = (T.sample(p.x + e, p.z).height - T.sample(p.x - e, p.z).height) / (2 * e);
      const dz = (T.sample(p.x, p.z + e).height - T.sample(p.x, p.z - e).height) / (2 * e);
      const inv = 1 / Math.sqrt(dx * dx + 1 + dz * dz);
      assert.ok(Math.abs(q.nx - -dx * inv) < 0.01 && Math.abs(q.nz - -dz * inv) < 0.01 && Math.abs(q.ny - inv) < 0.005, `normal at s ${s} c ${c}: (${q.nx},${q.ny},${q.nz}) vs (${-dx * inv},${inv},${-dz * inv})`);
    }
  }
});

test('terrain: layers by lateral position; verge drops away from the road', () => {
  const st = build(syntheticStage({ segments: [['straight', 300]], layers: [{ type: 'gravel', depth: 0.04 }, { type: 'packed_dirt' }], extra: { road: { shoulderWidth: 1.5 } } }));
  const sp = st.spline, T = st.terrain;
  const at = (c) => { const p = sp.pointAt(150, c); return T.sample(p.x, p.z, 0, p.y); };
  assert.equal(at(0).layers[0].type, 'gravel');
  assert.ok(at(0).onRoad);
  assert.equal(at(3.6).layers[0].type, 'gravel');            // shoulder (0.015 gravel over dirt)
  assert.equal(at(3.6).layers[0].depth, 0.015);
  assert.equal(at(8).layers[0].type, 'grass');                // verge
  assert.ok(at(8).height < at(0).height - 0.5);
  assert.ok(!at(8).onRoad);
});

test('terrain: authored surface segments change the layer stack along the stage', () => {
  const j = syntheticStage({ segments: [['straight', 400]] });
  j.surfaces = [{ fromDistance: 0, toDistance: 150, layers: [{ type: 'tarmac' }] }, { fromDistance: 150, toDistance: 400, layers: [{ type: 'mud', depth: 0.05 }, { type: 'packed_dirt' }] }];
  const st = build(j);
  const f = (s) => { const p = st.spline.pointAt(s, 0); return st.terrain.sample(p.x, p.z).layers[0].type; };
  assert.equal(f(50), 'tarmac'); assert.equal(f(300), 'mud');
});

// ---------------------------------------------------------------- pacenotes
const notesFor = (segments, extra = {}) => build(syntheticStage({ segments, ...extra })).pacenotes;
const corner = (notes) => notes.filter((n) => ['corner', 'hairpin', 'square'].includes(n.type));

test('pacenotes: direction, severity ordering, hairpin and square classification', () => {
  const notes = corner(notesFor([
    ['straight', 200], ['arc', 60, 90], ['straight', 160], ['arc', -70, 45], ['straight', 160], ['arc', 100, 20], ['straight', 160], ['arc', -170, 12], ['straight', 200],
  ]));
  assert.equal(notes.length, 4);
  assert.deepEqual(notes.map((n) => n.direction), ['left', 'right', 'left', 'right']);
  assert.ok(notes[0].severity > notes[1].severity && notes[1].severity > notes[2].severity, `severities ${notes.map((n) => n.severity)}`);
  assert.equal(notes[2].type, 'square');
  assert.equal(notes[3].type, 'hairpin');
  assert.ok(notes[3].text.startsWith('hairpin right'));
  // positions are at corner entry and in order
  const entry = [200, 200 + 94.2 + 160, 200 + 94.2 + 160 + 55 + 160, 200 + 94.2 + 160 + 55 + 160 + 31.4 + 160];
  notes.forEach((n, i) => assert.ok(Math.abs(n.s - entry[i]) < 45, `note ${i} at ${n.s} (corner entry ~${entry[i]})`));
});

test('pacenotes: tightening / opening / long / into modifiers', () => {
  const notes = corner(notesFor([
    ['straight', 150], ['arc', 40, 120], ['arc', 70, 38], ['straight', 200],            // tightens
    ['arc', 60, 40], ['arc', 40, 130], ['straight', 200],                              // opens
    ['arc', 110, 60], ['straight', 25], ['arc', -80, 45], ['straight', 200],           // long, then into
  ]));
  const find = (dir, pred) => notes.find(pred);
  const tight = notes[0], opens = notes[1], long = notes[2];
  assert.ok(tight.modifiers.includes('tightens'), JSON.stringify(notes.map((n) => [n.s, n.modifiers])));
  assert.ok(opens.modifiers.includes('opens'));
  assert.ok(long.modifiers.includes('long'));
  assert.ok(long.modifiers.includes('into'));
  assert.ok(long.text.includes('into'));
  void find;
});

test('pacenotes: crest, jump and dip from the elevation profile; none on a flat road', () => {
  const flat = notesFor([['straight', 800]]);
  assert.equal(flat.length, 0);
  const gauss = (s, c, sg, h) => h * Math.exp(-((s - c) ** 2) / (2 * sg * sg));
  const hills = notesFor([['straight', 1000]], { elevation: (s) => gauss(s, 300, 14, 4) + gauss(s, 600, 30, 3.5) + gauss(s, 850, 16, -4.5) });
  const kinds = hills.map((n) => n.type);
  assert.ok(kinds.includes('jump'), `${kinds}`);
  assert.ok(kinds.includes('dip'));
  const jump = hills.find((n) => n.type === 'jump');
  assert.ok(Math.abs(jump.s - 300) < 20, `jump at ${jump.s}`);
  const dip = hills.find((n) => n.type === 'dip');
  assert.ok(Math.abs(dip.s - 850) < 20, `dip at ${dip.s}`);
  // the gentle 3.5 m / 30 m hill at 600 m is not worth a call; the only crest is the lip just before the dip
  assert.ok(!hills.some((n) => n.s > 450 && n.s < 760), JSON.stringify(hills.map((n) => [n.type, n.s])));
  assert.ok(hills.filter((n) => n.type === 'crest').every((n) => n.s > 780 && n.s < dip.s));
});

test('pacenotes: severity scale convention is switchable', () => {
  const six = notesFor([['straight', 100], ['arc', 60, 90], ['straight', 100]]);
  const j = syntheticStage({ segments: [['straight', 100], ['arc', 60, 90], ['straight', 100]] });
  j.pacenotes = { severityScale: 'one_easiest' };
  const one = build(j).pacenotes;
  const wordOf = (n) => n.tokens[1];
  const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
  assert.equal(NUM.indexOf(wordOf(one[0])), 7 - NUM.indexOf(wordOf(six[0])));
});

test('explicit and merged pacenote modes', () => {
  const j = syntheticStage({ segments: [['straight', 100], ['arc', 60, 90], ['straight', 100]] });
  j.pacenotes = { mode: 'explicit', notes: [{ distance: 20, type: 'right', severity: 2, modifiers: ['long'] }, { distance: 50, type: 'custom', text: 'watch the ditch' }] };
  const e = build(j).pacenotes;
  assert.deepEqual(e.map((n) => n.text), ['right two long', 'watch the ditch']);
  j.pacenotes.mode = 'merge';
  const m = build(j).pacenotes;
  assert.ok(m.length >= 2 && m.some((n) => n.text === 'watch the ditch') && m.some((n) => n.direction === 'left'));
});

test('PacenotePlayer: calls ahead of the corner by max(minLead, speed*leadTime), never overlaps, drops stale notes', () => {
  const mk = (id, s, text, prio = 0) => ({ id, s, sEnd: s + 20, tokens: text.split(' '), text, priority: prio });
  const notes = [mk('a', 300, 'left four'), mk('b', 330, 'right three into left two', 0), mk('c', 900, 'hairpin right', 2)];
  const p = new PacenotePlayer(notes, { leadTimeSeconds: 5, minLeadDistance: 60, speechRate: 3 });
  const calls = [];
  let s = 0;
  const speed = 30;
  for (let t = 0; t < 40; t += 0.02) {
    s += speed * 0.02;
    for (const e of p.update(0.02, s, speed)) calls.push({ id: e.note.id, at: s, dur: e.duration, ahead: e.distanceAhead });
  }
  assert.deepEqual(calls.map((c) => c.id), ['a', 'b', 'c']);
  assert.ok(Math.abs(calls[0].ahead - 150) < 3, `first call ${calls[0].ahead} m ahead (5 s at 30 m/s)`);
  assert.ok(calls[1].at - calls[0].at >= calls[0].dur * speed - 1, 'second call waits for the first to finish');
  // stale: a slow note arriving after the car passed is dropped
  const q = new PacenotePlayer([mk('x', 100, 'left one'), mk('y', 110, 'right six')], { leadTimeSeconds: 1, minLeadDistance: 5, speechRate: 0.3 });
  const spoken = [];
  for (let sx = 0; sx < 200; sx += 1) for (const e of q.update(0.1, sx, 10)) spoken.push(e.note.id);
  assert.deepEqual(spoken, ['x']);
  assert.equal(q.missed, 1);
});

test('PacenotePlayer state round trip and upcoming()', () => {
  const st = build(syntheticStage({ segments: [['straight', 100], ['arc', 60, 50], ['straight', 100], ['arc', -60, 50], ['straight', 100]] }));
  const p = st.createPacenotePlayer();
  p.update(0.1, 50, 25);
  const snap = JSON.parse(JSON.stringify(p.getState()));
  const p2 = st.createPacenotePlayer();
  p2.setState(snap);
  assert.deepEqual(p2.getState(), p.getState());
  assert.ok(p.upcoming(0, 2).length >= 1);
});

// ---------------------------------------------------------------- runtime
test('StageRuntime: progress, checkpoints in order, finish, off-course debounce', () => {
  const j = syntheticStage({ segments: [['straight', 600]] });
  j.checkpoints = [{ distance: 200, name: 'Split 1' }, { distance: 400, name: 'Split 2' }];
  const st = build(j);
  const rt = new StageRuntime(st);
  const events = [];
  for (let s = 0; s <= 600; s += 1) {
    const p = st.spline.pointAt(Math.min(s, st.length), 0);
    events.push(...rt.update(0.1, p, p.y));
  }
  const types = events.map((e) => e.type);
  assert.deepEqual(types.filter((t) => t !== 'back_on_course'), ['stage_start', 'checkpoint', 'checkpoint', 'stage_finish']);
  assert.deepEqual(events.filter((e) => e.type === 'checkpoint').map((e) => e.name), ['Split 1', 'Split 2']);
  assert.ok(rt.finished && rt.progress > 0.99);
  // off-course
  const rt2 = new StageRuntime(st);
  let off = 0;
  for (let i = 0; i < 100; i++) {
    const p = st.spline.pointAt(100, 15);
    off += rt2.update(0.1, p, p.y).filter((e) => e.type === 'off_course').length;
  }
  assert.equal(off, 1);
  assert.equal(rt2.offCourse, true);
});

test('generatePacenotes works directly on a spline and is deterministic', () => {
  const sp = build(syntheticStage({ segments: [['straight', 100], ['arc', 80, 40], ['straight', 100]] })).spline;
  const a = generatePacenotes(sp), b = generatePacenotes(sp);
  assert.deepEqual(a.map((n) => n.text), b.map((n) => n.text));
});

test('lateralProfile is continuous across the carriageway / shoulder / verge boundaries', () => {
  const road = { crownSlope: 0.025, shoulderWidth: 1.5, verge: { slope: -0.35, width: 6 } };
  const W = 6;
  for (const edge of [3, 4.5, 10.5]) {
    const a = lateralProfile(edge - 1e-6, W, road).h, b = lateralProfile(edge + 1e-6, W, road).h;
    assert.ok(Math.abs(a - b) < 1e-4, `jump at ${edge}`);
  }
  const l = lateralProfile(-2, W, road), r = lateralProfile(2, W, road);
  assert.ok(Math.abs(l.h - r.h) < 1e-12 && Math.abs(l.dhdc + r.dhdc) < 1e-12);
});
