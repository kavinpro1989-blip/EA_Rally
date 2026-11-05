/**
 * @file /main.js
 * @description Application Entry Point & Subsystem Orchestration.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from './ui_and_integration/core/event_bus.js';
import { stateStore } from './ui_and_integration/core/state_store.js';
import { physicsBridge } from './ui_and_integration/core/physics_bridge.js';
import { rallyAudio } from './ui_and_integration/core/audio_synthesizer.js';
import { SceneManager } from './ui_and_integration/viewport/scene_manager.js';
import { StagePicker } from './ui_and_integration/stage_picker/stage_picker.js';
import { TuningStudio } from './ui_and_integration/garage/tuning_studio.js';
import { TelemetryHUD } from './ui_and_integration/hud/telemetry_hud.js';
import { installRallyEngine } from './sim/ui_integration.js';
import { bundledConfig } from './sim/config_bundle.js';

class RallyApplication {
  constructor() {
    this.viewportContainer = document.getElementById('viewportContainer');
    this.stagePickerMount = document.getElementById('stagePickerMount');
    this.garageStudioMount = document.getElementById('garageStudioMount');
    this.telemetryHudMount = document.getElementById('telemetryHudMount');

    this.sceneManager = null;
    this.stagePicker = null;
    this.tuningStudio = null;
    this.telemetryHud = null;

    this.toastEl = document.getElementById('rallyToast');
    this.toastTitle = document.getElementById('toastTitle');
    this.toastMsg = document.getElementById('toastMsg');
    this.toastTimeout = null;

    this.init();
  }

  init() {
    // 1. Initialize Master Three.js Viewport
    this.sceneManager = new SceneManager(this.viewportContainer);

    // 2. Initialize Stage Picker & GPS Route Compiler
    this.stagePicker = new StagePicker(this.stagePickerMount);

    // 3. Initialize 3D Garage Mechanical Tuning Studio
    this.tuningStudio = new TuningStudio(this.garageStudioMount);

    // 4. Initialize Pro-Telemetry HUD & AI Co-Driver Overlay
    this.telemetryHud = new TelemetryHUD(this.telemetryHudMount);

    // 5. Connect State Store reference to physics bridge & install deterministic physics engine
    stateStore.physicsBridge = physicsBridge;
    try {
      this.engineLink = installRallyEngine(physicsBridge, {
        eventBus,
        RALLY_EVENTS,
        stateStore,
        config: bundledConfig
      });
      console.log('[RallyApplication] Deterministic Physics Engine Installed Successfully');
    } catch (err) {
      console.warn('[RallyApplication] Physics engine install fallback to arcade dynamics:', err);
    }

    // 6. Start Physics Simulation Loop
    physicsBridge.start();

    // 7. Bind UI Navigation and Event Handlers
    this._bindNavigation();
    this._bindAudioUnlock();
    this._bindGlobalHotkeys();
    this._bindToastNotifications();

    this.showToast('SYSTEM READY', 'EA Rally Viewport & Physics Bridge Active');
  }

  _bindNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        stateStore.setActiveTab(tab);
      });
    });

    eventBus.on(RALLY_EVENTS.ACTIVE_TAB_CHANGED, ({ tabId }) => {
      navButtons.forEach(b => {
        if (b.dataset.tab === tabId) b.classList.add('active');
        else b.classList.remove('active');
      });

      if (tabId === 'stage_drive') {
        this.stagePickerMount.style.display = 'none';
        this.garageStudioMount.style.display = 'none';
        stateStore.setCameraMode('chase');
      } else if (tabId === 'garage_studio') {
        this.stagePickerMount.style.display = 'none';
        this.garageStudioMount.style.display = 'flex';
        stateStore.setCameraMode('helicopter'); // Show nice showcase orbit
      } else if (tabId === 'stage_planner') {
        this.garageStudioMount.style.display = 'none';
        this.stagePickerMount.style.display = 'flex';
        this.stagePicker.drawMap();
        if (this.stagePicker.elevationGraph) {
          this.stagePicker.elevationGraph.resize();
        }
      }
    });

    // Camera quick-buttons in viewport
    const camButtons = document.querySelectorAll('.cam-btn');
    camButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.cam;
        stateStore.setCameraMode(mode);
      });
    });

    eventBus.on(RALLY_EVENTS.CAMERA_VIEW_CHANGED, ({ mode }) => {
      camButtons.forEach(b => {
        if (b.dataset.cam === mode) b.classList.add('active');
        else b.classList.remove('active');
      });
    });
  }

  _bindAudioUnlock() {
    const unlock = () => {
      rallyAudio.initAudioContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    const btnAudio = document.getElementById('btnAudioToggle');
    const audioIcon = document.getElementById('audioIcon');
    const audioLabel = document.getElementById('audioLabel');

    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        rallyAudio.initAudioContext();
        const isMuted = rallyAudio.toggleMute();
        audioIcon.textContent = isMuted ? '🔇' : '🔊';
        audioLabel.textContent = isMuted ? 'AUDIO MUTED' : 'AUDIO ACTIVE';
      });
    }
  }

  _bindGlobalHotkeys() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;

      if (e.code === 'KeyG') {
        const nextTab = stateStore.activeTab === 'garage_studio' ? 'stage_drive' : 'garage_studio';
        stateStore.setActiveTab(nextTab);
      } else if (e.code === 'KeyP') {
        const nextTab = stateStore.activeTab === 'stage_planner' ? 'stage_drive' : 'stage_planner';
        stateStore.setActiveTab(nextTab);
      }
    });
  }

  _bindToastNotifications() {
    eventBus.on(RALLY_EVENTS.NOTIFICATION, ({ title, message }) => {
      this.showToast(title, message);
    });
  }

  showToast(title, message) {
    if (!this.toastEl) return;
    this.toastTitle.textContent = title || 'ALERT';
    this.toastMsg.textContent = message || '';

    this.toastEl.classList.add('visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('visible');
    }, 2800);
  }
}

// Bootstrap on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  new RallyApplication();
});
