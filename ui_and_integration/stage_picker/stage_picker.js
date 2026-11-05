/**
 * @file /ui_and_integration/stage_picker/stage_picker.js
 * @description Interactive Google Maps Rally Stage Picker & Route Designer UI.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';
import { ElevationGraph } from './elevation_graph.js';
import { StageCompiler } from './stage_compiler.js';

export class StagePicker {
  constructor(containerElement) {
    this.container = containerElement;
    this.customWaypoints = [];
    this.isDrawing = false;
    this.elevationGraph = null;

    this.renderUI();
    this._initElevationGraph();
    this._initMapCanvas();
    this._bindEvents();
  }

  renderUI() {
    this.container.innerHTML = `
      <div class="stage-picker-container glass-panel">
        <div class="stage-picker-header">
          <div class="header-title">
            <span class="icon">📍</span>
            <h2>WRC STAGE PICKER & ROUTE PLANNER</h2>
          </div>
          <span class="badge live-badge">GPS TELEMETRY READY</span>
        </div>

        <div class="stage-picker-grid">
          <!-- Left Column: Preset Stages & Custom Setup -->
          <div class="stage-presets-panel">
            <h3 class="panel-section-title">CHAMPIONSHIP STAGES</h3>
            <div class="stage-cards-list" id="stageCardsList"></div>

            <div class="custom-route-controls glass-subpanel">
              <h3 class="panel-section-title">CUSTOM ROUTE COMPILER</h3>
              <div class="form-row">
                <label>Stage Name</label>
                <input type="text" id="customStageName" value="Monte Spline Custom Pass" class="rally-input" />
              </div>
              <div class="form-grid-2">
                <div class="form-row">
                  <label>Surface Type</label>
                  <select id="customSurfaceSelect" class="rally-select">
                    <option value="tarmac">Asphalt (High Grip)</option>
                    <option value="gravel" selected>Loose Gravel (Medium)</option>
                    <option value="rocky">Rocky Mountain (Low Grip)</option>
                    <option value="snow">Packed Snow / Ice (Slippery)</option>
                  </select>
                </div>
                <div class="form-row">
                  <label>Weather / Lighting</label>
                  <select id="customWeatherSelect" class="rally-select">
                    <option value="sunset" selected>Golden Sunset</option>
                    <option value="sunny">High Noon Sun</option>
                    <option value="night">Dark Night (Light Pods)</option>
                    <option value="overcast">Overcast Mist</option>
                  </select>
                </div>
              </div>

              <div class="map-action-buttons">
                <button id="btnResetWaypoints" class="rally-btn secondary">Clear Route</button>
                <button id="btnCompileStage" class="rally-btn primary pulse">
                  <span>⚡ Compile & Deploy Stage</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Map Canvas & Elevation Profile -->
          <div class="stage-map-panel">
            <div class="map-toolbar">
              <div class="map-mode-tabs">
                <span class="tab-label">GPS SPLINE EDITOR (Click to add waypoints, drag to adjust path)</span>
              </div>
              <div class="waypoint-counter" id="waypointCountBadge">3 Waypoints</div>
            </div>

            <div class="map-canvas-container" id="mapCanvasContainer">
              <canvas id="stageMapCanvas" class="stage-map-canvas"></canvas>
              <div class="map-overlay-instructions">
                <span>🖱️ Click canvas to add rally waypoints. Drag start/finish markers.</span>
              </div>
            </div>

            <div class="elevation-profile-container">
              <div class="profile-header">
                <h4>STAGE ELEVATION PROFILE</h4>
                <div class="elev-stats" id="elevStatsDisplay">Gain: 380m | Max Grade: 14%</div>
              </div>
              <div id="elevationGraphMount" class="elevation-graph-mount"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _initElevationGraph() {
    const mount = this.container.querySelector('#elevationGraphMount');
    if (mount) {
      this.elevationGraph = new ElevationGraph(mount);
      this.elevationGraph.setStageData(stateStore.activeStage);
    }
  }

  _initMapCanvas() {
    this.mapCanvas = this.container.querySelector('#stageMapCanvas');
    this.mapContainer = this.container.querySelector('#mapCanvasContainer');
    this.mapCtx = this.mapCanvas.getContext('2d');

    this._resizeMapCanvas();

    // Default custom waypoints matching active stage
    this._loadWaypointsFromStage(stateStore.activeStage);

    this.draggedWpIndex = -1;

    // Interactive waypoint placement & dragging
    this.mapCanvas.addEventListener('mousedown', (e) => {
      const rect = this.mapCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if clicked existing waypoint pin
      const hitRadius = 16;
      this.draggedWpIndex = this.customWaypoints.findIndex(wp => {
        return Math.hypot(wp.canvasX - clickX, wp.canvasY - clickY) < hitRadius;
      });

      if (this.draggedWpIndex === -1) {
        // Add new waypoint
        const newAlt = 1100 + Math.floor(Math.random() * 450);
        this.customWaypoints.push({
          canvasX: clickX,
          canvasY: clickY,
          lat: 43.98 + (clickY / this.mapCanvas.clientHeight) * 0.03,
          lon: 7.39 + (clickX / this.mapCanvas.clientWidth) * 0.03,
          alt: newAlt
        });
        this._updateWaypointBadge();
        this.drawMap();
        this._previewCustomStage();
      }
    });

    this.mapCanvas.addEventListener('mousemove', (e) => {
      if (this.draggedWpIndex !== -1) {
        const rect = this.mapCanvas.getBoundingClientRect();
        const moveX = e.clientX - rect.left;
        const moveY = e.clientY - rect.top;

        const wp = this.customWaypoints[this.draggedWpIndex];
        wp.canvasX = moveX;
        wp.canvasY = moveY;
        wp.lat = 43.98 + (moveY / this.mapCanvas.clientHeight) * 0.03;
        wp.lon = 7.39 + (moveX / this.mapCanvas.clientWidth) * 0.03;

        this.drawMap();
        this._previewCustomStage();
      }
    });

    window.addEventListener('mouseup', () => {
      this.draggedWpIndex = -1;
    });

    window.addEventListener('resize', () => {
      this._resizeMapCanvas();
      this.drawMap();
    });
  }

  _resizeMapCanvas() {
    if (!this.mapCanvas || !this.mapContainer) return;
    const w = this.mapContainer.clientWidth || 640;
    const h = this.mapContainer.clientHeight || 320;
    const dpr = window.devicePixelRatio || 1;

    this.mapCanvas.width = w * dpr;
    this.mapCanvas.height = h * dpr;
    this.mapCanvas.style.width = `${w}px`;
    this.mapCanvas.style.height = `${h}px`;
    this.mapCtx.scale(dpr, dpr);
  }

  _loadWaypointsFromStage(stage) {
    if (!stage || !stage.waypoints) return;
    const w = this.mapCanvas.clientWidth || 640;
    const h = this.mapCanvas.clientHeight || 320;

    const wps = stage.waypoints;
    const minX = Math.min(...wps.map(p => p.x));
    const maxX = Math.max(...wps.map(p => p.x));
    const minZ = Math.min(...wps.map(p => p.z));
    const maxZ = Math.max(...wps.map(p => p.z));

    const spanX = Math.max(1, maxX - minX);
    const spanZ = Math.max(1, maxZ - minZ);

    this.customWaypoints = wps.map((wp) => ({
      canvasX: 60 + ((wp.x - minX) / spanX) * (w - 120),
      canvasY: 50 + ((wp.z - minZ) / spanZ) * (h - 100),
      lat: wp.lat || 43.98,
      lon: wp.lon || 7.39,
      alt: wp.elevation || 1200
    }));

    this._updateWaypointBadge();
    this.drawMap();
  }

  _updateWaypointBadge() {
    const badge = this.container.querySelector('#waypointCountBadge');
    if (badge) {
      badge.textContent = `${this.customWaypoints.length} GPS Waypoints`;
    }
  }

  drawMap() {
    if (!this.mapCanvas || !this.mapCtx) return;
    const w = this.mapCanvas.clientWidth || 640;
    const h = this.mapCanvas.clientHeight || 320;
    const ctx = this.mapCtx;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Satellite Topographic Background Grid
    ctx.fillStyle = '#141c24';
    ctx.fillRect(0, 0, w, h);

    // Topo Contour Circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let r = 40; r < w + 200; r += 50) {
      ctx.beginPath();
      ctx.arc(w * 0.45, h * 0.55, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid coordinates
    ctx.strokeStyle = 'rgba(70, 130, 180, 0.15)';
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (this.customWaypoints.length < 2) return;

    // 2. Draw Spline Road Path
    ctx.strokeStyle = '#e10600';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(225, 6, 0, 0.6)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(this.customWaypoints[0].canvasX, this.customWaypoints[0].canvasY);

    for (let i = 1; i < this.customWaypoints.length; i++) {
      const prev = this.customWaypoints[i - 1];
      const curr = this.customWaypoints[i];
      // Quadratic bezier curve through midpoints
      const midX = (prev.canvasX + curr.canvasX) / 2;
      const midY = (prev.canvasY + curr.canvasY) / 2;
      ctx.quadraticCurveTo(prev.canvasX, prev.canvasY, midX, midY);
    }
    const lastWp = this.customWaypoints[this.customWaypoints.length - 1];
    ctx.lineTo(lastWp.canvasX, lastWp.canvasY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Draw Waypoint Pins & Markers
    this.customWaypoints.forEach((wp, idx) => {
      const isStart = idx === 0;
      const isFinish = idx === this.customWaypoints.length - 1;

      ctx.beginPath();
      ctx.arc(wp.canvasX, wp.canvasY, isStart || isFinish ? 9 : 6, 0, Math.PI * 2);

      if (isStart) {
        ctx.fillStyle = '#00e676';
        ctx.strokeStyle = '#ffffff';
      } else if (isFinish) {
        ctx.fillStyle = '#ff1744';
        ctx.strokeStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#ffd600';
        ctx.strokeStyle = '#111111';
      }

      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Pin Labels
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      const label = isStart ? 'START' : isFinish ? 'FINISH' : `WP${idx}`;
      ctx.fillText(label, wp.canvasX, wp.canvasY - 12);
    });
  }

  _previewCustomStage() {
    if (this.customWaypoints.length < 2) return;

    try {
      const surface = this.container.querySelector('#customSurfaceSelect')?.value || 'gravel';
      const weather = this.container.querySelector('#customWeatherSelect')?.value || 'sunset';
      const name = this.container.querySelector('#customStageName')?.value || 'Custom GPS Rally Stage';

      const compiled = StageCompiler.compile({
        id: 'stage_custom_preview',
        name,
        surface,
        weather,
        gpsPoints: this.customWaypoints.map(w => ({ lat: w.lat, lon: w.lon, alt: w.alt }))
      });

      if (this.elevationGraph) {
        this.elevationGraph.setStageData(compiled);
      }

      const stats = this.container.querySelector('#elevStatsDisplay');
      if (stats) {
        stats.textContent = `Length: ${(compiled.totalLengthMeters / 1000).toFixed(2)}km | Gain: ${compiled.elevationGainMeters}m | Corners: ${compiled.pacenotes.length}`;
      }
    } catch {
      // Ignore preview errors during fast dragging
    }
  }

  _bindEvents() {
    // Populate Stage Presets
    const list = this.container.querySelector('#stageCardsList');
    if (list) {
      const stages = stateStore.stageConfig.stages;
      list.innerHTML = Object.values(stages).map(s => {
        const isActive = s.id === stateStore.activeStageId;
        return `
          <div class="stage-preset-card ${isActive ? 'active' : ''}" data-stage-id="${s.id}">
            <div class="card-top">
              <span class="stage-country-flag">${s.surface === 'tarmac' ? '🇲🇨' : s.surface === 'gravel' ? '🇫🇮' : '🇬🇷'}</span>
              <h4>${s.name}</h4>
            </div>
            <div class="card-meta">
              <span>Surface: <strong>${s.surface.toUpperCase()}</strong></span>
              <span>Length: <strong>${(s.totalLengthMeters / 1000).toFixed(1)} km</strong></span>
              <span>Gain: <strong>+${s.elevationGainMeters}m</strong></span>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.stage-preset-card').forEach(card => {
        card.addEventListener('click', () => {
          const stageId = card.dataset.stageId;
          list.querySelectorAll('.stage-preset-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          stateStore.setActiveStage(stageId);
          this._loadWaypointsFromStage(stateStore.activeStage);
          if (this.elevationGraph) {
            this.elevationGraph.setStageData(stateStore.activeStage);
          }
        });
      });
    }

    // Reset Waypoints Button
    const btnReset = this.container.querySelector('#btnResetWaypoints');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.customWaypoints = [];
        this._updateWaypointBadge();
        this.drawMap();
      });
    }

    // Compile & Deploy Stage Button
    const btnCompile = this.container.querySelector('#btnCompileStage');
    if (btnCompile) {
      btnCompile.addEventListener('click', () => {
        if (this.customWaypoints.length < 2) {
          alert('Please click on the map to place at least 2 waypoints (Start and Finish).');
          return;
        }

        const surface = this.container.querySelector('#customSurfaceSelect').value;
        const weather = this.container.querySelector('#customWeatherSelect').value;
        const name = this.container.querySelector('#customStageName').value || 'Custom WRC Stage';

        const compiled = StageCompiler.compile({
          id: `custom_stage_${Date.now()}`,
          name,
          surface,
          weather,
          gpsPoints: this.customWaypoints.map(w => ({ lat: w.lat, lon: w.lon, alt: w.alt }))
        });

        // Set as active stage in reactive store
        stateStore.setCompiledStage(compiled);

        eventBus.emit(RALLY_EVENTS.NOTIFICATION, {
          title: 'Stage Compiled!',
          message: `${name} (${(compiled.totalLengthMeters / 1000).toFixed(2)} km) ready for racing.`
        });

        // Switch to stage drive view
        stateStore.setActiveTab('stage_drive');
      });
    }
  }
}
