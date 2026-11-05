/**
 * @file /ui_and_integration/hud/co_driver_overlay.js
 * @description AI Co-Driver Visual & Verbal Pacenote Overlay HUD.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';

export class CoDriverOverlay {
  constructor(containerElement) {
    this.container = containerElement;
    this.activeNote = null;
    this.distanceToApex = 0;
    this.initialDistance = 120;

    this.render();
    this._bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="co-driver-container" id="coDriverContainer">
        <div class="pacenote-card" id="pacenoteCard" style="display: none;">
          <div class="pacenote-icon-box" id="pacenoteIconBox">
            <svg id="pacenoteSvg" class="pacenote-svg" viewBox="0 0 100 100">
              <!-- Dynamically populated rally arrows -->
            </svg>
          </div>
          <div class="pacenote-details">
            <div class="pacenote-callout" id="pacenoteCallout">Flat Right 150</div>
            <div class="pacenote-detail-sub" id="pacenoteDetailSub">Keep Middle</div>
            <div class="pacenote-countdown-track">
              <div class="pacenote-countdown-fill" id="pacenoteCountdownFill"></div>
            </div>
          </div>
          <div class="pacenote-distance-badge" id="pacenoteDistBadge">120m</div>
        </div>
      </div>
    `;

    this.card = this.container.querySelector('#pacenoteCard');
    this.iconBox = this.container.querySelector('#pacenoteIconBox');
    this.svg = this.container.querySelector('#pacenoteSvg');
    this.callout = this.container.querySelector('#pacenoteCallout');
    this.detailSub = this.container.querySelector('#pacenoteDetailSub');
    this.countdownFill = this.container.querySelector('#pacenoteCountdownFill');
    this.distBadge = this.container.querySelector('#pacenoteDistBadge');
  }

  _bindEvents() {
    eventBus.on(RALLY_EVENTS.PACENOTE_TRIGGER, (pacenote) => {
      this.showPacenote(pacenote);
    });
  }

  showPacenote(note) {
    if (!stateStore.hudSettings.showCoDriver) return;

    this.activeNote = note;
    this.initialDistance = 100;
    this.distanceToApex = 100;

    this.card.style.display = 'flex';
    this.card.classList.add('note-pop');
    setTimeout(() => this.card.classList.remove('note-pop'), 300);

    this.callout.textContent = note.call || '';
    this.detailSub.textContent = note.detail || (note.modifier ? `Modifier: ${note.modifier}` : '');

    // Set colors based on severity
    const colors = {
      1: '#ff1744', // Hairpin Red
      2: '#ff6d00', // Sharp Orange
      3: '#ffd600', // Medium Yellow
      4: '#76ff03', // Fast Light Green
      5: '#00e676', // Very Fast Green
      6: '#00e5ff'  // Flat Out Cyan
    };
    const accentColor = note.type === 'jump' ? '#ffea00' : colors[note.severity] || '#00e676';
    this.iconBox.style.backgroundColor = accentColor;
    this.distBadge.style.borderColor = accentColor;

    // Render Pacenote Arrow SVG
    this._renderArrowSvg(note, accentColor);
  }

  _renderArrowSvg(note, color) {
    const isLeft = note.direction === 'left';
    const isRight = note.direction === 'right';
    const isJump = note.type === 'jump';
    const isHairpin = note.type === 'hairpin';

    let svgPath = '';

    if (isJump) {
      // Upward hill jump crest icon
      svgPath = `
        <path d="M 20 80 Q 50 15 80 80" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="50,15 35,40 65,40" fill="#000"/>
      `;
    } else if (isHairpin) {
      // 180-degree hairpin hook
      if (isLeft) {
        svgPath = `
          <path d="M 70 85 L 70 45 A 25 25 0 0 0 30 45 L 30 75" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
          <polygon points="30,85 18,65 42,65" fill="#000"/>
        `;
      } else {
        svgPath = `
          <path d="M 30 85 L 30 45 A 25 25 0 0 1 70 45 L 70 75" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
          <polygon points="70,85 58,65 82,65" fill="#000"/>
        `;
      }
    } else if (isLeft) {
      // Curved Left Turn Arrow
      svgPath = `
        <path d="M 75 85 Q 75 35 30 35" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="15,35 38,20 38,50" fill="#000"/>
      `;
    } else if (isRight) {
      // Curved Right Turn Arrow
      svgPath = `
        <path d="M 25 85 Q 25 35 70 35" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="85,35 62,20 62,50" fill="#000"/>
      `;
    } else {
      // Straight / Flat Out
      svgPath = `
        <line x1="50" y1="85" x2="50" y2="25" stroke="#000" stroke-width="12" stroke-linecap="round"/>
        <polygon points="50,12 32,35 68,35" fill="#000"/>
      `;
    }

    this.svg.innerHTML = svgPath;
  }

  update(telemetry) {
    if (!this.activeNote || !this.card) return;

    const currentDist = telemetry?.stageProgress?.currentDistanceM || 0;
    const remainingM = Math.max(0, this.activeNote.distance - currentDist);

    if (remainingM <= 0) {
      // Apex passed, fade out
      this.card.style.opacity = '0';
      setTimeout(() => {
        if (this.card.style.opacity === '0') {
          this.card.style.display = 'none';
          this.card.style.opacity = '1';
        }
      }, 500);
      this.activeNote = null;
      return;
    }

    this.distBadge.textContent = `${Math.round(remainingM)}m`;
    const progress = Math.min(1.0, remainingM / this.initialDistance);
    this.countdownFill.style.width = `${progress * 100}%`;
  }
}
