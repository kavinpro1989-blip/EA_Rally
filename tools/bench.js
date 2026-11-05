// Throughput benchmark: how many physics ticks per second does the engine sustain?
//   node tools/bench.js [seconds-of-simulated-time]

import { Simulation, Autopilot } from '../sim/index.js';
import { loadConfigDir, loadStageFile } from '../sim/config_node.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const seconds = Number(process.argv[2] ?? 30);

function bench(label, make, drive) {
  const sim = make();
  const ticks = Math.round(seconds / sim.dt);
  const t0 = performance.now();
  sim.run(ticks, () => drive(sim));
  const ms = performance.now() - t0;
  console.log(`${label.padEnd(28)} ${(ticks / (ms / 1000) / 1000).toFixed(1).padStart(7)} k ticks/s   ${(seconds / (ms / 1000)).toFixed(1).padStart(6)}x real time   ${((ms * 1000) / ticks).toFixed(1).padStart(6)} us/tick   final ${(sim.vehicle.chassis.speed * 3.6).toFixed(0)} km/h`);
}

const cfg = () => loadConfigDir(path.join(root, 'config'));
const stageJson = loadStageFile(path.join(root, 'stages', 'demo_stage.json'));

bench('flat ground, cruising', () => { const c = cfg(); const s = new Simulation(c); s.vehicle.drivetrain.transmission.reset(1); return s; }, () => ({ throttle: 0.6, steer: 0.05 }));
const ap = new Autopilot();
bench('demo stage + autopilot', () => new Simulation(cfg(), { stageJson }), (s) => ap.compute(s));
console.log(`(dt = ${new Simulation(cfg()).dt * 1000} ms; ${seconds} s of simulated time per case)`);
