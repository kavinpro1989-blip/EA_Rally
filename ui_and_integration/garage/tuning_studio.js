/**
 * @file /ui_and_integration/garage/tuning_studio.js
 * @description 3D Garage Mechanical Tuning Studio & Vehicle Schema Live Editor.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';
import { PartCustomizer } from './part_customizer.js';
import { DynoChart } from './dyno_chart.js';

export class TuningStudio {
  constructor(containerElement) {
    this.container = containerElement;
    this.dynoChart = null;
    this.partCustomizer = null;

    this.render();
    this._initSubcomponents();
    this._bindEvents();
  }

  render() {
    const t = stateStore.currentTuning;
    const susp = t.suspension || {};
    const diff = t.differential || {};
    const trans = t.transmission || {};
    const tb = t.tires_and_brakes || {};

    this.container.innerHTML = `
      <div class="tuning-studio-container glass-panel">
        <div class="studio-header">
          <div class="header-left">
            <span class="icon">🔧</span>
            <h2>3D GARAGE & MECHANICAL TUNING STUDIO</h2>
          </div>
          <div class="header-actions">
            <button id="btnExportTuningJson" class="rally-btn secondary">📥 Export JSON</button>
            <button id="btnResetDefaults" class="rally-btn secondary">Reset Setup</button>
            <button id="btnApplyAndDrive" class="rally-btn primary pulse">🏎️ Drive Active Setup</button>
          </div>
        </div>

        <!-- Preset Quick Bar -->
        <div class="tuning-presets-bar">
          <span class="bar-title">TUNING PRESETS:</span>
          <div class="preset-pill-list" id="presetPillsList">
            <button class="preset-pill ${stateStore.activeProfile === 'asphalt_monte_carlo' ? 'active' : ''}" data-preset="asphalt_monte_carlo">Monte Carlo Tarmac</button>
            <button class="preset-pill ${stateStore.activeProfile === 'gravel_finland_jumps' ? 'active' : ''}" data-preset="gravel_finland_jumps">Finland Jumps</button>
            <button class="preset-pill ${stateStore.activeProfile === 'acropolis_rocky_gravel' ? 'active' : ''}" data-preset="acropolis_rocky_gravel">Acropolis Gravel</button>
            <button class="preset-pill ${stateStore.activeProfile === 'monte_carlo_night_ice' ? 'active' : ''}" data-preset="monte_carlo_night_ice">Col de Turini Ice</button>
          </div>
        </div>

        <div class="tuning-studio-grid">
          <!-- Column 1: Mechanical Tuning Sliders -->
          <div class="mechanical-sliders-panel">
            <!-- Tabs -->
            <div class="tuning-subtabs">
              <button class="subtab-btn active" data-subtab="tab-suspension">Suspension</button>
              <button class="subtab-btn" data-subtab="tab-diff">Differential</button>
              <button class="subtab-btn" data-subtab="tab-gears">Gears & Dyno</button>
              <button class="subtab-btn" data-subtab="tab-tires">Tires & Brakes</button>
            </div>

            <!-- Tab Content: Suspension -->
            <div id="tab-suspension" class="tuning-tab-content active">
              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Spring Rate:</span>
                  <span class="slider-val" id="val_frontSpringRate">${susp.frontSpringRate || 95} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="50" max="150" step="1" value="${susp.frontSpringRate || 95}" data-sec="suspension" data-key="frontSpringRate" data-unit="N/mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Spring Rate:</span>
                  <span class="slider-val" id="val_rearSpringRate">${susp.rearSpringRate || 85} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="45" max="140" step="1" value="${susp.rearSpringRate || 85}" data-sec="suspension" data-key="rearSpringRate" data-unit="N/mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Ride Height:</span>
                  <span class="slider-val" id="val_frontRideHeight">${susp.frontRideHeight || 140} mm</span>
                </div>
                <input type="range" class="rally-slider" min="90" max="210" step="2" value="${susp.frontRideHeight || 140}" data-sec="suspension" data-key="frontRideHeight" data-unit="mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Ride Height:</span>
                  <span class="slider-val" id="val_rearRideHeight">${susp.rearRideHeight || 150} mm</span>
                </div>
                <input type="range" class="rally-slider" min="95" max="220" step="2" value="${susp.rearRideHeight || 150}" data-sec="suspension" data-key="rearRideHeight" data-unit="mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Bump Damping:</span>
                  <span class="slider-val" id="val_frontBumpDamping">${susp.frontBumpDamping || 4200} N·s/m</span>
                </div>
                <input type="range" class="rally-slider" min="2000" max="7000" step="50" value="${susp.frontBumpDamping || 4200}" data-sec="suspension" data-key="frontBumpDamping" data-unit="N·s/m" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Rebound Damping:</span>
                  <span class="slider-val" id="val_frontReboundDamping">${susp.frontReboundDamping || 5800} N·s/m</span>
                </div>
                <input type="range" class="rally-slider" min="3000" max="8500" step="50" value="${susp.frontReboundDamping || 5800}" data-sec="suspension" data-key="frontReboundDamping" data-unit="N·s/m" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Anti-Roll Bar:</span>
                  <span class="slider-val" id="val_frontAntiRollBar">${susp.frontAntiRollBar || 48} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="15" max="75" step="1" value="${susp.frontAntiRollBar || 48}" data-sec="suspension" data-key="frontAntiRollBar" data-unit="N/mm" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Anti-Roll Bar:</span>
                  <span class="slider-val" id="val_rearAntiRollBar">${susp.rearAntiRollBar || 38} N/mm</span>
                </div>
                <input type="range" class="rally-slider" min="10" max="65" step="1" value="${susp.rearAntiRollBar || 38}" data-sec="suspension" data-key="rearAntiRollBar" data-unit="N/mm" />
              </div>
            </div>

            <!-- Tab Content: Differential -->
            <div id="tab-diff" class="tuning-tab-content">
              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Accel Lock:</span>
                  <span class="slider-val" id="val_frontAccelLock">${diff.frontAccelLock || 55}%</span>
                </div>
                <input type="range" class="rally-slider" min="10" max="100" step="1" value="${diff.frontAccelLock || 55}" data-sec="differential" data-key="frontAccelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Decel Lock:</span>
                  <span class="slider-val" id="val_frontDecelLock">${diff.frontDecelLock || 25}%</span>
                </div>
                <input type="range" class="rally-slider" min="5" max="90" step="1" value="${diff.frontDecelLock || 25}" data-sec="differential" data-key="frontDecelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Center Torque Split (Front / Rear):</span>
                  <span class="slider-val" id="val_centerTorqueSplitFront">${diff.centerTorqueSplitFront || 42}% / ${100 - (diff.centerTorqueSplitFront || 42)}%</span>
                </div>
                <input type="range" class="rally-slider" min="20" max="60" step="1" value="${diff.centerTorqueSplitFront || 42}" data-sec="differential" data-key="centerTorqueSplitFront" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Accel Lock:</span>
                  <span class="slider-val" id="val_rearAccelLock">${diff.rearAccelLock || 75}%</span>
                </div>
                <input type="range" class="rally-slider" min="20" max="100" step="1" value="${diff.rearAccelLock || 75}" data-sec="differential" data-key="rearAccelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Decel Lock:</span>
                  <span class="slider-val" id="val_rearDecelLock">${diff.rearDecelLock || 40}%</span>
                </div>
                <input type="range" class="rally-slider" min="10" max="95" step="1" value="${diff.rearDecelLock || 40}" data-sec="differential" data-key="rearDecelLock" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Diff Preload:</span>
                  <span class="slider-val" id="val_rearPreloadNm">${diff.rearPreloadNm || 90} N·m</span>
                </div>
                <input type="range" class="rally-slider" min="20" max="220" step="5" value="${diff.rearPreloadNm || 90}" data-sec="differential" data-key="rearPreloadNm" data-unit="N·m" />
              </div>
            </div>

            <!-- Tab Content: Transmission & Dyno -->
            <div id="tab-gears" class="tuning-tab-content">
              <div class="slider-group">
                <div class="slider-header">
                  <span>Final Drive Ratio:</span>
                  <span class="slider-val" id="val_finalDriveRatio">${trans.finalDriveRatio || 4.18}</span>
                </div>
                <input type="range" class="rally-slider" min="3.2" max="5.5" step="0.02" value="${trans.finalDriveRatio || 4.18}" data-sec="transmission" data-key="finalDriveRatio" data-unit="" />
              </div>

              <div class="dyno-mount-wrapper">
                <canvas id="dynoCanvas" class="dyno-canvas"></canvas>
              </div>

              <div class="gear-sliders-grid">
                ${(trans.gearRatios || [3.45, 2.38, 1.76, 1.35, 1.08, 0.89]).map((ratio, i) => `
                  <div class="slider-group-small">
                    <span>G${i + 1}: <strong id="val_gear_${i}">${ratio}</strong></span>
                    <input type="range" class="rally-slider-gear" min="0.6" max="4.2" step="0.01" value="${ratio}" data-gear-idx="${i}" />
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Tab Content: Tires & Brakes -->
            <div id="tab-tires" class="tuning-tab-content">
              <div class="form-row">
                <label>Tire Compound Specification</label>
                <select id="selectTireCompound" class="rally-select">
                  <option value="soft_tarmac" ${tb.tireCompound === 'soft_tarmac' ? 'selected' : ''}>Soft Tarmac (Maximum Asphalt Grip)</option>
                  <option value="hard_tarmac" ${tb.tireCompound === 'hard_tarmac' ? 'selected' : ''}>Hard Tarmac (Endurance Heat Resistance)</option>
                  <option value="gravel_rough" ${tb.tireCompound === 'gravel_rough' ? 'selected' : ''}>Rough Gravel (Reinforced Sidewalls)</option>
                  <option value="snow_studded" ${tb.tireCompound === 'snow_studded' ? 'selected' : ''}>Studded Snow & Ice (Tungsten Studs)</option>
                </select>
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Tire Pressure:</span>
                  <span class="slider-val" id="val_frontTirePressurePsi">${tb.frontTirePressurePsi || 27.5} psi</span>
                </div>
                <input type="range" class="rally-slider" min="20.0" max="36.0" step="0.5" value="${tb.frontTirePressurePsi || 27.5}" data-sec="tires_and_brakes" data-key="frontTirePressurePsi" data-unit="psi" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Rear Tire Pressure:</span>
                  <span class="slider-val" id="val_rearTirePressurePsi">${tb.rearTirePressurePsi || 26.0} psi</span>
                </div>
                <input type="range" class="rally-slider" min="20.0" max="36.0" step="0.5" value="${tb.rearTirePressurePsi || 26.0}" data-sec="tires_and_brakes" data-key="rearTirePressurePsi" data-unit="psi" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Front Brake Bias:</span>
                  <span class="slider-val" id="val_brakeBiasFrontPercent">${tb.brakeBiasFrontPercent || 63.5}%</span>
                </div>
                <input type="range" class="rally-slider" min="50.0" max="75.0" step="0.5" value="${tb.brakeBiasFrontPercent || 63.5}" data-sec="tires_and_brakes" data-key="brakeBiasFrontPercent" data-unit="%" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Max Brake Torque:</span>
                  <span class="slider-val" id="val_maxBrakeTorqueNm">${tb.maxBrakeTorqueNm || 3800} N·m</span>
                </div>
                <input type="range" class="rally-slider" min="2400" max="5200" step="50" value="${tb.maxBrakeTorqueNm || 3800}" data-sec="tires_and_brakes" data-key="maxBrakeTorqueNm" data-unit="N·m" />
              </div>
            </div>
          </div>

          <!-- Column 2: Visual Part Customizer Mount -->
          <div id="partCustomizerMount"></div>
        </div>
      </div>
    `;
  }

  _initSubcomponents() {
    // 1. Dyno Chart
    const dynoCanvas = this.container.querySelector('#dynoCanvas');
    if (dynoCanvas) {
      this.dynoChart = new DynoChart(dynoCanvas);
      this.dynoChart.updateTuning(stateStore.currentTuning);
    }

    // 2. Part Customizer
    const customizerMount = this.container.querySelector('#partCustomizerMount');
    if (customizerMount) {
      this.partCustomizer = new PartCustomizer(customizerMount);
    }
  }

  _bindEvents() {
    // Subtab switching
    this.container.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.subtab;
        this.container.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
        this.container.querySelectorAll('.tuning-tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetContent = this.container.querySelector(`#${targetId}`);
        if (targetContent) targetContent.classList.add('active');

        if (targetId === 'tab-gears' && this.dynoChart) {
          setTimeout(() => this.dynoChart.resize(), 50);
        }
      });
    });

    // Preset Pill Clicks
    this.container.querySelectorAll('.preset-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const presetId = pill.dataset.preset;
        this.container.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        stateStore.loadTuningPreset(presetId);
        // Refresh slider values
        this.render();
        this._initSubcomponents();
        this._bindEvents();

        eventBus.emit(RALLY_EVENTS.NOTIFICATION, {
          title: 'Preset Loaded',
          message: presetId.replace(/_/g, ' ').toUpperCase()
        });
      });
    });

    // Slider inputs
    this.container.querySelectorAll('.rally-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const sec = e.target.dataset.sec;
        const key = e.target.dataset.key;
        const unit = e.target.dataset.unit || '';
        const val = parseFloat(e.target.value);

        // Update display text
        const display = this.container.querySelector(`#val_${key}`);
        if (display) {
          if (key === 'centerTorqueSplitFront') {
            display.textContent = `${val}% / ${100 - val}%`;
          } else {
            display.textContent = `${val} ${unit}`;
          }
        }

        stateStore.updateTuningParameter(sec, key, val);

        if (sec === 'transmission' && this.dynoChart) {
          this.dynoChart.updateTuning(stateStore.currentTuning);
        }
      });
    });

    // Gear Ratio Sliders
    this.container.querySelectorAll('.rally-slider-gear').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.gearIdx, 10);
        const val = parseFloat(e.target.value);

        const display = this.container.querySelector(`#val_gear_${idx}`);
        if (display) display.textContent = val.toFixed(2);

        const ratios = [...stateStore.currentTuning.transmission.gearRatios];
        ratios[idx] = val;
        stateStore.updateTuningParameter('transmission', 'gearRatios', ratios);

        if (this.dynoChart) {
          this.dynoChart.updateTuning(stateStore.currentTuning);
        }
      });
    });

    // Tire Compound Select
    const tireSelect = this.container.querySelector('#selectTireCompound');
    if (tireSelect) {
      tireSelect.addEventListener('change', (e) => {
        stateStore.updateTuningParameter('tires_and_brakes', 'tireCompound', e.target.value);
      });
    }

    // Export JSON Button
    const btnExport = this.container.querySelector('#btnExportTuningJson');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const jsonStr = stateStore.exportTuningSchemaJson();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vehicle_tuning_schema.json';
        a.click();
        URL.revokeObjectURL(url);

        eventBus.emit(RALLY_EVENTS.NOTIFICATION, {
          title: 'Exported Schema',
          message: 'Saved active setup to vehicle_tuning_schema.json'
        });
      });
    }

    // Reset Defaults Button
    const btnReset = this.container.querySelector('#btnResetDefaults');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        stateStore.loadTuningPreset('asphalt_monte_carlo');
        this.render();
        this._initSubcomponents();
        this._bindEvents();
      });
    }

    // Drive Active Setup
    const btnDrive = this.container.querySelector('#btnApplyAndDrive');
    if (btnDrive) {
      btnDrive.addEventListener('click', () => {
        stateStore.setActiveTab('stage_drive');
      });
    }
  }
}
