import fs from 'node:fs';
import path from 'node:path';

/**
 * Node.js loaders for the /config/*.json bundle and stage files.
 *   const cfg = loadConfigDir('./config');
 */
export function loadConfigDir(dir) {
  const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  return {
    engine: read('engine.json'),
    drivetrain: read('drivetrain.json'),
    chassis: read('chassis.json'),
    tires: read('tires.json'),
    surfaces: read('surfaces.json'),
    damage: read('damage.json'),
    simulation: read('simulation.json'),
    gpsStageSchema: read('gps_stage_schema.json'),
  };
}

export function loadStageFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
