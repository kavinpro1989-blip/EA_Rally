/**
 * @file /ui_and_integration/garage/part_customizer.js
 * @description Visual Customizer for Rally Aero Kits, Light Pods, Mudflaps, and AI Liveries.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';

export class PartCustomizer {
  constructor(containerElement) {
    this.container = containerElement;
    this.render();
    this._bindEvents();
  }

  render() {
    const vp = stateStore.currentTuning.visual_parts || {};

    this.container.innerHTML = `
      <div class="part-customizer-panel glass-subpanel">
        <h3 class="panel-section-title">VISUAL AERODYNAMICS & RALLY UPGRADES</h3>

        <!-- 1. Aero Kits -->
        <div class="customizer-group">
          <label class="group-label">AERODYNAMIC KIT</label>
          <div class="part-toggle-grid">
            <button class="part-option-btn ${vp.aeroKit === 'wrc_spec_high_downforce' ? 'active' : ''}" data-part="aeroKit" data-val="wrc_spec_high_downforce">
              <span class="btn-name">WRC Spec Aero</span>
              <span class="btn-sub">Swan-neck wing + Endplates</span>
            </button>
            <button class="part-option-btn ${vp.aeroKit === 'group_b_big_wing' ? 'active' : ''}" data-part="aeroKit" data-val="group_b_big_wing">
              <span class="btn-name">Group B Monster</span>
              <span class="btn-sub">Dual-plane mega wing</span>
            </button>
            <button class="part-option-btn ${vp.aeroKit === 'gravel_clubman' ? 'active' : ''}" data-part="aeroKit" data-val="gravel_clubman">
              <span class="btn-name">Clubman Ducktail</span>
              <span class="btn-sub">Low drag gravel spoiler</span>
            </button>
          </div>
        </div>

        <!-- 2. Rally Light Pods -->
        <div class="customizer-group">
          <label class="group-label">HOOD AUXILIARY LIGHT PODS</label>
          <div class="part-toggle-grid">
            <button class="part-option-btn ${vp.lightPods === 'quad_hella_hood' ? 'active' : ''}" data-part="lightPods" data-val="quad_hella_hood">
              <span class="btn-name">Quad Hella Pods</span>
              <span class="btn-sub">4x 100W Night Spotlights</span>
            </button>
            <button class="part-option-btn ${vp.lightPods === 'led_lightbar' ? 'active' : ''}" data-part="lightPods" data-val="led_lightbar">
              <span class="btn-name">Baja LED Bar</span>
              <span class="btn-sub">Ultra-bright floodlight</span>
            </button>
            <button class="part-option-btn ${vp.lightPods === 'clean_stock' ? 'active' : ''}" data-part="lightPods" data-val="clean_stock">
              <span class="btn-name">Clean Aerodynamic</span>
              <span class="btn-sub">Stock daytime hood</span>
            </button>
          </div>
        </div>

        <!-- 3. Mudflaps -->
        <div class="customizer-group">
          <label class="group-label">GRAVEL MUDFLAPS</label>
          <div class="part-toggle-grid-4">
            <button class="part-option-btn ${vp.mudflaps === 'rally_red' ? 'active' : ''}" data-part="mudflaps" data-val="rally_red">
              <span class="color-dot red"></span>
              <span>WRC Red</span>
            </button>
            <button class="part-option-btn ${vp.mudflaps === 'neon_yellow' ? 'active' : ''}" data-part="mudflaps" data-val="neon_yellow">
              <span class="color-dot yellow"></span>
              <span>Neon Lime</span>
            </button>
            <button class="part-option-btn ${vp.mudflaps === 'stealth_black' ? 'active' : ''}" data-part="mudflaps" data-val="stealth_black">
              <span class="color-dot black"></span>
              <span>Stealth</span>
            </button>
            <button class="part-option-btn ${vp.mudflaps === 'none' ? 'active' : ''}" data-part="mudflaps" data-val="none">
              <span>None</span>
            </button>
          </div>
        </div>

        <!-- 4. AI-Generated Liveries -->
        <div class="customizer-group">
          <label class="group-label">AI-GENERATED RALLY LIVERY DECALS</label>
          <div class="livery-card-grid">
            <div class="livery-card ${vp.liveryPreset === 'wrc_red' ? 'active' : ''}" data-part="liveryPreset" data-val="wrc_red">
              <div class="livery-thumb" style="background-image: url('/textures/livery_wrc_red.jpg')"></div>
              <div class="livery-info">
                <h4>Apex WRC Championship</h4>
                <p>Bold red/white stripes, sponsor badges, #07</p>
              </div>
            </div>
            <div class="livery-card ${vp.liveryPreset === 'mud_camo' ? 'active' : ''}" data-part="liveryPreset" data-val="mud_camo">
              <div class="livery-thumb" style="background-image: url('/textures/livery_mud_camo.jpg')"></div>
              <div class="livery-info">
                <h4>Splinter Mud Camo</h4>
                <p>Geometric dirt camo, neon-lime accents, #44</p>
              </div>
            </div>
            <div class="livery-card ${vp.liveryPreset === 'stealth_carbon' ? 'active' : ''}" data-part="liveryPreset" data-val="stealth_carbon">
              <div class="livery-thumb" style="background-image: url('/textures/livery_stealth_carbon.jpg')"></div>
              <div class="livery-info">
                <h4>Quantum Stealth Carbon</h4>
                <p>Woven carbon matrix, neon cyan vectors, #88</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Paint & Finish -->
        <div class="customizer-group">
          <label class="group-label">PAINT FINISH & COLOR</label>
          <div class="color-pickers-row">
            <div class="color-picker-item">
              <span>Body Paint:</span>
              <input type="color" id="inputBodyColor" value="${vp.bodyColor || '#e10600'}" class="color-input" />
            </div>
            <div class="color-picker-item">
              <span>Rims:</span>
              <input type="color" id="inputRimColor" value="${vp.rimColor || '#f0f0f0'}" class="color-input" />
            </div>
            <div class="color-picker-item">
              <span>Brake Calipers:</span>
              <input type="color" id="inputCaliperColor" value="${vp.brakeCaliperColor || '#ff1a1a'}" class="color-input" />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    this.container.querySelectorAll('.part-option-btn, .livery-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const part = btn.dataset.part;
        const val = btn.dataset.val;

        // Visual selection
        const siblings = btn.parentElement.querySelectorAll(`[data-part="${part}"]`);
        siblings.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');

        stateStore.updateTuningParameter('visual_parts', part, val);
        eventBus.emit(RALLY_EVENTS.VISUAL_PART_CHANGED, { partType: part, value: val });
      });
    });

    const bodyInput = this.container.querySelector('#inputBodyColor');
    if (bodyInput) {
      bodyInput.addEventListener('input', (e) => {
        stateStore.updateTuningParameter('visual_parts', 'bodyColor', e.target.value);
      });
    }

    const rimInput = this.container.querySelector('#inputRimColor');
    if (rimInput) {
      rimInput.addEventListener('input', (e) => {
        stateStore.updateTuningParameter('visual_parts', 'rimColor', e.target.value);
      });
    }

    const caliperInput = this.container.querySelector('#inputCaliperColor');
    if (caliperInput) {
      caliperInput.addEventListener('input', (e) => {
        stateStore.updateTuningParameter('visual_parts', 'brakeCaliperColor', e.target.value);
      });
    }
  }
}
