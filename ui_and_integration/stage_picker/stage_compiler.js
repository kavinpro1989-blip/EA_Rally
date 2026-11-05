/**
 * @file /ui_and_integration/stage_picker/stage_compiler.js
 * @description Compiles Google Maps GPS Waypoints and Elevation Profiles into 3D Splines & AI Pacenotes.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

export class StageCompiler {
  /**
   * Compiles a set of GPS waypoints into a full 3D rally stage definition.
   * @param {Object} options
   * @param {string} options.id Unique stage identifier
   * @param {string} options.name User given stage title
   * @param {string} options.surface 'tarmac' | 'gravel' | 'rocky' | 'snow'
   * @param {string} options.weather 'sunny' | 'sunset' | 'night' | 'overcast'
   * @param {Array<{lat: number, lon: number, alt: number}>} options.gpsPoints
   * @returns {Object} Compiled stage matching rally_stage_schema.json
   */
  static compile(options) {
    const { id, name, surface, weather, gpsPoints } = options;
    if (!gpsPoints || gpsPoints.length < 2) {
      throw new Error('Stage requires at least 2 GPS waypoints to compile.');
    }

    const startPt = gpsPoints[0];
    const endPt = gpsPoints[gpsPoints.length - 1];

    // Convert GPS coordinates to 3D metric world space relative to start point
    const waypoints = [];
    let accumulatedDistM = 0;

    for (let i = 0; i < gpsPoints.length; i++) {
      const pt = gpsPoints[i];

      // Metric offsets from start point
      // 1 deg lat ~= 111,320m, 1 deg lon ~= 111,320m * cos(lat)
      const latRad = (startPt.lat * Math.PI) / 180;
      const dLatM = (pt.lat - startPt.lat) * 111320;
      const dLonM = (pt.lon - startPt.lon) * (111320 * Math.cos(latRad));
      const dAltM = (pt.alt || 100) - (startPt.alt || 100);

      if (i > 0) {
        const prevWp = waypoints[i - 1];
        const stepDist = Math.hypot(dLonM - prevWp.x, dLatM - prevWp.z);
        accumulatedDistM += stepDist;
      }

      waypoints.push({
        distance: Math.round(accumulatedDistM),
        x: Math.round(dLonM * 10) / 10,
        y: Math.round(dAltM * 10) / 10,
        z: Math.round(dLatM * 10) / 10,
        lat: pt.lat,
        lon: pt.lon,
        elevation: pt.alt || 100,
        camber: 0.0,
        width: surface === 'gravel' ? 6.8 : 5.8
      });
    }

    // Auto-calculate corner cambers & banked corners
    for (let i = 1; i < waypoints.length - 1; i++) {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      const next = waypoints[i + 1];

      const v1 = { x: curr.x - prev.x, z: curr.z - prev.z };
      const v2 = { x: next.x - curr.x, z: next.z - curr.z };

      // Cross product in 2D gives corner direction
      const cross = v1.x * v2.z - v1.z * v2.x;
      // Banking angle proportional to turn sharpness (up to 0.08 rad)
      curr.camber = Math.max(-0.08, Math.min(0.08, (cross / 10000) * 0.05));
    }

    // Generate rally pacenotes from path curvature and elevation changes
    const pacenotes = this._generatePacenotes(waypoints);

    const surfaceGrips = {
      tarmac: 0.98,
      gravel: 0.82,
      rocky: 0.74,
      snow: 0.58
    };

    const lightingPresets = {
      sunset: {
        skyColor: '#ff7043',
        groundColor: '#3e2723',
        sunColor: '#ffab91',
        sunPosition: [300, 200, -400],
        fogDensity: 0.0007,
        fogColor: '#d38067'
      },
      sunny: {
        skyColor: '#90caf9',
        groundColor: '#2e7d32',
        sunColor: '#fff9c4',
        sunPosition: [400, 500, -200],
        fogDensity: 0.0004,
        fogColor: '#cce5ff'
      },
      night: {
        skyColor: '#0d1b2a',
        groundColor: '#0a0f18',
        sunColor: '#1b263b',
        sunPosition: [100, 100, 100],
        fogDensity: 0.0012,
        fogColor: '#0b1320'
      },
      overcast: {
        skyColor: '#b0bec5',
        groundColor: '#37474f',
        sunColor: '#cfd8dc',
        sunPosition: [200, 350, 100],
        fogDensity: 0.0008,
        fogColor: '#90a4ae'
      }
    };

    return {
      id: id || `stage_custom_${Date.now()}`,
      name: name || 'Custom GPS Rally Stage',
      region: 'Custom GPS Stage Coordinates',
      surface: surface || 'gravel',
      surfaceGripCoefficient: surfaceGrips[surface] || 0.85,
      weather: weather || 'sunset',
      totalLengthMeters: Math.round(accumulatedDistM),
      elevationGainMeters: Math.round(Math.abs((endPt.alt || 100) - (startPt.alt || 100))),
      baseRoadWidthMeters: surface === 'gravel' ? 6.8 : 5.8,
      shoulderWidthMeters: 1.2,
      ambientLighting: lightingPresets[weather] || lightingPresets.sunset,
      startPoint: startPt,
      endPoint: endPt,
      waypoints,
      pacenotes
    };
  }

  static _generatePacenotes(waypoints) {
    const pacenotes = [];

    // Opening pacenote
    pacenotes.push({
      distance: 60,
      call: 'Start Flat 100',
      type: 'straight',
      severity: 6,
      direction: 'straight',
      modifier: 'flat',
      detail: 'Clean launch'
    });

    for (let i = 1; i < waypoints.length - 1; i++) {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      const next = waypoints[i + 1];

      // Calculate angle between segments
      const aX = curr.x - prev.x;
      const aZ = curr.z - prev.z;
      const bX = next.x - curr.x;
      const bZ = next.z - curr.z;

      const dot = aX * bX + aZ * bZ;
      const magA = Math.hypot(aX, aZ);
      const magB = Math.hypot(bX, bZ);

      if (magA > 0 && magB > 0) {
        const cosAngle = Math.max(-1, Math.min(1, dot / (magA * magB)));
        const angleDeg = Math.acos(cosAngle) * (180 / Math.PI);
        const cross = aX * bZ - aZ * bX;
        const dir = cross > 0 ? 'right' : 'left';

        // Check for elevation crest / jump
        const elevDelta = curr.y - prev.y;
        const isCrest = elevDelta > 8;

        if (angleDeg > 10) {
          let severity = 6;
          let call = '';
          let type = 'turn';

          if (angleDeg >= 85) {
            severity = 1;
            call = `Caution Hairpin ${dir.toUpperCase()} Don't Cut`;
            type = 'hairpin';
          } else if (angleDeg >= 60) {
            severity = 2;
            call = `${dir.toUpperCase()} 2 Tightens`;
          } else if (angleDeg >= 40) {
            severity = 3;
            call = `${dir.toUpperCase()} 3 into Left 3`;
          } else if (angleDeg >= 25) {
            severity = 4;
            call = `${dir.toUpperCase()} 4 ${isCrest ? 'over Crest' : '100'}`;
          } else if (angleDeg >= 15) {
            severity = 5;
            call = `${dir.toUpperCase()} 5 Long`;
          } else {
            severity = 6;
            call = `Flat ${dir.toUpperCase()} 150`;
          }

          pacenotes.push({
            distance: curr.distance,
            call,
            type,
            severity,
            direction: dir,
            modifier: angleDeg >= 85 ? 'caution' : isCrest ? 'crest' : 'flat',
            detail: `${Math.round(angleDeg)}° turn`
          });
        } else if (isCrest) {
          pacenotes.push({
            distance: curr.distance,
            call: 'Jump over Crest stay middle',
            type: 'jump',
            severity: 6,
            direction: 'straight',
            modifier: 'jump',
            detail: 'Big airtime'
          });
        }
      }
    }

    // Finish pacenote
    const lastWp = waypoints[waypoints.length - 1];
    pacenotes.push({
      distance: lastWp.distance - 80,
      call: 'Flying Finish into Stop Control',
      type: 'finish',
      severity: 6,
      direction: 'straight',
      modifier: 'finish',
      detail: 'Full commit across line'
    });

    return pacenotes;
  }
}
