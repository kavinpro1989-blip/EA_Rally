import { Q } from '../core_physics/math/quat.js';
import { V3 } from '../core_physics/math/vec3.js';
import { G, RADS_TO_RPM, KELVIN } from '../core_physics/math/constants.js';
import { rad2deg } from '../core_physics/math/util.js';
import { WHEEL_NAMES } from '../core_physics/chassis/chassis.js';

export const TELEMETRY_SCHEMA = 'ea-rally/telemetry@1';

const c = (k) => k - KELVIN;
const num = (x) => (Number.isFinite(x) ? x : 0);

/** Plain JSON-serialisable telemetry snapshot (all SI except where a key says deg / rpm / kph / C / kPa / g). */
export function buildTelemetry(sim) {
  const v = sim.vehicle, ch = v.chassis, dr = v.drivetrain, eng = dr.engine, tr = dr.transmission;
  const att = ch.attitude;
  const speed = ch.speed;
  const sf = ch.specificForce;
  const wWorld = ch.angularVelocity;
  const eo = eng.out ?? {};
  const turbo = eng.turbo;
  const dmg = v.damage;

  const wheels = ch.wheels.map((w, i) => {
    const ts = w.terrainSample;
    return {
      name: WHEEL_NAMES[i],
      contact: w.contact,
      omega: num(w.omega), rpm: num(w.omega * RADS_TO_RPM), rimSpeedKph: num(w.omega * w.radius * 3.6),
      slipRatio: num(w.slipRatio), slipAngleDeg: num(rad2deg(w.slipAngle)),
      load: num(w.fn), fx: num(w.fx), fy: num(w.fy), aligningMoment: num(w.mz),
      steerDeg: rad2deg(w.steer), camberDeg: rad2deg(w.camber), toeDeg: rad2deg(w.toe),
      driveTorque: num(dr.driveTorque[i]), brakeTorque: num(v.brakes.torque[i]),
      position: { ...w.bodyPosWorld },
      tire: {
        surfaceTempC: c(w.tire.surfaceK), coreTempC: c(w.tire.coreK), pressureKPa: w.tire.pressurePa / 1000,
        wear: w.tire.wear, grip: num(w.tire.out.gripScale), saturation: num(w.tire.out.saturation),
        compound: w.tire.cfg.name ?? undefined,
      },
      surface: {
        type: w.surface?.dominant ?? 'unknown', friction: num(w.surface?.friction), rollingResistance: num(w.surface?.rollingResistance),
        looseDepth: num(w.surface?.looseDepth), onRoad: ts?.onRoad ?? true,
      },
      suspension: {
        compression: w.z, travel: w.susp.travel, travelFraction: w.z / w.susp.travel, velocity: w.zdot,
        springForce: w.suspOut.spring, damperForce: w.suspOut.damper, bumpStopForce: w.suspOut.bump,
        antiRollForce: w.arb, totalForce: w.fs, damperHealth: w.damperHealth,
      },
      brake: { discTempC: c(v.brakes.discK[i]), fade: v.brakes.fade[i], padWear: v.brakes.padWear[i], fluidTempC: c(v.brakes.fluidK[i]) },
    };
  });

  const stage = sim.stage ? {
    id: sim.stage.id, distance: sim.runtime.s, lateralOffset: sim.runtime.c, progress: sim.runtime.progress,
    remaining: sim.runtime.distanceRemaining, onRoad: sim.runtime.onRoad, offCourse: sim.runtime.offCourse,
    elapsed: sim.runtime.elapsed, finished: sim.runtime.finished, splits: sim.runtime.splits.map((s) => ({ ...s })),
    upcoming: sim.pacenotePlayer.upcoming(sim.runtime.s, 3).map((u) => ({ id: u.id, text: u.text, distance: u.distance })),
    speaking: sim.pacenotePlayer.current ? sim.pacenotePlayer.current.text : null,
  } : null;

  return {
    schema: TELEMETRY_SCHEMA,
    seq: sim.seq, tick: sim.tick, time: sim.time, dt: sim.dt,
    vehicle: {
      position: { ...ch.position }, quaternion: { ...ch.quaternion }, velocity: { ...ch.velocity },
      angularVelocity: { ...wWorld },
      speed, speedKph: speed * 3.6, forwardSpeed: ch.forwardSpeed,
      headingDeg: rad2deg(att.heading), pitchDeg: rad2deg(att.pitch), rollDeg: rad2deg(att.roll),
      yawRateDegS: rad2deg(wWorld.y),
      accelG: { longitudinal: sf.x / G, lateral: sf.z / G, vertical: sf.y / G },
      steering: { roadWheelDeg: rad2deg(ch.steerAngle), command: ch.steerCommand, torque: ch.steeringTorque },
      aero: ch.aeroOut ? { dragForce: -ch.aeroOut.fx, downforce: -ch.aeroOut.fy, dynamicPressure: ch.aeroOut.dynamicPressure, airDensity: ch.aeroOut.rho } : null,
      underbodyContact: ch.underbody.contact, odometer: sim.odometer,
    },
    engine: {
      rpm: eng.rpm, torque: num(eng.torque), power: num(eng.torque * eng.omega), throttlePlate: eng.thetaPlate,
      running: eng.running, stalled: eng.stalled, limiter: !!eo.limiterActive, fuelCut: !!eo.fuelCut,
      launchControl: !!eo.launchActive, antiLag: !!eo.alsActive, ignitionRetardDeg: num(eo.ignitionRetardDeg),
      manifoldKPa: eng.manifoldPa / 1000, intakeTempC: c(eng.intakeTempK), exhaustTempC: c(eng.exhaustTempK),
      fuelFlow: eng.mdotFuel, airFlow: eng.mdotAir,
      boost: {
        gaugeKPa: turbo.boostGaugePa / 1000, targetKPa: num(eo.boostTargetKPa), turboRpm: turbo.omega * RADS_TO_RPM,
        wastegate: turbo.wgOpen, wastegateDuty: num(eo.wastegateDuty), blowOff: turbo.bovOpen, surge: turbo.surge,
        pressureRatio: turbo.pressureRatio, turbineExpansionRatio: turbo.pressureRatioTurbine,
      },
    },
    drivetrain: {
      layout: dr.layout, gear: tr.gear, gearName: tr.gearName, gearRatio: tr.ratio, shifting: tr.shifting,
      clutch: {
        pedal: dr.telemetry.clutchPedal ?? 0, torque: num(dr.clutch.torque), slipRadS: num(dr.clutch.slipSpeed), slipping: dr.clutch.slipping,
        capacity: num(dr.clutch.capacityValue), wear: dr.clutch.wear, temperatureC: c(dr.clutch.temperatureK),
      },
      gearbox: { type: tr.type, wear: tr.wear },
      driveshaftTorque: num(dr.telemetry.driveshaftTorque),
      centerDiff: { couplingTorque: dr.centerDiff.couplingTorque, capacity: dr.centerDiff.capacity === Infinity ? null : dr.centerDiff.capacity, locked: dr.centerDiff.locked, speedDiff: dr.centerDiff.speedDiff, frontShare: dr.frontShare },
      frontDiff: { couplingTorque: dr.frontDiff.couplingTorque, capacity: dr.frontDiff.capacity === Infinity ? null : dr.frontDiff.capacity, locked: dr.frontDiff.locked, speedDiff: dr.frontDiff.speedDiff },
      rearDiff: { couplingTorque: dr.rearDiff.couplingTorque, capacity: dr.rearDiff.capacity === Infinity ? null : dr.rearDiff.capacity, locked: dr.rearDiff.locked, speedDiff: dr.rearDiff.speedDiff },
      wheelTorque: dr.driveTorque.map(num),
    },
    wheels,
    stage,
    damage: dmg ? dmg.summary(v) : null,
    environment: { ambientPressureKPa: v.ambient.pressure / 1000, ambientTempC: c(v.ambient.temperature), altitude: sim.altitude },
    inputs: { ...sim.inputs },
    events: sim.pendingEvents.slice(),
  };
}

/** Minimal state for a renderer: body and wheel transforms (Three.js compatible x/y/z/w quaternions). */
export function buildRenderState(sim, alpha = 0) {
  const ch = sim.vehicle.chassis;
  const prev = sim._prevRender;
  const a = Math.min(1, Math.max(0, alpha));
  let position = ch.position, quaternion = ch.quaternion;
  if (prev && a < 1) {
    position = V3.lerp(prev.position, ch.position, a);
    quaternion = slerp(prev.quaternion, ch.quaternion, a);
  }
  const wheels = ch.wheels.map((w, i) => {
    const pw = prev?.wheels[i];
    const mix = (x, y) => (pw && a < 1 ? x + (y - x) * a : y);
    const z = mix(pw?.z ?? w.z, w.z);
    const steer = mix(pw?.steer ?? w.steer, w.steer);
    const toe = mix(pw?.toe ?? w.toe, w.toe);
    const camber = mix(pw?.camber ?? w.camber, w.camber);
    const spin = mix(pw?.angle ?? w.angle, w.angle);
    const hubBody = { x: w.x, y: w.hubY0 + (z - w.z0), z: w.zPos };
    const p = V3.add(position, Q.rotate(quaternion, hubBody));
    const q = Q.mul(Q.mul(Q.mul(quaternion, Q.fromAxisAngle({ x: 0, y: 1, z: 0 }, steer + toe)),
      Q.fromAxisAngle({ x: 1, y: 0, z: 0 }, w.side * camber)), Q.fromAxisAngle({ x: 0, y: 0, z: 1 }, -spin));
    return { position: p, quaternion: q, spinAngle: spin, steerAngle: steer + toe, compression: z, radius: w.radius };
  });
  return { tick: sim.tick, time: sim.time, alpha: a, body: { position: { ...position }, quaternion: { ...quaternion } }, wheels };
}

function slerp(a, b, t) {
  let dot = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  let bx = b.x, by = b.y, bz = b.z, bw = b.w;
  if (dot < 0) { dot = -dot; bx = -bx; by = -by; bz = -bz; bw = -bw; }
  if (dot > 0.9995) {
    return Q.normalize({ x: a.x + (bx - a.x) * t, y: a.y + (by - a.y) * t, z: a.z + (bz - a.z) * t, w: a.w + (bw - a.w) * t });
  }
  const th = Math.acos(dot), s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s, wb = Math.sin(t * th) / s;
  return { x: a.x * wa + bx * wb, y: a.y * wa + by * wb, z: a.z * wa + bz * wb, w: a.w * wa + bw * wb };
}

/**
 * Duck-typed helper to push a render state onto Three.js objects without importing Three:
 *   applyRenderState(state, { body: carGroup, wheels: [flMesh, frMesh, rlMesh, rrMesh] })
 * Wheel meshes are expected to be children of the scene (world-space transforms are written).
 */
export function applyRenderState(state, targets) {
  const set = (obj, p, q) => {
    obj.position.set(p.x, p.y, p.z);
    obj.quaternion.set(q.x, q.y, q.z, q.w);
  };
  if (targets.body) set(targets.body, state.body.position, state.body.quaternion);
  if (targets.wheels) targets.wheels.forEach((o, i) => { if (o) set(o, state.wheels[i].position, state.wheels[i].quaternion); });
}
