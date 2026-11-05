/**
 * @file /sim/config_bundle.js
 * Bundled configurations for zero-latency in-browser and Node simulation initialization.
 */
import engine from '../config/engine.json';
import drivetrain from '../config/drivetrain.json';
import chassis from '../config/chassis.json';
import tires from '../config/tires.json';
import surfaces from '../config/surfaces.json';
import damage from '../config/damage.json';
import simulation from '../config/simulation.json';
import gpsStageSchema from '../config/gps_stage_schema.json';

export const bundledConfig = {
  engine,
  drivetrain,
  chassis,
  tires,
  surfaces,
  damage,
  simulation,
  gpsStageSchema
};
