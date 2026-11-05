import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfigDir, loadStageFile } from '../sim/config_node.js';
import { Simulation } from '../sim/index.js';
import { LocalFrame } from '../systems/stage/geo.js';

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Fresh deep copy of the shipped config bundle (tests may mutate it freely). */
export function loadCfg() {
  return JSON.parse(JSON.stringify(loadConfigDir(path.join(ROOT, 'config'))));
}

export function demoStageJson() { return loadStageFile(path.join(ROOT, 'stages', 'demo_stage.json')); }

export const AMBIENT = { pressure: 101325, temperature: 293.15 };

/** Simulation on flat ground with the given layer stack and optional tyre compound. */
export function flatSim({ layers = [{ type: 'tarmac' }], compound, pressureKPa, cfgEdit, warmK } = {}) {
  const cfg = loadCfg();
  cfg.simulation.flatTerrain = { height: 0, layers };
  cfg.simulation.ambient.altitudeCorrection = false;
  cfg.simulation.ambient.temperature = 293.15;
  if (cfgEdit) cfgEdit(cfg);
  const setup = {};
  if (compound) { setup.compoundFront = compound; setup.compoundRear = compound; }
  if (pressureKPa) { setup.pressureFrontKPa = pressureKPa; setup.pressureRearKPa = pressureKPa; }
  const sim = new Simulation(cfg, { setup });
  if (warmK) for (const w of sim.vehicle.chassis.wheels) { w.tire.surfaceK = warmK; w.tire.coreK = warmK; }
  return sim;
}

export const TARMAC_TYRE = { compound: 'rally_tarmac_18', pressureKPa: 190, warmK: 355 };

/**
 * Noise-free synthetic stage JSON built from road-book segments. Each segment is
 * ['straight', metres] | ['arc', signedAngleDeg, radius] (left positive).
 * `elevation(s)` gives metres of height above the origin.
 */
export function syntheticStage({ segments, elevation = () => 0, width = 6.5, layers, origin = { lat: 47.0, lng: 11.0, elevation: 500 }, step = 5, processing = {}, extra = {} }) {
  const frame = new LocalFrame(origin.lat, origin.lng, origin.elevation);
  const pts = [{ x: 0, z: 0 }];
  let x = 0, z = 0, heading = 0;
  for (const seg of segments) {
    const len = seg[0] === 'straight' ? seg[1] : (Math.abs(seg[1]) * Math.PI / 180) * seg[2];
    const k = seg[0] === 'straight' ? 0 : Math.sign(seg[1]) / seg[2];
    let done = 0;
    while (done < len - 1e-9) {
      const d = Math.min(step, len - done);
      heading -= k * d;
      x += Math.sin(heading) * d; z += -Math.cos(heading) * d;
      done += d;
      pts.push({ x, z });
    }
  }
  let cum = 0;
  const lat = [], lng = [], ele = [], w = [];
  pts.forEach((p, i) => {
    if (i > 0) cum += Math.hypot(p.x - pts[i - 1].x, p.z - pts[i - 1].z);
    const g = frame.toGeodetic({ x: p.x, y: elevation(cum), z: p.z });
    lat.push(g.lat); lng.push(g.lng); ele.push(g.h); w.push(width);
  });
  return {
    schemaVersion: '1.0', id: 'synthetic', name: 'Synthetic test stage', seed: 5,
    track: { lat, lng, elevation: ele, width: w },
    road: { defaultWidth: width, defaultLayers: layers ?? [{ type: 'tarmac' }], ...(extra.road ?? {}) },
    processing: { sampleSpacing: 1, horizontalSmoothing: 0, elevationSmoothing: 0, curvatureSmoothing: 4, verticalCurvatureSmoothing: 6, apexCurvatureSmoothing: 6, bankNoiseDeg: 0, ...processing },
    ...(extra.rest ?? {}),
  };
}

export function stageSim(stageJson, cfgEdit, setup) {
  const cfg = loadCfg();
  cfg.simulation.ambient.altitudeCorrection = false;
  if (cfgEdit) cfgEdit(cfg);
  return new Simulation(cfg, { stageJson, setup });
}

/** Linear regression helpers etc. */
export const near = (actual, expected, tol, label = '') => {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) throw new Error(`${label} expected ${expected} +/- ${tol}, got ${actual}`);
};
