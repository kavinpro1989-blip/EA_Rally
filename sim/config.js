import { SurfaceLibrary } from '../core_physics/chassis/surface.js';

export class ConfigError extends Error {
  constructor(errors) {
    super(`Invalid configuration:\n${errors.map((e) => `  ${e}`).join('\n')}`);
    this.name = 'ConfigError';
    this.errors = errors;
  }
}

const REQUIRED = ['engine', 'drivetrain', 'chassis', 'tires', 'surfaces', 'damage', 'simulation'];

/**
 * Validate a config bundle (the parsed /config/*.json files) before building a simulation.
 * Table-shape errors are additionally thrown by the component constructors.
 * @returns {{errors:string[],warnings:string[]}}
 */
export function validateConfig(cfg) {
  const errors = [], warnings = [];
  for (const k of REQUIRED) if (!cfg[k]) errors.push(`missing config section "${k}"`);
  if (errors.length) return { errors, warnings };

  const pos = (v, path) => { if (!(typeof v === 'number' && Number.isFinite(v) && v > 0)) errors.push(`${path} must be a positive number (got ${v})`); };
  const sim = cfg.simulation;
  pos(sim.dt, 'simulation.dt');
  if (sim.dt > 0.01) errors.push(`simulation.dt = ${sim.dt} is too large for stable suspension/tyre integration (max 0.01 s)`);
  else if (sim.dt > 0.004) warnings.push(`simulation.dt = ${sim.dt}: above 4 ms accuracy degrades`);
  pos(sim.ambient?.pressure, 'simulation.ambient.pressure');
  pos(sim.ambient?.temperature, 'simulation.ambient.temperature');

  const ch = cfg.chassis;
  pos(ch.mass, 'chassis.mass'); pos(ch.wheelbase, 'chassis.wheelbase'); pos(ch.trackFront, 'chassis.trackFront');
  pos(ch.trackRear, 'chassis.trackRear'); pos(ch.cgHeight, 'chassis.cgHeight');
  if (!(ch.frontWeightFraction > 0.2 && ch.frontWeightFraction < 0.8)) errors.push('chassis.frontWeightFraction must be in (0.2, 0.8)');
  for (const ax of ['front', 'rear']) {
    const s = ch.suspension?.[ax];
    if (!s) { errors.push(`chassis.suspension.${ax} missing`); continue; }
    pos(s.springRate, `chassis.suspension.${ax}.springRate`); pos(s.travel, `chassis.suspension.${ax}.travel`);
    pos(s.motionRatio, `chassis.suspension.${ax}.motionRatio`);
    if (s.bumpStop && s.bumpStop.length >= s.travel) errors.push(`chassis.suspension.${ax}.bumpStop.length must be shorter than travel`);
    if (s.antiRollBar && s.antiRollBar.stiffness > 0) pos(s.antiRollBar.armLength, `chassis.suspension.${ax}.antiRollBar.armLength`);
  }
  for (const ax of ['front', 'rear']) {
    const name = ch.tires?.[ax];
    if (!cfg.tires.compounds?.[name]) errors.push(`chassis.tires.${ax} refers to unknown compound "${name}"`);
  }

  const dr = cfg.drivetrain;
  if (!['AWD', 'RWD', 'FWD'].includes(dr.layout)) errors.push(`drivetrain.layout must be AWD, RWD or FWD (got ${dr.layout})`);
  if (!Array.isArray(dr.transmission?.gearRatios) || dr.transmission.gearRatios.length < 1) errors.push('drivetrain.transmission.gearRatios must be a non-empty array');
  else {
    dr.transmission.gearRatios.forEach((r, i) => pos(r, `drivetrain.transmission.gearRatios[${i}]`));
    for (let i = 1; i < dr.transmission.gearRatios.length; i++) {
      if (dr.transmission.gearRatios[i] >= dr.transmission.gearRatios[i - 1]) warnings.push(`gear ratio ${i + 1} is not lower than gear ${i}`);
    }
  }
  if (!['sequential', 'hpattern'].includes(dr.transmission?.type)) errors.push('drivetrain.transmission.type must be "sequential" or "hpattern"');
  pos(dr.finalDrive?.front, 'drivetrain.finalDrive.front'); pos(dr.finalDrive?.rear, 'drivetrain.finalDrive.rear');
  for (const d of ['centerDiff', 'frontDiff', 'rearDiff']) {
    if (!['open', 'locked', 'lsd', 'viscous'].includes(dr[d]?.type)) errors.push(`drivetrain.${d}.type must be open | locked | lsd | viscous`);
  }
  if (dr.centerDiff && !(dr.centerDiff.baseSplit > 0 && dr.centerDiff.baseSplit < 1)) errors.push('drivetrain.centerDiff.baseSplit must be in (0, 1)');

  const en = cfg.engine.engine;
  pos(en?.displacement, 'engine.engine.displacement'); pos(en?.inertia, 'engine.engine.inertia');
  if (!(en?.idleRpm > en?.stallRpm)) errors.push('engine.engine.idleRpm must exceed stallRpm');
  if (cfg.engine.ecu?.revLimiter && !(cfg.engine.ecu.revLimiter.rpm > en?.idleRpm)) errors.push('ecu.revLimiter.rpm must exceed idleRpm');

  try {
    const lib = new SurfaceLibrary(cfg.surfaces);
    for (const [name, comp] of Object.entries(cfg.tires.compounds)) {
      for (const cat of lib.categories) if (comp.surfaceGrip?.[cat] === undefined) warnings.push(`tyre ${name} has no surfaceGrip for category "${cat}" (defaults to 1)`);
      pos(comp.radius, `tires.${name}.radius`); pos(comp.nominalLoad, `tires.${name}.nominalLoad`);
      if (!['pacejka', 'brush'].includes(comp.model)) errors.push(`tires.${name}.model must be pacejka or brush`);
    }
  } catch (e) { errors.push(e.message); }

  return { errors, warnings };
}

export function assertValidConfig(cfg) {
  const { errors, warnings } = validateConfig(cfg);
  if (errors.length) throw new ConfigError(errors);
  return warnings;
}
