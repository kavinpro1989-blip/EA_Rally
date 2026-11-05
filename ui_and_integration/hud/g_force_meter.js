/**
 * @file /ui_and_integration/hud/g_force_meter.js
 * @description Real-Time G-Force Accelerometer & Friction Circle HUD Gauge.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

export class GForceMeter {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.history = [];
    this.maxHistory = 24;

    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const size = this.canvas.clientWidth || 140;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.scale(dpr, dpr);
  }

  update(gForces) {
    if (!this.canvas || !this.ctx || !gForces) return;

    const latG = gForces.lateralG || 0;
    const longG = gForces.longitudinalG || 0;

    this.history.push({ latG, longG });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.render(latG, longG);
  }

  render(currentLatG, currentLongG) {
    const size = this.canvas.clientWidth || 140;
    const ctx = this.ctx;
    const center = size * 0.5;
    const maxG = 2.0;
    const radius = size * 0.42;

    ctx.clearRect(0, 0, size, size);

    // 1. Concentric Circles (0.5G, 1.0G, 1.5G, 2.0G)
    ctx.lineWidth = 1;
    for (let g = 0.5; g <= maxG; g += 0.5) {
      const r = (g / maxG) * radius;
      ctx.strokeStyle = g === 1.0 ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Crosshair Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.beginPath();
    ctx.moveTo(center, 8);
    ctx.lineTo(center, size - 8);
    ctx.moveTo(8, center);
    ctx.lineTo(size - 8, center);
    ctx.stroke();

    // 3. Trailing G-Force History Tail
    if (this.history.length > 1) {
      ctx.lineWidth = 2;
      for (let i = 0; i < this.history.length - 1; i++) {
        const pt1 = this.history[i];
        const pt2 = this.history[i + 1];

        const x1 = center + (pt1.latG / maxG) * radius;
        const y1 = center - (pt1.longG / maxG) * radius;
        const x2 = center + (pt2.latG / maxG) * radius;
        const y2 = center - (pt2.longG / maxG) * radius;

        const alpha = (i / this.history.length) * 0.6;
        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    // 4. Current G-Force Marker
    const curX = center + (currentLatG / maxG) * radius;
    const curY = center - (currentLongG / maxG) * radius;

    // Glowing core
    const totalG = Math.hypot(currentLatG, currentLongG);
    const markerColor = totalG > 1.6 ? '#ff1744' : totalG > 1.1 ? '#ffd600' : '#00e5ff';

    ctx.fillStyle = markerColor;
    ctx.shadowColor = markerColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Digital readout
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${totalG.toFixed(2)}G`, center, size - 4);
  }
}
