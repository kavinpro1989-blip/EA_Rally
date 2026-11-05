// Browser smoke test: boot the REAL EA Rally UI (/main.js, unmodified), install the physics engine into its real
// `physicsBridge` singleton, hold the throttle key, and record what the HUD / viewport receive.
//
//   open  /tools/ui_smoke.html  on the Vite dev server (npm run dev)
//   result: window.__smoke  (also printed in the status box)

import '/main.js';
import { physicsBridge } from '/ui_and_integration/core/physics_bridge.js';
import { eventBus, RALLY_EVENTS } from '/ui_and_integration/core/event_bus.js';
import { stateStore } from '/ui_and_integration/core/state_store.js';
import { loadConfigUrl } from '/sim/config_web.js';
import { installRallyEngine } from '/sim/ui_integration.js';
import { validateSchema } from '/systems/stage/schema_validator.js';

const status = document.getElementById('smokeStatus');
const smoke = { installed: false, frames: 0, events: {}, errors: [], schemaErrors: null, last: null, samples: [] };
window.__smoke = smoke;
const show = () => { if (status) status.textContent = JSON.stringify({ ...smoke, last: undefined, samples: smoke.samples.slice(-4) }, null, 1); };

try {
  const config = await loadConfigUrl('/config');
  const telemetrySchema = await (await fetch('/config/telemetry_schema.json')).json();
  const link = installRallyEngine(physicsBridge, { eventBus, RALLY_EVENTS, stateStore, config });
  smoke.installed = true;
  smoke.stage = link.sim.stage ? { id: link.sim.stage.id, length: Math.round(link.sim.stage.length), notes: link.sim.stage.pacenotes.length } : null;
  smoke.tuningReport = { applied: link.report.applied.length, ignored: link.report.ignored.length, warnings: link.report.warnings };
  for (const ev of Object.values(RALLY_EVENTS)) eventBus.on(ev, () => { smoke.events[ev] = (smoke.events[ev] ?? 0) + 1; });
  eventBus.on(RALLY_EVENTS.TELEMETRY_UPDATE, (t) => {
    smoke.frames++;
    smoke.last = t;
    if (smoke.frames % 30 === 0) {
      smoke.schemaErrors = validateSchema(telemetrySchema, t).slice(0, 5);
      smoke.samples.push({ f: smoke.frames, kph: t.vehicle.speedKph, rpm: t.vehicle.engineRpm, gear: t.vehicle.gear, boostBar: t.vehicle.turboBoostBar, dist: t.stageProgress.currentDistanceM, pos: t.position, yaw: t.rotation.yawDeg, fl: t.suspension.fl.travelMm, note: t.stageProgress.activePacenote?.call ?? null });
      show();
    }
  });
  window.__smokeLink = link;
} catch (err) {
  smoke.errors.push(String(err?.stack ?? err));
  show();
}
window.addEventListener('error', (e) => { smoke.errors.push(String(e.message)); show(); });
show();
