/**
 * @file /ui_and_integration/core/event_bus.js
 * @description Decoupled Event Emitter Bus for Physics, Three.js Viewport, and UI integration.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

export class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event topic.
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return cleanup handle
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event topic once.
   * @param {string} event
   * @param {Function} callback
   */
  once(event, callback) {
    const wrapped = (...args) => {
      this.off(event, wrapped);
      callback(...args);
    };
    return this.on(event, wrapped);
  }

  /**
   * Unsubscribe from an event topic.
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event to all subscribers.
   * @param {string} event
   * @param {*} payload
   */
  emit(event, payload) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      for (const callback of callbacks) {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[EventBus] Error in listener for event "${event}":`, err);
        }
      }
    }
  }

  /**
   * Clear all subscribers or all subscribers for a given event.
   * @param {string} [event]
   */
  clear(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Global Singleton Event Bus instance
export const eventBus = new EventBus();

// Standard Event Constant Names
export const RALLY_EVENTS = {
  // Physics & Telemetry
  PHYSICS_TICK: 'physics:tick',
  TELEMETRY_UPDATE: 'telemetry:update',
  VEHICLE_COLLISION: 'vehicle:collision',
  WHEEL_SLIP: 'vehicle:wheel_slip',
  BOTTOM_OUT: 'vehicle:bottom_out',
  GEAR_SHIFT: 'vehicle:gear_shift',
  TURBO_BLOWOFF: 'vehicle:turbo_blowoff',
  BACKFIRE_POP: 'vehicle:backfire_pop',

  // Vehicle Tuning & Customization
  TUNING_UPDATED: 'tuning:updated',
  TUNING_PRESET_LOADED: 'tuning:preset_loaded',
  VISUAL_PART_CHANGED: 'garage:visual_part_changed',
  LIVERY_CHANGED: 'garage:livery_changed',

  // Stages & Roads
  STAGE_SELECTED: 'stage:selected',
  STAGE_COMPILED: 'stage:compiled',
  SURFACE_CHANGED: 'stage:surface_changed',
  PACENOTE_TRIGGER: 'stage:pacenote_trigger',
  STAGE_RESTART: 'stage:restart',

  // Camera & Viewport
  CAMERA_VIEW_CHANGED: 'camera:view_changed',
  VIEWPORT_RESIZED: 'viewport:resized',
  GRAPHICS_SETTING_CHANGED: 'viewport:graphics_changed',

  // HUD & UI Mode
  HUD_VISIBILITY_TOGGLED: 'hud:visibility_toggled',
  ACTIVE_TAB_CHANGED: 'ui:tab_changed',
  NOTIFICATION: 'ui:notification'
};
