/**
 * @file /ui_and_integration/stage_picker/elevation_graph.js
 * @description Interactive Elevation Profile Graph with Grade %, Crests, and Pacenote Markers.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

export class ElevationGraph {
  constructor(containerElement) {
    this.container = containerElement;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'elevation-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.stageData = null;
    this.hoverDistance = null;

    this._bindEvents();
  }

  _bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const progress = Math.max(0, Math.min(1, x / rect.width));
      if (this.stageData) {
        this.hoverDistance = progress * (this.stageData.totalLengthMeters || 4200);
        this.render();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverDistance = null;
      this.render();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  resize() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 180;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);

    this.render();
  }

  setStageData(stageData) {
    this.stageData = stageData;
    this.resize();
  }

  render() {
    if (!this.stageData) return;

    const width = this.canvas.clientWidth || 600;
    const height = this.canvas.clientHeight || 180;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const waypoints = this.stageData.waypoints || [];
    if (waypoints.length < 2) return;

    // Find min and max elevations
    const elevations = waypoints.map(w => w.elevation || 0);
    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const elevRange = Math.max(20, maxElev - minElev);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 25;
    const padBottom = 30;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // 1. Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#888888';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const y = padTop + (i / 4) * plotH;
      const elevVal = Math.round(maxElev - (i / 4) * elevRange);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      ctx.fillText(`${elevVal}m`, padLeft - 6, y + 3);
    }

    // 2. Draw Elevation Area Gradient
    const gradient = ctx.createLinearGradient(0, padTop, 0, height - padBottom);
    gradient.addColorStop(0, 'rgba(225, 6, 0, 0.55)');
    gradient.addColorStop(1, 'rgba(225, 6, 0, 0.02)');

    ctx.beginPath();
    ctx.moveTo(padLeft, height - padBottom);

    const points = waypoints.map((wp) => {
      const x = padLeft + (wp.distance / (this.stageData.totalLengthMeters || 4200)) * plotW;
      const y = padTop + (1 - ((wp.elevation - minElev) / elevRange)) * plotH;
      return { x, y, wp };
    });

    points.forEach((pt, i) => {
      if (i === 0) ctx.lineTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });

    ctx.lineTo(padLeft + plotW, height - padBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 3. Draw Elevation Profile Stroke Line
    ctx.beginPath();
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 2.5;
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 4. Draw Pacenote Crest / Jump Pins along Elevation Profile
    if (this.stageData.pacenotes) {
      for (const note of this.stageData.pacenotes) {
        if (note.type === 'jump' || note.type === 'hairpin' || note.call.includes('Crest')) {
          const noteX = padLeft + (note.distance / (this.stageData.totalLengthMeters || 4200)) * plotW;

          // Find interpolated Y
          let noteY = padTop + plotH * 0.5;
          for (let i = 0; i < points.length - 1; i++) {
            if (noteX >= points[i].x && noteX <= points[i + 1].x) {
              const t = (noteX - points[i].x) / (points[i + 1].x - points[i].x);
              noteY = points[i].y + t * (points[i + 1].y - points[i].y);
              break;
            }
          }

          ctx.fillStyle = note.type === 'jump' ? '#ffd600' : '#00e5ff';
          ctx.beginPath();
          ctx.arc(noteX, noteY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 5. Draw Interactive Hover Cursor
    if (this.hoverDistance !== null) {
      const hoverX = padLeft + (this.hoverDistance / (this.stageData.totalLengthMeters || 4200)) * plotW;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hoverX, padTop);
      ctx.lineTo(hoverX, height - padBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tooltip
      ctx.fillStyle = 'rgba(15, 15, 15, 0.88)';
      ctx.strokeStyle = '#ff3333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(Math.min(hoverX + 8, width - 130), padTop + 8, 115, 38, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Dist: ${(this.hoverDistance / 1000).toFixed(2)} km`, Math.min(hoverX + 16, width - 122), padTop + 22);

      // Estimate elevation at cursor
      const elevAtCursor = minElev + (1 - ((plotH * 0.5) / plotH)) * elevRange;
      ctx.fillStyle = '#ff8888';
      ctx.fillText(`Alt: ${Math.round(elevAtCursor)}m`, Math.min(hoverX + 16, width - 122), padTop + 36);
    }
  }
}
