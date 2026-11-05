import { G } from '../../core_physics/math/constants.js';
import { clamp } from '../../core_physics/math/util.js';

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export const DEFAULT_PACENOTE_CONFIG = {
  enterRadius: 250,          // m: a corner starts when radius drops below this
  leaveRadius: 400,          // m: ... and ends when it rises above this (hysteresis)
  minAngleDeg: 14,           // ignore bends that turn less than this unless tight
  tightRadius: 70, tightMinAngleDeg: 10,
  crestProminence: 1.1, dipProminence: 0.9, verticalEdgeMargin: 15,
  mergeGap: 22,              // m: merge same-direction corner fragments closer than this
  chainGap: 45,              // m: "into" chaining distance between consecutive corners
  longLength: 75,            // m of arc for the "long" modifier
  severityRadii: [110, 75, 50, 32, 20],   // lower bounds for severity 6,5,4,3,2 (below the last = 1)
  hairpinRadius: 17, hairpinAngleDeg: 125,
  squareAngleRange: [75, 115], squareRadius: 22,
  tightenRatio: 1.45,
  offCamberDeg: 1.8,
  crestRefSpeed: 28,         // m/s used to judge crests and dips
  jumpRatio: 0.8, crestRatio: 0.38, dipRatio: 0.45,   // thresholds on v^2*|kv|/g, calibrated for the smoothed profile
  distanceCallMin: 90,       // m of straight before a distance is spoken
};

/** Corner severity, 6 = fastest ... 1 = tightest ("six_easiest"), or reversed for "one_easiest". */
function severityFromRadius(R, cfg) {
  const t = cfg.severityRadii;
  for (let i = 0; i < t.length; i++) if (R >= t[i]) return 6 - i;
  return 1;
}

function cornerTokens(note, scale) {
  const sev = scale === 'one_easiest' ? 7 - note.severity : note.severity;
  const w = [];
  if (note.type === 'hairpin') w.push('hairpin', note.direction);
  else if (note.type === 'square') w.push('square', note.direction);
  else w.push(note.direction, NUMBER_WORDS[sev]);
  const mod = {
    long: ['long'], tightens: ['tightens'], opens: ['opens'], dont_cut: ["don't", 'cut'], off_camber: ['off', 'camber'],
    over_crest: ['over', 'crest'], caution: ['caution'], into: [],
  };
  for (const m of note.modifiers) w.push(...(mod[m] ?? [m.replace(/_/g, ' ')]));
  return w;
}

function say(n) {
  if (n >= 1000) return `${Math.round(n / 100) / 10} k`;
  return String(n);
}

/**
 * Generate co-driver pacenotes from a spline: corners (direction, severity 1-6, hairpin/square,
 * long / tightens / opens / off-camber modifiers, "into" chaining), crests, jumps and dips.
 *
 * @param {import('./spline.js').TrackSpline} sp
 * @param {object} [options] overrides for DEFAULT_PACENOTE_CONFIG plus `severityScale`
 */
export function generatePacenotes(sp, options = {}) {
  const cfg = { ...DEFAULT_PACENOTE_CONFIG, ...options };
  const scale = options.severityScale ?? 'six_easiest';
  const n = sp.n;
  const enter = 1 / cfg.enterRadius, leave = 1 / cfg.leaveRadius;

  // 1. contiguous corner intervals via hysteresis on |kappa|
  const raw = [];
  let cur = null;
  for (let i = 0; i < n; i++) {
    const k = sp.kappaRobust[i], ak = Math.abs(k);
    if (!cur) {
      if (ak >= enter) cur = { i0: i, sign: Math.sign(k) };
    } else if (Math.sign(k) !== cur.sign && ak >= enter) {
      cur.i1 = i; raw.push(cur); cur = { i0: i, sign: Math.sign(k) };
    } else if (ak < leave || Math.sign(k) !== cur.sign) {
      cur.i1 = i; raw.push(cur); cur = null;
    }
  }
  if (cur) { cur.i1 = n - 1; raw.push(cur); }

  // 2. merge same-direction fragments separated by short gaps
  const merged = [];
  for (const c of raw) {
    const prev = merged[merged.length - 1];
    if (prev && prev.sign === c.sign && sp.s[c.i0] - sp.s[prev.i1] < cfg.mergeGap) prev.i1 = c.i1;
    else merged.push({ ...c });
  }

  // 3. describe each corner. The radius comes from the heading change over a sliding window
  // (not from the peak of a differentiated signal), so GPS jitter averages out.
  const chord = (idx, h) => {
    const a = Math.max(0, idx - h), b = Math.min(n - 1, idx + h);
    return Math.atan2(sp.x[b] - sp.x[a], -(sp.z[b] - sp.z[a]));
  };
  const unwrapDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const corners = [];
  for (const c of merged) {
    let angle = 0;
    for (let i = c.i0 + 1; i <= c.i1; i++) angle += sp.kappaRobust[i] * (sp.l[i] - sp.l[i - 1]);
    const angleDeg = Math.abs(angle) * 180 / Math.PI;
    const length = sp.s[c.i1] - sp.s[c.i0];
    const winLen = clamp(0.3 * length, 14, 50);
    const win = Math.max(2, Math.round(winLen / sp.step));
    const h = Math.max(2, Math.round(4 / sp.step));
    let kMax = 0, apex = Math.round((c.i0 + c.i1) / 2);
    const jEnd = Math.max(c.i0, c.i1 - win);
    for (let j = c.i0; j <= jEnd; j++) {
      const j2 = Math.min(n - 1, j + win);
      const dl = sp.l[j2] - sp.l[j];
      if (dl < 1e-6) continue;
      const k = Math.abs(unwrapDiff(chord(j, h), chord(j2, h))) / dl;
      if (k > kMax) { kMax = k; apex = Math.round((j + j2) / 2); }
    }
    if (kMax === 0) kMax = Math.abs(angle) / Math.max(length, 1);
    const Rmin = 1 / Math.max(kMax, 1e-6);
    if (angleDeg < (Rmin <= cfg.tightRadius ? cfg.tightMinAngleDeg : cfg.minAngleDeg)) continue;
    // measured over the whole corner minus the smeared entry/exit (smoothing spreads curvature a few metres either side)
    const trim = Math.min(Math.round(6 / sp.step), Math.floor((c.i1 - c.i0) / 6));
    const c0 = c.i0 + trim, c1 = c.i1 - trim;
    const span = c1 - c0;
    const third = Math.max(2, Math.floor(span / 3));
    const avgCurv = (ia, ib) => {
      const dl = sp.l[ib] - sp.l[ia];
      return dl > 1e-6 ? Math.abs(unwrapDiff(chord(ia, h), chord(ib, h))) / dl : 0;
    };
    const kStart = span >= 6 ? avgCurv(c0, c0 + third) : kMax;
    const kEnd = span >= 6 ? avgCurv(c1 - third, c1) : kMax;
        const modifiers = [];
    let type = 'corner';
    let severity = severityFromRadius(Rmin, cfg);
    if (Rmin < cfg.hairpinRadius && angleDeg > cfg.hairpinAngleDeg) { type = 'hairpin'; severity = 1; }
    else if (angleDeg >= cfg.squareAngleRange[0] && angleDeg <= cfg.squareAngleRange[1] && Rmin < cfg.squareRadius) { type = 'square'; severity = 1; }
    if (length > cfg.longLength && angleDeg > 50 && type === 'corner') modifiers.push('long');
    if (kEnd > kStart * cfg.tightenRatio) modifiers.push('tightens');
    else if (kStart > kEnd * cfg.tightenRatio) modifiers.push('opens');
    const bankAtApex = sp.bank[apex] * 180 / Math.PI;
    // positive kappa = left turn; adverse camber = outside of the bend lower, i.e. bank has the sign of kappa
    if (bankAtApex * Math.sign(c.sign) > cfg.offCamberDeg && severity <= 4) modifiers.push('off_camber');
    corners.push({
      type, direction: c.sign > 0 ? 'left' : 'right', severity, angleDeg, radius: Rmin, length,
      s: sp.s[c.i0], sEnd: sp.s[c.i1], sApex: sp.s[apex], modifiers, i0: c.i0, i1: c.i1,
    });
  }

  // 4. crests, jumps and dips from vertical curvature
  const verticals = [];
  const vref2 = cfg.crestRefSpeed * cfg.crestRefSpeed;
  const margin = cfg.verticalEdgeMargin;
  const prominence = (idx) => {
    // height of the smoothed profile relative to the local average 35 m either side
    const s0 = sp.s[idx];
    const ia = sp.locate(Math.max(0, s0 - 35)).i, ib = sp.locate(Math.min(sp.length, s0 + 35)).i;
    return sp.ySmooth[idx] - 0.5 * (sp.ySmooth[ia] + sp.ySmooth[ib]);
  };
  let i = 0;
  while (i < n) {
    const kv = sp.kv[i];
    const kind = kv < 0 ? 'crest' : 'dip';
    const r = (vref2 * Math.abs(kv)) / G;
    const limit = kind === 'crest' ? cfg.crestRatio : cfg.dipRatio;
    if (r >= limit) {
      let j = i, best = i;
      while (j < n && Math.sign(sp.kv[j]) === Math.sign(kv) && (vref2 * Math.abs(sp.kv[j])) / G >= limit * 0.6) {
        if (Math.abs(sp.kv[j]) > Math.abs(sp.kv[best])) best = j;
        j++;
      }
      const rr = (vref2 * Math.abs(sp.kv[best])) / G;
      const prom = prominence(best);
      const okProm = kind === 'crest' ? prom >= cfg.crestProminence : -prom >= cfg.dipProminence;
      const inside = sp.s[best] > margin && sp.s[best] < sp.length - margin;
      if (okProm && inside) {
        verticals.push({
          type: kind === 'crest' ? (rr >= cfg.jumpRatio ? 'jump' : 'crest') : 'dip',
          s: sp.s[best], sEnd: sp.s[Math.min(j, n - 1)], severity: 0, direction: '', modifiers: [], ratio: rr, prominence: prom,
        });
      }
      i = j + 1;
    } else i++;
  }
  // a crest on the entry of (or inside) a corner becomes a modifier of that corner
  const standalone = [];
  for (const v of verticals) {
    const host = corners.find((c) => v.s >= c.s - 15 && v.s <= c.sEnd);
    if (host && (v.type === 'crest') && !host.modifiers.includes('over_crest')) host.modifiers.push('over_crest');
    else standalone.push(v);
  }

  // 5. chain & order
  const notes = [...corners, ...standalone].sort((a, b) => a.s - b.s);
  for (let k = 0; k < notes.length; k++) {
    const a = notes[k], b = notes[k + 1];
    if (!b) break;
    if ((a.type === 'corner' || a.type === 'hairpin' || a.type === 'square') && (b.type === 'corner' || b.type === 'hairpin' || b.type === 'square')) {
      const gap = b.s - a.sEnd;
      if (gap < cfg.chainGap) a.modifiers.push('into');
      if (gap < cfg.chainGap && a.severity <= 3 && b.direction !== a.direction && !a.modifiers.includes('caution')) { /* keep as is */ }
    }
  }
  notes.forEach((nt, idx) => {
    nt.id = `n${idx}`;
    const next = notes[idx + 1];
    const gap = next ? next.s - nt.sEnd : sp.length - nt.sEnd;
    nt.distanceToNext = Math.max(0, gap);
    if (nt.type === 'corner' && nt.severity <= 2 && nt.modifiers.includes('tightens') && !nt.modifiers.includes('caution')) nt.modifiers.push('caution');
    const tokens = nt.type === 'jump' ? ['jump'] : nt.type === 'crest' ? ['crest'] : nt.type === 'dip' ? ['dip'] : cornerTokens(nt, scale);
    if (nt.modifiers.includes('into') && next) tokens.push('into');
    else if (gap >= cfg.distanceCallMin && next) tokens.push(say(Math.round(gap / 10) * 10));
    nt.tokens = tokens;
    nt.text = tokens.join(' ');
    nt.priority = nt.modifiers.includes('caution') || nt.type === 'jump' || nt.type === 'hairpin' ? 2 : nt.severity <= 3 ? 1 : 0;
  });
  return notes;
}

/** Notes authored in the stage file (`pacenotes.notes`) normalised to the generated format. */
export function explicitPacenotes(list, sp, scale = 'six_easiest') {
  const notes = list.slice().sort((a, b) => a.distance - b.distance).map((e, idx) => {
    const type = e.type === 'left' || e.type === 'right' ? 'corner' : e.type;
    const note = {
      id: `e${idx}`, type, direction: e.type === 'left' || e.type === 'right' ? e.type : '',
      severity: typeof e.severity === 'number' ? e.severity : 0, s: e.distance, sEnd: e.distance + 10,
      modifiers: (e.modifiers ?? []).slice(), distanceToNext: 0, priority: e.priority ?? 1, radius: 0, angleDeg: 0, length: 0,
    };
    note.tokens = e.text ? e.text.split(/\s+/) : (type === 'corner' ? cornerTokens(note, scale) : [e.type, ...note.modifiers]);
    note.text = note.tokens.join(' ');
    return note;
  });
  notes.forEach((nt, i) => { nt.distanceToNext = i + 1 < notes.length ? notes[i + 1].s - nt.sEnd : Math.max(0, sp.length - nt.sEnd); });
  return notes;
}

/**
 * Plays pacenotes against the car's progress along the stage. A note is called when the car is
 * within max(minLeadDistance, speed * leadTime) of it; calls are queued (highest priority first)
 * and never overlap - each occupies `tokens / speechRate` seconds. Notes the car has already
 * passed while the co-driver was busy are dropped unless they are high priority.
 */
export class PacenotePlayer {
  constructor(notes, opts = {}) {
    this.notes = notes;
    this.leadTime = opts.leadTimeSeconds ?? 5;
    this.minLead = opts.minLeadDistance ?? 60;
    this.speechRate = opts.speechRate ?? 3;
    this.reset();
  }

  reset() {
    this.next = 0;
    this.queue = [];
    this.speakingUntil = 0;
    this.time = 0;
    this.current = null;
    this.missed = 0;
    this.called = 0;
  }

  speechDuration(note) { return note.tokens.length / this.speechRate + 0.25; }

  /**
   * @param {number} dt seconds  @param {number} s car progress [m]  @param {number} speed [m/s]
   * @returns {Array<object>} events: {type:'pacenote', note, duration, distanceAhead}
   */
  update(dt, s, speed) {
    this.time += dt;
    const events = [];
    const lead = Math.max(this.minLead, speed * this.leadTime);
    while (this.next < this.notes.length && s >= this.notes[this.next].s - lead) {
      this.queue.push(this.notes[this.next]);
      this.next++;
    }
    // drop stale queued notes
    this.queue = this.queue.filter((nt) => {
      const stale = s > nt.sEnd + 5 && nt.priority < 2;
      if (stale) this.missed++;
      return !stale;
    });
    if (this.time >= this.speakingUntil && this.queue.length) {
      let bi = 0;
      for (let k = 1; k < this.queue.length; k++) {
        const a = this.queue[k], b = this.queue[bi];
        if (a.priority > b.priority || (a.priority === b.priority && a.s < b.s)) bi = k;
      }
      const note = this.queue.splice(bi, 1)[0];
      const duration = this.speechDuration(note);
      this.speakingUntil = this.time + duration;
      this.current = note;
      this.called++;
      events.push({ type: 'pacenote', note, duration, distanceAhead: note.s - s });
    } else if (this.time >= this.speakingUntil) this.current = null;
    return events;
  }

  /** Index of the next note not yet called, for HUD "next corner" displays. */
  upcoming(s, count = 3) {
    const out = [];
    for (const nt of this.notes) {
      if (nt.sEnd >= s) out.push({ id: nt.id, text: nt.text, distance: nt.s - s, note: nt });
      if (out.length >= count) break;
    }
    return out;
  }

  getState() { return { next: this.next, queue: this.queue.map((n) => n.id), speakingUntil: this.speakingUntil, time: this.time, missed: this.missed, called: this.called, current: this.current ? this.current.id : null }; }
  setState(s) {
    const byId = new Map(this.notes.map((n) => [n.id, n]));
    this.next = s.next; this.queue = s.queue.map((id) => byId.get(id)); this.speakingUntil = s.speakingUntil;
    this.time = s.time; this.missed = s.missed; this.called = s.called; this.current = s.current ? byId.get(s.current) : null;
  }
}

