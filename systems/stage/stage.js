import { parseStage } from './stage_parser.js';
import { TrackSpline } from './spline.js';
import { StageTerrain } from './stage_terrain.js';
import { generatePacenotes, explicitPacenotes, PacenotePlayer } from './pacenotes.js';

/**
 * A fully built stage: parsed definition, track spline, terrain, pacenotes and progress tracking.
 */
export class Stage {
  /**
   * @param {object|string} json stage JSON
   * @param {object} schema parsed gps_stage_schema.json
   * @param {{surfaces?: object}} [opts]
   */
  static fromJson(json, schema, opts = {}) {
    const def = parseStage(json, schema, opts);
    return new Stage(def);
  }

  constructor(def) {
    this.def = def;
    this.id = def.id;
    this.name = def.name;
    this.frame = def.frame;
    this.spline = TrackSpline.build(def);
    this.terrain = new StageTerrain(this.spline);
    const pc = def.pacenotes;
    const auto = generatePacenotes(this.spline, { severityScale: pc.severityScale });
    if (pc.mode === 'explicit' && pc.notes.length) this.pacenotes = explicitPacenotes(pc.notes, this.spline, pc.severityScale);
    else if (pc.mode === 'merge' && pc.notes.length) {
      const exp = explicitPacenotes(pc.notes, this.spline, pc.severityScale);
      this.pacenotes = [...auto.filter((a) => !exp.some((e) => Math.abs(e.s - a.s) < 25)), ...exp].sort((a, b) => a.s - b.s);
    } else this.pacenotes = auto;
    this.pacenoteOptions = pc;
  }

  get length() { return this.spline.length; }

  createPacenotePlayer() { return new PacenotePlayer(this.pacenotes, this.pacenoteOptions); }

  /** World-space start pose: position on the centreline at arc length s, heading as compass bearing [rad]. */
  startPose(s = 0, lateral = 0) {
    const p = this.spline.pointAt(s, lateral);
    return { x: p.x, y: p.y, z: p.z, heading: p.frame.heading, frame: p.frame };
  }

  /** Geodetic coordinates of a distance along the stage (for map overlays). */
  toGeodetic(s, lateral = 0) {
    const p = this.spline.pointAt(s, lateral);
    return this.frame.toGeodetic(p);
  }
}
