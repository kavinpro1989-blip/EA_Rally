/**
 * @file /ui_and_integration/hud/telemetry_hud.js
 * @description Master Pro-Telemetry HUD Overlay with 4-Corner Tire Temps, Boost Gauge, Tachometer, and G-Meter.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';
import { SuspensionTravelMeter } from './suspension_travel_meter.js';
import { GForceMeter } from './g_force_meter.js';
import { CoDriverOverlay } from './co_driver_overlay.js';

export class TelemetryHUD {
  constructor(containerElement) {
    this.container = containerElement;
    this.suspensionMeter = null;
    this.gForceMeter = null;
    this.coDriver = null;

    this.render();
    this._initSubmeters();
    this._bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="telemetry-hud-root" id="telemetryHudRoot">
        <!-- Top: AI Co-Driver Overlay Mount -->
        <div id="coDriverMount" class="hud-top-center"></div>

        <!-- Top Left: Stage Progress & Split Timer -->
        <div class="stage-progress-panel glass-hud-subpanel">
          <div class="stage-name-label" id="hudStageName">Col de Turini - Alpine Switchbacks</div>
          <div class="stage-time-display">
            <span class="timer-icon">⏱️</span>
            <span id="hudTimer">00:00.0</span>
          </div>
          <div class="stage-bar-track">
            <div class="stage-bar-fill" id="hudStageBar"></div>
          </div>
          <div class="stage-dist-row">
            <span id="hudCurrentDist">0.0 km</span>
            <span id="hudTotalDist">4.2 km</span>
          </div>
        </div>

        <!-- Top Right: Telemetry Controls & Camera Mode Pill -->
        <div class="hud-top-right">
          <div class="camera-mode-pill" id="hudCameraPill">CAM: CHASE</div>
          <button class="hud-icon-btn" id="btnToggleHud" title="Toggle HUD (T)">📊 HUD</button>
        </div>

        <!-- Bottom Left: 4-Corner Tire Heatmap & Suspension -->
        <div class="telemetry-corner-cluster glass-hud-panel" id="telemetryLeftCluster">
          <!-- Suspension 4-Corner Mount -->
          <div id="suspensionMount"></div>

          <!-- Tire Thermal Heatmap -->
          <div class="tire-thermal-panel glass-hud-subpanel">
            <div class="hud-subpanel-header">
              <span>TIRE CORE & SURFACE TEMPS</span>
              <span class="hud-unit">°C / PSI</span>
            </div>
            <div class="tire-grid">
              <div class="tire-cell" id="tire_fl">
                <div class="tire-id">FL</div>
                <div class="tire-temp" id="temp_fl">84°C</div>
                <div class="tire-psi" id="psi_fl">27.5 psi</div>
                <div class="tire-slip" id="slip_fl">Slip: 0°</div>
              </div>
              <div class="tire-cell" id="tire_fr">
                <div class="tire-id">FR</div>
                <div class="tire-temp" id="temp_fr">84°C</div>
                <div class="tire-psi" id="psi_fr">27.5 psi</div>
                <div class="tire-slip" id="slip_fr">Slip: 0°</div>
              </div>
              <div class="tire-cell" id="tire_rl">
                <div class="tire-id">RL</div>
                <div class="tire-temp" id="temp_rl">82°C</div>
                <div class="tire-psi" id="psi_rl">26.0 psi</div>
                <div class="tire-slip" id="slip_rl">Slip: 0°</div>
              </div>
              <div class="tire-cell" id="tire_rr">
                <div class="tire-id">RR</div>
                <div class="tire-temp" id="temp_rr">82°C</div>
                <div class="tire-psi" id="psi_rr">26.0 psi</div>
                <div class="tire-slip" id="slip_rr">Slip: 0°</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Right: Dashboard Cluster (Speed, RPM, Gear, Boost, G-Meter) -->
        <div class="telemetry-dash-cluster glass-hud-panel" id="telemetryRightCluster">
          <!-- G-Force Meter Mount -->
          <div class="g-meter-subpanel glass-hud-subpanel">
            <div class="hud-subpanel-header">
              <span>G-FORCE FRICTION</span>
            </div>
            <canvas id="gForceCanvas" class="g-force-canvas"></canvas>
          </div>

          <!-- Turbo Boost Gauge -->
          <div class="boost-subpanel glass-hud-subpanel">
            <div class="hud-subpanel-header">
              <span>TURBO BOOST</span>
              <span class="hud-unit">BAR</span>
            </div>
            <div class="boost-gauge-visual">
              <div class="boost-arc-track">
                <div class="boost-needle" id="boostNeedle"></div>
              </div>
              <div class="boost-digital-val">
                <span id="val_boost">0.00</span>
                <span class="unit">BAR</span>
              </div>
              <div class="boost-peak" id="val_peak_boost">PEAK: 2.45</div>
            </div>
          </div>

          <!-- Master Speedo & Tacho Cluster -->
          <div class="master-cluster glass-hud-subpanel">
            <!-- Shift LED Lights -->
            <div class="shift-lights-row" id="shiftLightsRow">
              <div class="shift-led green"></div>
              <div class="shift-led green"></div>
              <div class="shift-led yellow"></div>
              <div class="shift-led yellow"></div>
              <div class="shift-led red"></div>
              <div class="shift-led red flash"></div>
            </div>

            <!-- Big Gear & Speed Row -->
            <div class="cluster-main-row">
              <div class="gear-display-box">
                <span class="gear-label">GEAR</span>
                <span class="gear-val" id="hudGearVal">1</span>
              </div>
              <div class="speed-display-box">
                <span class="speed-val" id="hudSpeedVal">0</span>
                <span class="speed-unit">KM/H</span>
              </div>
            </div>

            <!-- RPM Progress Arc -->
            <div class="rpm-bar-container">
              <div class="rpm-bar-fill" id="hudRpmFill"></div>
              <div class="rpm-text-row">
                <span>0</span>
                <span id="hudRpmText">1200 RPM</span>
                <span class="redline">8.4k</span>
              </div>
            </div>

            <!-- Pedals Inputs -->
            <div class="pedal-inputs-row">
              <div class="pedal-bar throttle" title="Throttle"><div id="pedal_thr"></div></div>
              <div class="pedal-bar brake" title="Brake"><div id="pedal_brk"></div></div>
              <div class="pedal-bar handbrake" title="Handbrake"><div id="pedal_hb"></div></div>
            </div>
          </div>
        </div>

        <!-- Hotkey Tips Bar -->
        <div class="hotkey-tips-bar">
          <span>🎮 <strong>W/S</strong>: Throttle/Brake</span>
          <span><strong>A/D</strong>: Steer</span>
          <span><strong>SPACE</strong>: Handbrake</span>
          <span><strong>Q/E</strong>: Gear Shift</span>
          <span><strong>C</strong>: Cam Mode</span>
          <span><strong>T</strong>: Toggle HUD</span>
          <span><strong>R</strong>: Reset Track</span>
        </div>
      </div>
    `;
  }

  _initSubmeters() {
    // 1. Suspension Travel
    const suspMount = this.container.querySelector('#suspensionMount');
    if (suspMount) {
      this.suspensionMeter = new SuspensionTravelMeter(suspMount);
    }

    // 2. G-Force Accelerometer
    const gCanvas = this.container.querySelector('#gForceCanvas');
    if (gCanvas) {
      this.gForceMeter = new GForceMeter(gCanvas);
    }

    // 3. AI Co-Driver Overlay
    const coMount = this.container.querySelector('#coDriverMount');
    if (coMount) {
      this.coDriver = new CoDriverOverlay(coMount);
    }
  }

  _bindEvents() {
    // Telemetry Broadcast Listener
    eventBus.on(RALLY_EVENTS.TELEMETRY_UPDATE, (telemetry) => {
      this.update(telemetry);
    });

    // Camera view changes
    eventBus.on(RALLY_EVENTS.CAMERA_VIEW_CHANGED, ({ mode }) => {
      const pill = this.container.querySelector('#hudCameraPill');
      if (pill) pill.textContent = `CAM: ${mode.toUpperCase()}`;
    });

    // Stage changes
    eventBus.on(RALLY_EVENTS.STAGE_SELECTED, ({ stage }) => {
      const name = this.container.querySelector('#hudStageName');
      if (name) name.textContent = stage.name;
    });

    // Toggle HUD button
    const btnToggle = this.container.querySelector('#btnToggleHud');
    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        stateStore.hudSettings.showTelemetry = !stateStore.hudSettings.showTelemetry;
        this.setVisibility(stateStore.hudSettings.showTelemetry);
      });
    }

    eventBus.on(RALLY_EVENTS.HUD_VISIBILITY_TOGGLED, ({ showTelemetry }) => {
      this.setVisibility(showTelemetry);
    });
  }

  setVisibility(visible) {
    const left = this.container.querySelector('#telemetryLeftCluster');
    const right = this.container.querySelector('#telemetryRightCluster');
    if (left) left.style.display = visible ? 'flex' : 'none';
    if (right) right.style.display = visible ? 'flex' : 'none';
  }

  update(telemetry) {
    if (!telemetry) return;

    const { vehicle, suspension, tires, gForces, stageProgress } = telemetry;

    // 1. Update Sub-meters
    if (this.suspensionMeter) this.suspensionMeter.update(suspension);
    if (this.gForceMeter) this.gForceMeter.update(gForces);
    if (this.coDriver) this.coDriver.update(telemetry);

    // 2. Dashboard Cluster: Gear, Speed, RPM
    const gearEl = this.container.querySelector('#hudGearVal');
    if (gearEl) {
      gearEl.textContent = vehicle.gear === 0 ? 'N' : vehicle.gear === -1 ? 'R' : vehicle.gear;
    }

    const speedEl = this.container.querySelector('#hudSpeedVal');
    if (speedEl) {
      speedEl.textContent = Math.round(vehicle.speedKph);
    }

    const rpmFill = this.container.querySelector('#hudRpmFill');
    const rpmText = this.container.querySelector('#hudRpmText');
    if (rpmFill && rpmText) {
      const rpm = vehicle.engineRpm || 1200;
      const rpmPct = Math.min(100, Math.round((rpm / 8400) * 100));
      rpmFill.style.width = `${rpmPct}%`;
      rpmText.textContent = `${rpm} RPM`;

      if (rpm > 7800) {
        rpmFill.style.backgroundColor = '#ff1744';
      } else if (rpm > 6500) {
        rpmFill.style.backgroundColor = '#ffd600';
      } else {
        rpmFill.style.backgroundColor = '#00e676';
      }
    }

    // Shift Light LEDs
    const leds = this.container.querySelectorAll('.shift-led');
    const rpm = vehicle.engineRpm || 1200;
    leds.forEach((led, i) => {
      const threshold = 5500 + i * 450;
      if (rpm >= threshold) {
        led.classList.add('lit');
      } else {
        led.classList.remove('lit');
      }
    });

    // 3. Turbo Boost Gauge
    const boostNeedle = this.container.querySelector('#boostNeedle');
    const boostVal = this.container.querySelector('#val_boost');
    const peakBoostVal = this.container.querySelector('#val_peak_boost');

    if (boostVal) boostVal.textContent = vehicle.turboBoostBar.toFixed(2);
    if (peakBoostVal) peakBoostVal.textContent = `PEAK: ${vehicle.peakBoostBar.toFixed(2)}`;
    if (boostNeedle) {
      // Rotate needle -90deg to +90deg based on 0 to 3.0 bar
      const needleDeg = -90 + (vehicle.turboBoostBar / 3.0) * 180;
      boostNeedle.style.transform = `rotate(${needleDeg}deg)`;
    }

    // 4. Pedal Inputs
    const pThr = this.container.querySelector('#pedal_thr');
    const pBrk = this.container.querySelector('#pedal_brk');
    const pHb = this.container.querySelector('#pedal_hb');

    if (pThr) pThr.style.height = `${vehicle.throttle * 100}%`;
    if (pBrk) pBrk.style.height = `${vehicle.brake * 100}%`;
    if (pHb) pHb.style.height = `${vehicle.handbrake * 100}%`;

    // 5. Tire Heatmap Colors & Readings
    for (const id of ['fl', 'fr', 'rl', 'rr']) {
      const tire = tires[id];
      if (!tire) continue;

      const cell = this.container.querySelector(`#tire_${id}`);
      const tempText = this.container.querySelector(`#temp_${id}`);
      const psiText = this.container.querySelector(`#psi_${id}`);
      const slipText = this.container.querySelector(`#slip_${id}`);

      if (tempText) tempText.textContent = `${Math.round(tire.surfaceTempC)}°C`;
      if (psiText) psiText.textContent = `${tire.pressurePsi} psi`;
      if (slipText) slipText.textContent = `Slip: ${tire.slipAngleDeg}°`;

      if (cell) {
        // Thermal gradient color mapping
        if (tire.surfaceTempC < 65) {
          cell.style.borderColor = '#29b6f6'; // Cold
        } else if (tire.surfaceTempC <= 95) {
          cell.style.borderColor = '#00e676'; // Optimal green
        } else if (tire.surfaceTempC <= 110) {
          cell.style.borderColor = '#ffd600'; // Hot
        } else {
          cell.style.borderColor = '#ff1744'; // Overheated
        }
      }
    }

    // 6. Stage Progress & Elapsed Time
    if (stageProgress) {
      const curDist = this.container.querySelector('#hudCurrentDist');
      const totalDist = this.container.querySelector('#hudTotalDist');
      const barFill = this.container.querySelector('#hudStageBar');
      const timer = this.container.querySelector('#hudTimer');

      if (curDist) curDist.textContent = `${(stageProgress.currentDistanceM / 1000).toFixed(2)} km`;
      if (totalDist) totalDist.textContent = `${(stageProgress.totalDistanceM / 1000).toFixed(2)} km`;
      if (barFill) barFill.style.width = `${stageProgress.progressPercent}%`;

      if (timer && stageProgress.elapsedTimeSec !== undefined) {
        const mins = Math.floor(stageProgress.elapsedTimeSec / 60);
        const secs = (stageProgress.elapsedTimeSec % 60).toFixed(1);
        timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;
      }
    }
  }
}
