/**
 * @file /ui_and_integration/core/state_store.js
 * @description Centralized Reactive State Store for Vehicle Tuning, Stage Setup, and UI State.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from './event_bus.js';
import initialTuningConfig from '../../config/vehicle_tuning_schema.json';
import initialStageConfig from '../../config/rally_stage_schema.json';

class StateStore {
  constructor() {
    this.tuningConfig = JSON.parse(JSON.stringify(initialTuningConfig));
    this.stageConfig = JSON.parse(JSON.stringify(initialStageConfig));

    this.activeStageId = this.stageConfig.activeStageId || 'stage_monte_carlo_turini';
    this.activeStage = this.stageConfig.stages[this.activeStageId];

    this.currentTuning = JSON.parse(JSON.stringify(this.tuningConfig.currentTuning));
    this.activeProfile = this.tuningConfig.activeProfile || 'asphalt_monte_carlo';

    // Camera State
    this.cameraMode = 'chase'; // 'chase' | 'onboard' | 'helicopter' | 'orbit'
    this.fieldOfView = 65;

    // HUD Display Settings
    this.hudSettings = {
      showTelemetry: true,
      showCoDriver: true,
      showSuspensionTravel: true,
      showTireTemps: true,
      showGForceCircle: true,
      showBoostGauge: true,
      showMiniMap: true,
      audioCoDriverEnabled: true,
      coDriverVolume: 0.85
    };

    // Active App Mode ('stage_drive' | 'garage_studio' | 'stage_planner' | 'telemetry_lab')
    this.activeTab = 'stage_drive';

    // Try restoring state from localStorage if available
    this._loadSavedState();
  }

  _loadSavedState() {
    try {
      const saved = localStorage.getItem('ea_rally_tuning_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentTuning) {
          this.currentTuning = { ...this.currentTuning, ...parsed.currentTuning };
        }
        if (parsed.activeProfile) {
          this.activeProfile = parsed.activeProfile;
        }
      }
    } catch {
      // LocalStorage unavailable in sandbox / SSR, fallback cleanly
    }
  }

  _persistState() {
    try {
      localStorage.setItem('ea_rally_tuning_state', JSON.stringify({
        currentTuning: this.currentTuning,
        activeProfile: this.activeProfile
      }));
    } catch {
      // Ignore fallback
    }
  }

  /**
   * Update tuning parameters in a specific subsystem (suspension, differential, etc.)
   * @param {string} section 'suspension' | 'differential' | 'transmission' | 'tires_and_brakes' | 'visual_parts'
   * @param {string} key
   * @param {*} value
   */
  updateTuningParameter(section, key, value) {
    if (!this.currentTuning[section]) {
      this.currentTuning[section] = {};
    }
    this.currentTuning[section][key] = value;
    this._persistState();

    eventBus.emit(RALLY_EVENTS.TUNING_UPDATED, {
      section,
      key,
      value,
      fullTuning: this.currentTuning
    });
  }

  /**
   * Load a named tuning preset profile
   * @param {string} presetId
   */
  loadTuningPreset(presetId) {
    const preset = this.tuningConfig.presets[presetId];
    if (!preset) {
      console.warn(`[StateStore] Preset ${presetId} not found.`);
      return;
    }

    this.activeProfile = presetId;
    // Deep merge preset properties
    for (const section of ['suspension', 'differential', 'transmission', 'tires_and_brakes', 'visual_parts']) {
      if (preset[section]) {
        this.currentTuning[section] = {
          ...this.currentTuning[section],
          ...preset[section]
        };
      }
    }

    this._persistState();
    eventBus.emit(RALLY_EVENTS.TUNING_PRESET_LOADED, {
      presetId,
      preset,
      fullTuning: this.currentTuning
    });
    eventBus.emit(RALLY_EVENTS.TUNING_UPDATED, {
      section: 'all',
      fullTuning: this.currentTuning
    });
  }

  /**
   * Switch the active rally stage
   * @param {string} stageId
   */
  setActiveStage(stageId) {
    const stage = this.stageConfig.stages[stageId];
    if (!stage) {
      console.warn(`[StateStore] Stage ${stageId} not found.`);
      return;
    }
    this.activeStageId = stageId;
    this.activeStage = stage;

    eventBus.emit(RALLY_EVENTS.STAGE_SELECTED, {
      stageId,
      stage
    });
  }

  /**
   * Set custom compiled stage data from Stage Picker
   * @param {Object} compiledStage
   */
  setCompiledStage(compiledStage) {
    this.stageConfig.stages[compiledStage.id] = compiledStage;
    this.activeStageId = compiledStage.id;
    this.activeStage = compiledStage;

    eventBus.emit(RALLY_EVENTS.STAGE_COMPILED, {
      stageId: compiledStage.id,
      stage: compiledStage
    });
  }

  /**
   * Change camera viewing mode
   * @param {'chase' | 'onboard' | 'helicopter' | 'orbit'} mode
   */
  setCameraMode(mode) {
    this.cameraMode = mode;
    eventBus.emit(RALLY_EVENTS.CAMERA_VIEW_CHANGED, { mode });
  }

  /**
   * Switch app navigation tab
   * @param {'stage_drive' | 'garage_studio' | 'stage_planner' | 'telemetry_lab'} tabId
   */
  setActiveTab(tabId) {
    this.activeTab = tabId;
    eventBus.emit(RALLY_EVENTS.ACTIVE_TAB_CHANGED, { tabId });
  }

  /**
   * Export the current tuning as a downloadable JSON string matching the vehicle schema
   * @returns {string}
   */
  exportTuningSchemaJson() {
    const exportData = {
      ...this.tuningConfig,
      activeProfile: this.activeProfile,
      currentTuning: this.currentTuning,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }
}

export const stateStore = new StateStore();
