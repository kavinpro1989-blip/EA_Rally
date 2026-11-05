import { V3 } from '../math/vec3.js';
import { Q } from '../math/quat.js';
import { G } from '../math/constants.js';
import { clamp, approach } from '../math/util.js';
import { Tire } from './tire.js';
import { AxleSuspension } from './suspension.js';
import { Aero } from './aero.js';

const FL = 0, FR = 1, RL = 2, RR = 3;
export const WHEEL_NAMES = ['FL', 'FR', 'RL', 'RR'];
const ENVELOPE_OFFSETS = [-0.55, 0, 0.55];   // sample positions along the wheel heading, in tyre radii
const ENVELOPE_CENTER = [0];

export class PhysicsStateError extends Error {
  constructor(message) { super(message); this.name = 'PhysicsStateError'; }
}

/**
 * 6-DOF sprung body + four unsprung wheel hubs.
 *
 * Frames
 *   world  : Three.js compatible, right-handed, Y up (+X east, -Z north)
 *   body   : origin at the sprung centre of gravity, +X forward, +Y up, +Z right
 *   tyre   : x along the wheel heading in the ground plane, y to the right, z = ground normal
 *
 * Every tick `computeForces` evaluates ground contact, tyre forces, suspension, aero and
 * underbody contact from the current state and stores the wheel resistance torques the
 * drivetrain needs. `integrate` then advances wheel spin, hub travel and the rigid body.
 *
 * Each hub has one DOF along the body-up (suspension) axis. The ground force on the hub is
 * split into the part along that axis (carried by hub inertia + suspension) and the part
 * perpendicular to it (transmitted rigidly to the body at the contact patch), so roll moments
 * from lateral tyre forces have the full CoG-to-ground arm.
 */
export class Chassis {
  /**
   * @param {object} cfg chassis.json
   * @param {Record<string,object>} compounds tires.json compounds
   * @param {import('./surface.js').SurfaceLibrary} surfaces
   * @param {{pressure:number,temperature:number}} ambient
   * @param {object} [setup] { compoundFront, compoundRear, pressureFrontKPa, pressureRearKPa }
   */
  constructor(cfg, compounds, surfaces, ambient, setup = {}) {
    this.cfg = cfg;
    this.surfaces = surfaces;
    this.ambient = { pressure: ambient.pressure, temperature: ambient.temperature };
    const L = cfg.wheelbase;
    const muF = cfg.unsprungMass.front, muR = cfg.unsprungMass.rear;
    const Mtot = cfg.mass;
    this.totalMass = Mtot;
    this.sprungMass = Mtot - 2 * muF - 2 * muR;
    if (!(this.sprungMass > 0)) throw new RangeError('chassis: sprung mass must be positive');
    const frontAxleMass = cfg.frontWeightFraction * Mtot;
    const ws = (frontAxleMass - 2 * muF) / this.sprungMass;  // sprung weight fraction on the front axle
    this.b = ws * L;           // sprung CoG -> rear axle
    this.a = L - this.b;       // sprung CoG -> front axle
    this.cgHeight = cfg.cgHeight;
    this.inertia = { x: cfg.inertia.roll, y: cfg.inertia.yaw, z: cfg.inertia.pitch };
    this.aero = new Aero(cfg.aero);
    this.suspension = { front: new AxleSuspension(cfg.suspension.front), rear: new AxleSuspension(cfg.suspension.rear) };

    const cf = compounds[setup.compoundFront ?? cfg.tires.front];
    const cr = compounds[setup.compoundRear ?? cfg.tires.rear];
    if (!cf || !cr) throw new RangeError(`unknown tyre compound (${setup.compoundFront ?? cfg.tires.front} / ${setup.compoundRear ?? cfg.tires.rear})`);
    const pf = setup.pressureFrontKPa ?? cfg.tires.pressureKPa.front;
    const pr = setup.pressureRearKPa ?? cfg.tires.pressureKPa.rear;

    this.wheels = [];
    const defs = [
      { name: 'FL', x: this.a, side: -1, axle: 'front', track: cfg.trackFront, comp: cf, p: pf, mu: muF },
      { name: 'FR', x: this.a, side: +1, axle: 'front', track: cfg.trackFront, comp: cf, p: pf, mu: muF },
      { name: 'RL', x: -this.b, side: -1, axle: 'rear', track: cfg.trackRear, comp: cr, p: pr, mu: muR },
      { name: 'RR', x: -this.b, side: +1, axle: 'rear', track: cfg.trackRear, comp: cr, p: pr, mu: muR },
    ];
    defs.forEach((d, i) => {
      const susp = this.suspension[d.axle];
      const tire = new Tire(d.comp, { pressureKPa: d.p, ambientK: this.ambient.temperature });
      const cornerWeight = d.axle === 'front' ? (frontAxleMass * G) / 2 : ((Mtot - frontAxleMass) * G) / 2;
      const sprungLoad = cornerWeight - d.mu * G;
      const z0 = susp.staticCompression(sprungLoad);
      const tireDef = cornerWeight / tire.verticalStiffness();
      const hubY = d.comp.radius - tireDef - this.cgHeight;   // hub height relative to sprung CoG at static ride
      this.wheels.push({
        index: i, name: d.name, side: d.side, axle: d.axle, x: d.x, zPos: d.side * d.track * 0.5,
        susp, tire, unsprungMass: d.mu, radius: d.comp.radius, inertia: d.comp.wheelInertia,
        z0, z: z0, zdot: 0, hubY0: hubY, omega: 0, angle: 0, steer: 0,
        toeDamage: 0, damperHealth: 1, staticLoad: cornerWeight,
        // per-tick outputs
        contact: false, fn: 0, fx: 0, fy: 0, mz: 0, resist: 0, patch: { x: 0, y: 0, z: 0 },
        camber: 0, toe: 0, slipRatio: 0, slipAngle: 0, gu: 0, fs: 0, suspOut: { spring: 0, damper: 0, bump: 0, total: 0 },
        arb: 0, surface: {}, rollingMoment: 0, impactEnergy: 0, shockImpulse: 0, tireDeflection: 0,
        bodyPosWorld: { x: 0, y: 0, z: 0 }, normal: { x: 0, y: 1, z: 0 }, heading: { x: 1, y: 0, z: 0 },
        rightAxis: { x: 0, y: 0, z: 1 }, terrainSample: null,
      });
    });

    // Rigid body state
    this.position = V3.create(0, this.cgHeight, 0);
    this.quaternion = Q.identity();
    this.velocity = V3.create();
    this.angularVelocity = V3.create();     // body frame [rad/s]
    this.steerAngle = 0;                    // centre road-wheel angle, + = left (CCW)
    this.steerCommand = 0;
    this.steeringTorque = 0;
    this.accelWorld = V3.create();          // last total acceleration (incl. gravity effect removed -> specific force via gSpecific)
    this.specificForce = V3.create();       // body-frame accelerometer reading (m/s^2)
    this.underbody = { force: 0, energy: 0, contact: false };
    this.aeroOut = null;
    this._F = V3.create();
    this._T = V3.create();
    this._ang = V3.create();
    this.tickImpacts = [];
    this.hullHits = [];
    this.limited = false;
  }

  /** Total weight-independent geometry helpers */
  get wheelbase() { return this.cfg.wheelbase; }

  /**
   * Put the car on the terrain, heading along compass bearing `headingRad` (0 = north, clockwise).
   * Hubs are placed at static ride height; call `settle` afterwards on uneven ground.
   */
  placeOnTerrain(terrain, x, z, headingRad, speed = 0) {
    const s = terrain.sample(x, z, 0);
    const n = V3.normalize({ x: s.nx, y: s.ny, z: s.nz }, { x: 0, y: 1, z: 0 });
    const fwdFlat = { x: Math.sin(headingRad), y: 0, z: -Math.cos(headingRad) };
    // project heading onto the tangent plane
    const f = V3.normalize(V3.reject(fwdFlat, n), fwdFlat);
    this.quaternion = Q.lookAlong(f, n);
    this.position = V3.create(x + n.x * this.cgHeight, s.height + n.y * this.cgHeight, z + n.z * this.cgHeight);
    this.velocity = V3.scale(f, speed);
    this.angularVelocity = V3.create();
    this.steerAngle = 0;
    for (const w of this.wheels) {
      w.z = w.z0; w.zdot = 0; w.omega = speed / w.radius; w.angle = 0; w.steer = 0;
      w.tire.reset();
    }
  }

  /** Step the chassis alone (no drivetrain, no brakes) so the suspension settles on uneven ground. */
  settle(terrain, seconds, dt = 0.002) {
    const zero = [0, 0, 0, 0];
    for (let t = 0; t < seconds; t += dt) {
      this.computeForces(dt, { steer: 0 }, terrain);
      this.integrate(dt, zero, zero);
    }
  }

  /** Steered road-wheel angle for each front wheel (bicycle angle + Ackermann geometry). */
  _wheelSteer(w) {
    if (w.axle !== 'front') return 0;
    const st = this.cfg.steering, d = this.steerAngle;
    if (Math.abs(d) < 1e-9) return 0;
    const Lb = this.cfg.wheelbase;
    const t = Math.tan(d);
    const ack = Math.atan((Lb * t) / (Lb + w.zPos * t));
    return d + st.ackermann * (ack - d);
  }

  /**
   * Evaluate all forces for the current state.
   * @param {number} dt
   * @param {{steer:number}} ctrl steer in [-1, 1], +1 = full right
   * @param {{sample:Function}} terrain
   * @param {{wind?:{x,y,z}}} [env]
   */
  computeForces(dt, ctrl, terrain, env = {}) {
    const cfg = this.cfg, st = cfg.steering;
    const q = this.quaternion;
    const B = Q.toBasis(q);
    const up = B.y;
    const wBody = this.angularVelocity;
    const wWorld = Q.rotate(q, wBody);

    // --- steering with rate limit, speed-sensitive lock reduction ------------------------------
    const vFwd = V3.dot(this.velocity, B.x);
    const lockScale = 1 - st.speedReduction * clamp(Math.abs(vFwd) / st.speedReductionRef, 0, 1);
    this.steerCommand = clamp(ctrl.steer ?? 0, -1, 1);
    const target = -this.steerCommand * ((st.maxWheelAngleDeg * Math.PI) / 180) * lockScale;
    this.steerAngle = approach(this.steerAngle, target, st.rate * dt);

    let Fx = 0, Fy = -this.sprungMass * G, Fz = 0;
    let Tx = 0, Ty = 0, Tz = 0;
    const addForce = (f, r) => { // force f at world offset r from the CoG
      Fx += f.x; Fy += f.y; Fz += f.z;
      Tx += r.y * f.z - r.z * f.y;
      Ty += r.z * f.x - r.x * f.z;
      Tz += r.x * f.y - r.y * f.x;
    };

    this.tickImpacts.length = 0;
    this.steeringTorque = 0;
    const amb = this.ambient;

    // Suspension forces first (ARB needs both sides)
    for (const w of this.wheels) {
      w.susp.cornerForce(w.z, w.zdot, w.damperHealth, w.suspOut);
    }
    for (const [l, r] of [[FL, FR], [RL, RR]]) {
      const wl = this.wheels[l], wr = this.wheels[r];
      const f = wl.susp.arbForce(wl.z, wr.z);
      wl.arb = f; wr.arb = -f;
    }

    for (const w of this.wheels) {
      const susp = w.susp;
      w.fs = w.suspOut.total + w.arb;

      // hub position & velocity
      const hubBody = { x: w.x, y: w.hubY0 + (w.z - w.z0), z: w.zPos };
      const rHub = Q.rotate(q, hubBody);
      const pHub = V3.add(this.position, rHub);
      const vHub = V3.add(V3.add(this.velocity, V3.cross(wWorld, rHub)), V3.scale(up, w.zdot));
      w.bodyPosWorld = pHub;

      // suspension force on the body at the hub axis position (vertical along body up)
      addForce(V3.scale(up, w.fs), rHub);

      // ground contact: the tyre is a disc, so sample the terrain around its circumference and take the deepest
      // penetration (envelope). The contact normal is the surface normal where that deepest contact occurs, so a
      // rock face pushes the wheel up-and-back instead of acting like a vertical step under the hub centre.
      const fwdFlat = V3.normalize({ x: B.x.x, y: 0, z: B.x.z }, { x: 1, y: 0, z: 0 });
      let gs = null, n = null, dist = 0, delta = -Infinity;
      const offsets = terrain.envelope === false ? ENVELOPE_CENTER : ENVELOPE_OFFSETS;
      for (let k = 0; k < offsets.length; k++) {
        const off = offsets[k] * w.radius;
        const sx = pHub.x + fwdFlat.x * off, sz = pHub.z + fwdFlat.z * off;
        const g = terrain.sample(sx, sz, w.index, pHub.y);
        const nn = V3.normalize({ x: g.nx, y: g.ny, z: g.nz }, { x: 0, y: 1, z: 0 });
        const dd = (pHub.x - sx) * nn.x + (pHub.y - g.height) * nn.y + (pHub.z - sz) * nn.z;
        const dl = w.radius - dd;
        if (dl > delta) { delta = dl; gs = g; n = nn; dist = dd; }
      }
      w.terrainSample = gs;
      w.tireDeflection = Math.max(delta, 0);
      w.impactEnergy = 0; w.shockImpulse = 0;

      // wheel axis, camber, toe, steer
      w.camber = susp.camberAt(w.z, w.z0);
      w.toe = susp.toeAt(w.z, w.z0) * w.side + w.toeDamage;   // + toe-in rotates the right wheel CCW (left wheel CW)
      w.steer = this._wheelSteer(w);
      const psi = w.steer + w.toe;
      const cg = Math.cos(w.camber), sg = Math.sin(w.camber);
      const axisBody = { x: cg * Math.sin(psi), y: -w.side * sg, z: cg * Math.cos(psi) };
      const axisW = Q.rotate(q, axisBody);

      if (delta > 0) {
        w.contact = true;
        const vn = V3.dot(vHub, n);
        const ddelta = -vn;
        const tire = w.tire, tc = tire.cfg;
        const kz = tire.verticalStiffness();
        let fn = kz * delta + tc.verticalDamping * ddelta;
        if (delta > tc.bottomOutDeflection) fn += 12 * kz * (delta - tc.bottomOutDeflection);
        fn = clamp(fn, 0, cfg.limits?.maxTireLoad ?? 90000);
        w.fn = fn;

        const rproj = V3.normalize(V3.reject(axisW, n), up);
        const fwd = V3.cross(n, rproj);
        w.heading = fwd; w.rightAxis = rproj; w.normal = n;
        const outward = V3.dot({ x: axisW.x * w.side, y: axisW.y * w.side, z: axisW.z * w.side }, n);
        const gammaOut = Math.asin(clamp(-outward, -1, 1));
        const gammaRight = w.side * gammaOut;

        const vcx = V3.dot(vHub, fwd), vcy = V3.dot(vHub, rproj);
        const Re = w.radius - delta / 3;
        const Rl = w.radius - delta;
        this.surfaces.resolve(gs.layers, tire.cfg.surfaceGrip, amb.temperature, w.surface);
        const airSpeed = Math.hypot(this.velocity.x, this.velocity.z);
        const o = tire.step(dt, {
          fz: fn, vcx, vcy, omega: w.omega, re: Re, camber: gammaRight, surface: w.surface, airSpeed,
        });
        w.fx = o.fx; w.fy = o.fy; w.mz = o.mz; w.rollingMoment = o.rollingMoment;
        w.slipRatio = o.kappa; w.slipAngle = Math.atan(o.tanAlpha);
        w.resist = -o.fx * Rl - o.rollingMoment;

        // ground force on the hub
        const G3 = {
          x: fn * n.x + o.fx * fwd.x + o.fy * rproj.x,
          y: fn * n.y + o.fx * fwd.y + o.fy * rproj.y,
          z: fn * n.z + o.fx * fwd.z + o.fy * rproj.z,
        };
        const gu = V3.dot(G3, up);
        w.gu = gu;
        const perp = V3.addScaled(G3, up, -gu);
        const pc = V3.addScaled(pHub, n, -dist);       // contact patch
        w.patch = pc;
        addForce(perp, V3.sub(pc, this.position));
        // self-aligning moment about the surface normal
        Tx += n.x * o.mz; Ty += n.y * o.mz; Tz += n.z * o.mz;
        if (w.axle === 'front') this.steeringTorque += o.mz;

        // impact bookkeeping for the damage model
        const hard = 3.2 * w.staticLoad;
        if (fn > hard) w.shockImpulse = (fn - hard) * dt;
      } else {
        w.contact = false; w.fn = 0; w.gu = 0; w.fx = 0; w.fy = 0; w.mz = 0; w.rollingMoment = 0;
        w.slipRatio = 0; w.slipAngle = 0; w.resist = 0;
        w.patch = V3.addScaled(pHub, up, -w.radius);
        // keep the tyre relaxing & cooling while airborne
        this.surfaces.resolve(gs.layers, w.tire.cfg.surfaceGrip, amb.temperature, w.surface);
        w.tire.step(dt, { fz: 0, vcx: 0, vcy: 0, omega: w.omega, re: w.radius, camber: 0, surface: w.surface, airSpeed: Math.hypot(this.velocity.x, this.velocity.z) });
      }

      // energy absorbed by bump stop / end stop (damage input)
      if (w.suspOut.bump > 0 && w.zdot > 0) w.impactEnergy = w.suspOut.bump * w.zdot * dt;
    }

    // --- aerodynamics ---------------------------------------------------------------------------
    const wind = env.wind ?? { x: 0, y: 0, z: 0 };
    const vAirWorld = V3.sub(wind, this.velocity);
    const vAirBody = Q.rotateInv(q, vAirWorld);
    const ae = this.aero.loads(vAirBody, amb);
    this.aeroOut = ae;
    const dragH = cfg.aero.dragHeight ?? 0;
    addForce(Q.rotate(q, { x: ae.fx, y: 0, z: ae.fz }), Q.rotate(q, { x: 0, y: dragH, z: 0 }));
    addForce(Q.rotate(q, { x: 0, y: -ae.downforceFront, z: 0 }), Q.rotate(q, { x: this.a, y: 0, z: 0 }));
    addForce(Q.rotate(q, { x: 0, y: -ae.downforceRear, z: 0 }), Q.rotate(q, { x: -this.b, y: 0, z: 0 }));

    // --- underbody (skid plate) contact -------------------------------------------------------------
    const ub = cfg.underbody;
    this.underbody.force = 0; this.underbody.energy = 0; this.underbody.contact = false;
    for (const xs of [ub.frontX, ub.rearX]) {
      const pb = { x: xs, y: -(this.cgHeight - ub.groundClearance), z: 0 };
      const r = Q.rotate(q, pb);
      const p = V3.add(this.position, r);
      const gs = terrain.sample(p.x, p.z, 4, p.y);
      const n = V3.normalize({ x: gs.nx, y: gs.ny, z: gs.nz }, { x: 0, y: 1, z: 0 });
      const pen = -((p.y - gs.height) * n.y);
      if (pen > 0) {
        const v = V3.add(this.velocity, V3.cross(wWorld, r));
        const vn = V3.dot(v, n);
        const fn = Math.max(0, ub.stiffness * pen - ub.damping * vn);
        const vt = V3.reject(v, n);
        const vtl = V3.length(vt);
        const ft = V3.scale(vt, -ub.friction * fn / Math.max(vtl, 0.5));
        addForce(V3.add(V3.scale(n, fn), ft), r);
        this.underbody.force += fn; this.underbody.contact = true;
        this.underbody.energy += fn * Math.max(0, -vn) * dt;     // work done by the ground against the body's approach
      }
    }

    // --- body hull contact (bumpers, roof): only evaluated when the car is airborne or well off its wheels,
    // so a rolled car lies on its roof instead of sinking into the terrain.
    this.hullHits.length = 0;
    const hull = cfg.hull;
    if (hull) {
      let contacts = 0;
      for (const w of this.wheels) if (w.contact) contacts++;
      const needHull = up.y < 0.75 || contacts === 0 || this.underbody.contact;
      if (needHull) {
        for (const hp of hull.points) {
          const r = Q.rotate(q, hp);
          const p = V3.add(this.position, r);
          const gs = terrain.sample(p.x, p.z, 5, p.y);
          const n = V3.normalize({ x: gs.nx, y: gs.ny, z: gs.nz }, { x: 0, y: 1, z: 0 });
          const pen = -((p.y - gs.height) * n.y);
          if (pen > 0) {
            const v = V3.add(this.velocity, V3.cross(wWorld, r));
            const vn = V3.dot(v, n);
            const fn = Math.max(0, hull.stiffness * pen - hull.damping * vn);
            const vt = V3.reject(v, n);
            const vtl = V3.length(vt);
            const ft = V3.scale(vt, -hull.friction * fn / Math.max(vtl, 0.5));
            addForce(V3.add(V3.scale(n, fn), ft), r);
            this.hullHits.push({ name: hp.name, zone: hp.zone, force: fn, energy: fn * Math.max(0, -vn) * dt });
          }
        }
      }
    }

    this._F.x = Fx; this._F.y = Fy; this._F.z = Fz;
    this._T.x = Tx; this._T.y = Ty; this._T.z = Tz;
  }

  /**
   * Advance wheel spin, hub travel and the rigid body by dt.
   * @param {number} dt
   * @param {number[]} driveTorque drivetrain torque per wheel [N m]
   * @param {number[]} brakeTorque non-negative brake torque magnitude per wheel [N m]
   */
  integrate(dt, driveTorque, brakeTorque) {
    const q = this.quaternion;
    const B = Q.toBasis(q);
    const up = B.y;
    const I = this.inertia, m = this.sprungMass;
    const F = this._F, T = this._T;

    // linear + angular acceleration of the sprung body
    const a = V3.scale(F, 1 / m);
    const tb = Q.rotateInv(q, T);
    const w = this.angularVelocity;
    const gyro = {
      x: (I.z - I.y) * w.y * w.z,
      y: (I.x - I.z) * w.z * w.x,
      z: (I.y - I.x) * w.x * w.y,
    };
    const alphaB = { x: (tb.x - gyro.x) / I.x, y: (tb.y - gyro.y) / I.y, z: (tb.z - gyro.z) / I.z };
    const wWorld = Q.rotate(q, w);
    const alphaW = Q.rotate(q, alphaB);

    // specific force for accelerometers: (a - g) in the body frame -> a_total_without_gravity
    const aSpec = V3.add(a, { x: 0, y: G, z: 0 });
    this.specificForce = Q.rotateInv(q, aSpec);
    this.accelWorld = a;

    // hubs
    for (const wh of this.wheels) {
      const hubBody = { x: wh.x, y: wh.hubY0 + (wh.z - wh.z0), z: wh.zPos };
      const r = Q.rotate(q, hubBody);
      const aMount = V3.add(V3.add(a, V3.cross(alphaW, r)), V3.cross(wWorld, V3.cross(wWorld, r)));
      const mu = wh.unsprungMass;
      const aU = (wh.gu - wh.fs - mu * G * up.y) / mu;
      const qdd = aU - V3.dot(aMount, up);
      wh.zdot += qdd * dt;
      wh.z += wh.zdot * dt;
      // hard safety clamp far beyond the stops (should never be reached with sane stiffness)
      const zmax = wh.susp.travel + 0.05, zmin = -0.05;
      if (wh.z > zmax) { wh.z = zmax; if (wh.zdot > 0) wh.zdot = 0; }
      else if (wh.z < zmin) { wh.z = zmin; if (wh.zdot < 0) wh.zdot = 0; }
    }

    // wheel spin (drive + tyre reaction + brake with no-sign-flip clamp)
    for (let i = 0; i < 4; i++) {
      const wh = this.wheels[i];
      const tau = driveTorque[i] + wh.resist;
      const Tb = Math.max(0, brakeTorque[i]);
      const J = wh.inertia;
      let om = wh.omega;
      if (Math.abs(om) < 1e-9 && Math.abs(tau) <= Tb) {
        om = 0;
      } else {
        const dir = om === 0 ? Math.sign(tau) : Math.sign(om);
        let nw = om + (dt * (tau - Tb * dir)) / J;
        if (om !== 0 && Math.sign(nw) !== Math.sign(om)) {
          nw = Math.abs(tau) <= Tb ? 0 : (dt * (tau - Tb * Math.sign(tau))) / J;
        }
        om = nw;
      }
      wh.omega = om;
      wh.angle += om * dt;
      if (wh.angle > 1e6 || wh.angle < -1e6) wh.angle %= (Math.PI * 2);
    }

    // rigid body (semi-implicit Euler)
    this.velocity = V3.addScaled(this.velocity, a, dt);
    this.angularVelocity = V3.addScaled(this.angularVelocity, alphaB, dt);
    this.limited = false;
    const lim = this.cfg.limits;
    if (lim) {
      const sp = V3.length(this.velocity);
      if (sp > lim.maxSpeed) { this.velocity = V3.scale(this.velocity, lim.maxSpeed / sp); this.limited = true; }
      const wr = V3.length(this.angularVelocity);
      if (wr > lim.maxAngularRate) { this.angularVelocity = V3.scale(this.angularVelocity, lim.maxAngularRate / wr); this.limited = true; }
    }
    this.position = V3.addScaled(this.position, this.velocity, dt);
    const dq = Q.fromRotationVector(V3.scale(this.angularVelocity, dt));
    this.quaternion = Q.normalize(Q.mul(this.quaternion, dq));
  }

  /** Throws if any rigid-body or wheel state is non-finite (fail loudly instead of propagating NaN). */
  assertFinite(context = '') {
    const bad = !V3.isFinite(this.position) || !V3.isFinite(this.velocity) || !V3.isFinite(this.angularVelocity) ||
      !Number.isFinite(this.quaternion.w) || this.wheels.some((w) => !Number.isFinite(w.z) || !Number.isFinite(w.zdot) || !Number.isFinite(w.omega));
    if (bad) throw new PhysicsStateError(`non-finite chassis state ${context}`.trim());
  }

  /**
   * Apply an instantaneous impulse [N s] at a world point (collision response hook for an external
   * collision system). Returns the kinetic energy absorbed [J] so the damage model can use it.
   */
  applyImpulse(point, impulse) {
    const m = this.sprungMass + this.wheels.reduce((a, w) => a + w.unsprungMass, 0);
    const before = 0.5 * m * V3.lengthSq(this.velocity);
    this.velocity = V3.addScaled(this.velocity, impulse, 1 / m);
    const r = V3.sub(point, this.position);
    const angW = V3.cross(r, impulse);
    const angB = Q.rotateInv(this.quaternion, angW);
    this.angularVelocity = {
      x: this.angularVelocity.x + angB.x / this.inertia.x,
      y: this.angularVelocity.y + angB.y / this.inertia.y,
      z: this.angularVelocity.z + angB.z / this.inertia.z,
    };
    const after = 0.5 * m * V3.lengthSq(this.velocity);
    return Math.abs(before - after);
  }

  /** Forward speed along the body X axis [m/s]. */
  get forwardSpeed() { return V3.dot(this.velocity, Q.rotate(this.quaternion, { x: 1, y: 0, z: 0 })); }
  get speed() { return V3.length(this.velocity); }

  /** Heading (compass bearing, rad, 0 = north, clockwise), pitch (nose up +), roll (right side down +). */
  get attitude() {
    const B = Q.toBasis(this.quaternion);
    return {
      heading: Math.atan2(B.x.x, -B.x.z),
      pitch: Math.asin(clamp(B.x.y, -1, 1)),
      roll: Math.asin(clamp(-B.z.y, -1, 1)),
    };
  }

  getState() {
    return {
      position: { ...this.position }, quaternion: { ...this.quaternion }, velocity: { ...this.velocity },
      angularVelocity: { ...this.angularVelocity }, steerAngle: this.steerAngle,
      wheels: this.wheels.map((w) => ({
        z: w.z, zdot: w.zdot, omega: w.omega, angle: w.angle, toeDamage: w.toeDamage, damperHealth: w.damperHealth,
        tire: w.tire.getState(),
      })),
    };
  }
  setState(s) {
    this.position = { ...s.position }; this.quaternion = { ...s.quaternion }; this.velocity = { ...s.velocity };
    this.angularVelocity = { ...s.angularVelocity }; this.steerAngle = s.steerAngle;
    s.wheels.forEach((ws, i) => {
      const w = this.wheels[i];
      w.z = ws.z; w.zdot = ws.zdot; w.omega = ws.omega; w.angle = ws.angle; w.toeDamage = ws.toeDamage; w.damperHealth = ws.damperHealth;
      w.tire.setState(ws.tire);
    });
  }
}
