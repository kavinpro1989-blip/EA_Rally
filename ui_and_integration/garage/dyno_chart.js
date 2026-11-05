/**
 * @file /ui_and_integration/garage/dyno_chart.js
 * @description Interactive Dyno & Transmission Gear Ratio vs Speed Chart.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

export class DynoChart {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.tuning = null;

    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth || 450;
    const h = this.canvas.clientHeight || 180;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  updateTuning(tuning) {
    this.tuning = tuning;
    this.render();
  }

  render() {
    if (!this.canvas || !this.ctx || !this.tuning) return;

    const w = this.canvas.clientWidth || 450;
    const h = this.canvas.clientHeight || 180;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    const padLeft = 40;
    const padRight = 15;
    const padTop = 20;
    const padBottom = 25;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    const maxRpm = this.tuning.engine?.maxRpm || 8400;
    const maxSpeedKph = 240;

    // 1. Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#777777';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';

    // RPM Y-axis
    for (let r = 2000; r <= maxRpm; r += 2000) {
      const y = padTop + (1 - (r / maxRpm)) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
      ctx.fillText(`${r / 1000}k`, padLeft - 6, y + 3);
    }

    // Speed X-axis
    ctx.textAlign = 'center';
    for (let s = 50; s <= maxSpeedKph; s += 50) {
      const x = padLeft + (s / maxSpeedKph) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();
      ctx.fillText(`${s}`, x, h - padBottom + 14);
    }

    // 2. Draw Gear Lines (Speed vs RPM)
    const gearRatios = this.tuning.transmission?.gearRatios || [3.45, 2.38, 1.76, 1.35, 1.08, 0.89];
    const finalDrive = this.tuning.transmission?.finalDriveRatio || 4.18;
    const wheelRadiusM = 0.33;

    const gearColors = ['#ff5252', '#ff7a00', '#ffd600', '#00e676', '#00e5ff', '#d500f9'];

    gearRatios.forEach((ratio, idx) => {
      const totalRatio = ratio * finalDrive;
      // speed (km/h) = (rpm / totalRatio) * 2 * PI * wheelRadius * (60 / 1000)
      const speedAtMaxRpm = (maxRpm / totalRatio) * (2 * Math.PI * wheelRadiusM) * (60 / 1000);
      const speedAtIdle = (1200 / totalRatio) * (2 * Math.PI * wheelRadiusM) * (60 / 1000);

      const x0 = padLeft + (speedAtIdle / maxSpeedKph) * plotW;
      const y0 = padTop + (1 - (1200 / maxRpm)) * plotH;

      const x1 = padLeft + (Math.min(maxSpeedKph, speedAtMaxRpm) / maxSpeedKph) * plotW;
      const y1 = padTop; // Max RPM

      ctx.strokeStyle = gearColors[idx % gearColors.length];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Gear label at top
      ctx.fillStyle = gearColors[idx % gearColors.length];
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`G${idx + 1}`, Math.min(w - padRight - 10, x1), padTop - 6);
    });

    // Dyno Title
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SPEED (KM/H) VS RPM', padLeft, padTop - 6);
  }
}
