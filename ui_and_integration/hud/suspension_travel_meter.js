/**
 * @file /ui_and_integration/hud/suspension_travel_meter.js
 * @description 4-Corner Suspension Travel Bar Telemetry & Bottom-out Gauges.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

export class SuspensionTravelMeter {
  constructor(containerElement) {
    this.container = containerElement;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="suspension-travel-panel glass-hud-subpanel">
        <div class="hud-subpanel-header">
          <span>SUSPENSION TRAVEL</span>
          <span class="hud-unit">4-CORNER (MM)</span>
        </div>
        <div class="suspension-corners-grid">
          <!-- FL -->
          <div class="corner-meter" id="corner_fl">
            <div class="corner-label">FL</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_fl"></div>
              <div class="bottom-out-marker" id="bump_fl"></div>
            </div>
            <div class="corner-val" id="val_fl">140mm</div>
          </div>

          <!-- FR -->
          <div class="corner-meter" id="corner_fr">
            <div class="corner-label">FR</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_fr"></div>
              <div class="bottom-out-marker" id="bump_fr"></div>
            </div>
            <div class="corner-val" id="val_fr">140mm</div>
          </div>

          <!-- RL -->
          <div class="corner-meter" id="corner_rl">
            <div class="corner-label">RL</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_rl"></div>
              <div class="bottom-out-marker" id="bump_rl"></div>
            </div>
            <div class="corner-val" id="val_rl">150mm</div>
          </div>

          <!-- RR -->
          <div class="corner-meter" id="corner_rr">
            <div class="corner-label">RR</div>
            <div class="bar-track">
              <div class="bar-fill" id="bar_rr"></div>
              <div class="bottom-out-marker" id="bump_rr"></div>
            </div>
            <div class="corner-val" id="val_rr">150mm</div>
          </div>
        </div>
      </div>
    `;

    this.bars = {
      fl: this.container.querySelector('#bar_fl'),
      fr: this.container.querySelector('#bar_fr'),
      rl: this.container.querySelector('#bar_rl'),
      rr: this.container.querySelector('#bar_rr')
    };

    this.vals = {
      fl: this.container.querySelector('#val_fl'),
      fr: this.container.querySelector('#val_fr'),
      rl: this.container.querySelector('#val_rl'),
      rr: this.container.querySelector('#val_rr')
    };

    this.bumps = {
      fl: this.container.querySelector('#bump_fl'),
      fr: this.container.querySelector('#bump_fr'),
      rl: this.container.querySelector('#bump_rl'),
      rr: this.container.querySelector('#bump_rr')
    };
  }

  update(suspension) {
    if (!suspension) return;

    for (const id of ['fl', 'fr', 'rl', 'rr']) {
      const s = suspension[id];
      if (!s) continue;

      const pct = Math.max(0, Math.min(100, s.compressionPct));
      if (this.bars[id]) {
        this.bars[id].style.height = `${pct}%`;
        // Color transition: green normal, yellow high compression, red near bottom-out
        if (pct > 88) {
          this.bars[id].style.backgroundColor = '#ff1744';
        } else if (pct > 65) {
          this.bars[id].style.backgroundColor = '#ffd600';
        } else {
          this.bars[id].style.backgroundColor = '#00e676';
        }
      }

      if (this.vals[id]) {
        this.vals[id].textContent = `${s.travelMm}mm`;
      }

      if (this.bumps[id]) {
        this.bumps[id].style.opacity = s.bottomedOut ? '1' : '0';
      }
    }
  }
}
