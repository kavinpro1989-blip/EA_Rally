/**
 * Tracks the car's progress along a stage: distance, lateral offset, off-course detection,
 * checkpoint/split crossings and finish. Pure state machine - feed it the car position each tick.
 */
export class StageRuntime {
  /** @param {import('./stage.js').Stage} stage @param {{offCourseMargin?:number,offCourseTime?:number}} [opts] */
  constructor(stage, opts = {}) {
    this.stage = stage;
    this.margin = opts.offCourseMargin ?? 4;
    this.offTime = opts.offCourseTime ?? 3;
    this.checkpoints = stage.def.checkpoints;
    this.reset();
  }

  reset() {
    this.s = 0; this.c = 0; this.time = 0; this.started = false; this.finished = false;
    this.nextCheckpoint = 0; this.offCourseTimer = 0; this.offCourse = false; this.splits = [];
    this.onRoad = true; this.maxS = 0; this.startTime = 0; this.finishTime = null;
  }

  /** Begin timing (call when the car crosses the start line / launch). */
  start() { this.started = true; this.startTime = this.time; }

  update(dt, position, hint) {
    this.time += dt;
    const events = [];
    const q = this.stage.spline.nearest(position.x, position.z, hint ?? position.y);
    this.s = q.s; this.c = q.c;
    this.maxS = Math.max(this.maxS, q.s);
    const half = q.frame.width * 0.5;
    this.onRoad = Math.abs(q.c) <= half;
    if (!this.started && this.s > 2 && !this.finished) { this.start(); events.push({ type: 'stage_start', time: this.time }); }
    if (Math.abs(q.c) > half + this.margin) {
      this.offCourseTimer += dt;
      if (!this.offCourse && this.offCourseTimer > this.offTime) { this.offCourse = true; events.push({ type: 'off_course', s: q.s, lateral: q.c }); }
    } else {
      this.offCourseTimer = 0;
      if (this.offCourse) { this.offCourse = false; events.push({ type: 'back_on_course', s: q.s }); }
    }
    while (this.nextCheckpoint < this.checkpoints.length && this.maxS >= this.checkpoints[this.nextCheckpoint].distance) {
      const cp = this.checkpoints[this.nextCheckpoint++];
      const t = this.time - this.startTime;
      this.splits.push({ name: cp.name, distance: cp.distance, time: t });
      events.push({ type: 'checkpoint', name: cp.name, distance: cp.distance, time: t });
    }
    if (this.started && !this.finished && this.maxS >= this.stage.length - 3) {
      this.finished = true; this.finishTime = this.time - this.startTime;
      events.push({ type: 'stage_finish', time: this.finishTime });
    }
    return events;
  }

  get progress() { return Math.min(1, this.maxS / this.stage.length); }
  get distanceRemaining() { return Math.max(0, this.stage.length - this.s); }
  get elapsed() { return this.started ? (this.finished ? this.finishTime : this.time - this.startTime) : 0; }

  getState() {
    return {
      s: this.s, c: this.c, time: this.time, started: this.started, finished: this.finished, nextCheckpoint: this.nextCheckpoint,
      offCourseTimer: this.offCourseTimer, offCourse: this.offCourse, splits: this.splits.map((x) => ({ ...x })), onRoad: this.onRoad,
      maxS: this.maxS, startTime: this.startTime, finishTime: this.finishTime,
    };
  }
  setState(st) { Object.assign(this, st, { splits: st.splits.map((x) => ({ ...x })) }); }
}
