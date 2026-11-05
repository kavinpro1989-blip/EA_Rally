/**
 * @file /ui_and_integration/viewport/stage_mesh_generator.js
 * @description Extrudes 3D Road Ribbon Meshes, Curbs, Guardrails, and Terrain from GPS Splines.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import * as THREE from 'three';
import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';

export class StageMeshGenerator {
  constructor(scene) {
    this.scene = scene;
    this.stageGroup = new THREE.Group();
    this.stageGroup.name = 'RallyStageRoot';
    this.scene.add(this.stageGroup);

    this.roadCurve = null;
    this.totalDistance = 0;
    this.sampleCache = [];
  }

  /**
   * Compiles and extrudes the entire 3D stage from stage definition data
   * @param {Object} stageData Stage schema object
   */
  buildStage(stageData) {
    // Clear previous stage meshes
    this.clear();

    const waypoints = stageData.waypoints || [];
    if (waypoints.length < 2) {
      console.warn('[StageMeshGenerator] Insufficient waypoints to build stage.');
      return;
    }

    // 1. Create 3D Catmull-Rom Spline through waypoints
    const points3D = waypoints.map(wp => new THREE.Vector3(wp.x, wp.y, wp.z));
    this.roadCurve = new THREE.CatmullRomCurve3(points3D, false, 'catmullrom', 0.5);

    this.totalDistance = stageData.totalLengthMeters || 4200;
    const numSamples = Math.max(120, waypoints.length * 25);
    this.sampleCache = [];

    // Precalculate sampled road spine coordinates
    for (let i = 0; i <= numSamples; i++) {
      const u = i / numSamples;
      const point = this.roadCurve.getPointAt(u);
      const tangent = this.roadCurve.getTangentAt(u).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      // Recalculate true up normal perpendicular to road surface
      const trueUp = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

      // Waypoint camber & width interpolation
      const wpIndex = Math.min(waypoints.length - 1, Math.floor(u * (waypoints.length - 1)));
      const camber = waypoints[wpIndex]?.camber || 0;
      const width = waypoints[wpIndex]?.width || stageData.baseRoadWidthMeters || 6.0;

      // Apply bank/camber roll rotation
      binormal.applyAxisAngle(tangent, camber);
      trueUp.applyAxisAngle(tangent, camber);

      this.sampleCache.push({
        u,
        distance: u * this.totalDistance,
        point,
        tangent,
        binormal,
        trueUp,
        camber,
        width
      });
    }

    // 2. Extrude Road Ribbon Mesh
    this._extrudeRoadMesh(stageData);

    // 3. Extrude Rumble Strips & Curbs on corners
    this._extrudeRumbleStrips();

    // 4. Extrude Guardrails / Cliff Barriers
    this._extrudeGuardrails();

    // 5. Generate Corridor Mountain Terrain
    this._generateCorridorTerrain(stageData);

    // 6. Spawn Trackside Props (Trees, Checkpoint Gates, Distance Markers)
    this._spawnTracksideProps(stageData);
  }

  _extrudeRoadMesh(stageData) {
    const samples = this.sampleCache;
    const numSegments = samples.length - 1;
    const numCrossSections = 7; // Crowned road profile cross section vertices

    // Geometry buffers
    const vertexCount = (numSegments + 1) * numCrossSections;
    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = [];

    let vIdx = 0;
    let uvIdx = 0;

    for (let i = 0; i <= numSegments; i++) {
      const s = samples[i];
      const halfWidth = s.width * 0.5;

      // Cross-sectional crown offsets: center is slightly crowned (+0.12m)
      for (let c = 0; c < numCrossSections; c++) {
        const factor = (c / (numCrossSections - 1)) * 2 - 1; // -1 to 1 across width
        const lateralOffset = factor * halfWidth;
        const crownArch = Math.cos(factor * (Math.PI / 2)) * 0.12;

        const posX = s.point.x + (s.binormal.x * lateralOffset) + (s.trueUp.x * crownArch);
        const posY = s.point.y + (s.binormal.y * lateralOffset) + (s.trueUp.y * crownArch);
        const posZ = s.point.z + (s.binormal.z * lateralOffset) + (s.trueUp.z * crownArch);

        positions[vIdx * 3] = posX;
        positions[vIdx * 3 + 1] = posY;
        positions[vIdx * 3 + 2] = posZ;

        normals[vIdx * 3] = s.trueUp.x;
        normals[vIdx * 3 + 1] = s.trueUp.y;
        normals[vIdx * 3 + 2] = s.trueUp.z;

        // Texture coordinates
        uvs[uvIdx * 2] = (factor + 1) * 0.5;
        uvs[uvIdx * 2 + 1] = s.distance * 0.2; // Repeat texture along road length

        vIdx++;
        uvIdx++;
      }

      // Generate triangle quad indices
      if (i < numSegments) {
        for (let c = 0; c < numCrossSections - 1; c++) {
          const row1 = i * numCrossSections + c;
          const row2 = (i + 1) * numCrossSections + c;

          indices.push(row1, row2, row1 + 1);
          indices.push(row1 + 1, row2, row2 + 1);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Road Surface Material
    const isGravel = stageData.surface === 'gravel' || stageData.surface === 'rocky';
    const roadColor = isGravel ? 0x8d6e63 : 0x2b2b2b;
    const roadRoughness = isGravel ? 0.95 : 0.72;

    const roadMaterial = new THREE.MeshStandardMaterial({
      color: roadColor,
      roughness: roadRoughness,
      metalness: 0.08,
      flatShading: false
    });

    const roadMesh = new THREE.Mesh(geometry, roadMaterial);
    roadMesh.name = 'RallyRoadRibbon';
    roadMesh.receiveShadow = true;
    this.stageGroup.add(roadMesh);
  }

  _extrudeRumbleStrips() {
    const samples = this.sampleCache;
    const redWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xcc2222,
      roughness: 0.6
    });

    // Place curbs at high curvature sections
    for (let i = 5; i < samples.length - 10; i += 6) {
      const s = samples[i];
      if (Math.abs(s.camber) > 0.03 || i % 18 === 0) {
        const curbSide = s.camber > 0 ? 1 : -1;
        const halfWidth = s.width * 0.5;

        const curbGeom = new THREE.BoxGeometry(0.5, 0.15, 3.2);
        const curbMesh = new THREE.Mesh(curbGeom, redWhiteMaterial);
        curbMesh.position.set(
          s.point.x + s.binormal.x * (halfWidth + 0.25) * curbSide,
          s.point.y + 0.08,
          s.point.z + s.binormal.z * (halfWidth + 0.25) * curbSide
        );
        curbMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), s.tangent);
        curbMesh.receiveShadow = true;
        this.stageGroup.add(curbMesh);
      }
    }
  }

  _extrudeGuardrails() {
    const samples = this.sampleCache;
    const railMaterial = new THREE.MeshStandardMaterial({
      color: 0xb0bec5,
      metalness: 0.85,
      roughness: 0.35
    });

    for (let i = 10; i < samples.length - 15; i += 4) {
      const s = samples[i];
      // Outer cliff side guardrails
      const halfWidth = s.width * 0.5 + 0.8;
      const postGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8);
      const postMesh = new THREE.Mesh(postGeom, railMaterial);
      postMesh.position.set(
        s.point.x + s.binormal.x * halfWidth,
        s.point.y + 0.45,
        s.point.z + s.binormal.z * halfWidth
      );
      postMesh.castShadow = true;
      this.stageGroup.add(postMesh);

      // Horizontal beam
      const beamGeom = new THREE.BoxGeometry(0.12, 0.35, 4.2);
      const beamMesh = new THREE.Mesh(beamGeom, railMaterial);
      beamMesh.position.set(
        s.point.x + s.binormal.x * halfWidth,
        s.point.y + 0.55,
        s.point.z + s.binormal.z * halfWidth
      );
      beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), s.tangent);
      beamMesh.castShadow = true;
      this.stageGroup.add(beamMesh);
    }
  }

  _generateCorridorTerrain(stageData) {
    const samples = this.sampleCache;
    const numSamples = samples.length;
    const terrainWidth = 120; // 120m terrain expanse on each side

    const terrainGeom = new THREE.PlaneGeometry(terrainWidth * 2, this.totalDistance * 1.05, 40, 60);
    terrainGeom.rotateX(-Math.PI / 2);

    // Sculpt terrain heights with natural mountain dips and valleys
    const pos = terrainGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Procedural mountain undulations
      const mountainNoise = Math.sin(x * 0.035) * Math.cos(z * 0.015) * 25.0
        + Math.sin(x * 0.08 + z * 0.05) * 8.0;

      // Keep corridor around road flat, slope up steeply outside road
      const distFromCenter = Math.abs(x);
      const corridorBlend = Math.min(1.0, Math.max(0.0, (distFromCenter - 8.0) / 40.0));
      pos.setY(i, mountainNoise * corridorBlend - 0.4);
    }
    terrainGeom.computeVertexNormals();

    const isSnow = stageData.surface === 'snow';
    const isForest = stageData.surface === 'gravel';
    const groundColor = isSnow ? 0xecf0f1 : isForest ? 0x2e4c27 : 0x4e342e;

    const terrainMat = new THREE.MeshStandardMaterial({
      color: groundColor,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });

    const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    terrainMesh.name = 'RallyMountainTerrain';
    terrainMesh.position.set(0, -0.2, this.totalDistance * 0.45);
    terrainMesh.receiveShadow = true;
    this.stageGroup.add(terrainMesh);
  }

  _spawnTracksideProps(stageData) {
    const samples = this.sampleCache;

    // 1. Start & Finish Gantry Gate Arches
    this._createGantryGate(samples[0], 'START');
    this._createGantryGate(samples[samples.length - 1], 'FINISH');

    // 2. Procedural Pine Trees along the corridor
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.8 });

    const trunkGeom = new THREE.CylinderGeometry(0.25, 0.4, 4.0, 6);
    const leavesGeom = new THREE.ConeGeometry(2.4, 7.5, 7);

    for (let i = 4; i < samples.length - 4; i += 3) {
      const s = samples[i];
      // Randomly spawn trees on left or right beyond shoulder
      for (const side of [-1, 1]) {
        if (Math.random() < 0.65) {
          const offsetDist = (s.width * 0.5 + 3.5 + Math.random() * 22) * side;
          const treeGroup = new THREE.Group();

          const trunk = new THREE.Mesh(trunkGeom, treeTrunkMat);
          trunk.position.y = 2.0;
          trunk.castShadow = true;

          const foliage = new THREE.Mesh(leavesGeom, treeFoliageMat);
          foliage.position.y = 6.0;
          foliage.castShadow = true;

          treeGroup.add(trunk);
          treeGroup.add(foliage);

          const scale = 0.8 + Math.random() * 0.5;
          treeGroup.scale.set(scale, scale, scale);

          treeGroup.position.set(
            s.point.x + s.binormal.x * offsetDist,
            s.point.y,
            s.point.z + s.binormal.z * offsetDist
          );
          this.stageGroup.add(treeGroup);
        }
      }
    }
  }

  _createGantryGate(sample, label) {
    if (!sample) return;

    const gateGroup = new THREE.Group();
    const gantryMat = new THREE.MeshStandardMaterial({
      color: label === 'START' ? 0x2e7d32 : 0xd32f2f,
      metalness: 0.7,
      roughness: 0.3
    });

    const poleGeom = new THREE.CylinderGeometry(0.18, 0.18, 6.5, 8);
    const leftPole = new THREE.Mesh(poleGeom, gantryMat);
    leftPole.position.set(-sample.width * 0.65, 3.25, 0);

    const rightPole = new THREE.Mesh(poleGeom, gantryMat);
    rightPole.position.set(sample.width * 0.65, 3.25, 0);

    const bannerGeom = new THREE.BoxGeometry(sample.width * 1.4, 1.2, 0.25);
    const banner = new THREE.Mesh(bannerGeom, gantryMat);
    banner.position.set(0, 5.8, 0);

    gateGroup.add(leftPole);
    gateGroup.add(rightPole);
    gateGroup.add(banner);

    gateGroup.position.copy(sample.point);
    gateGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), sample.tangent);
    this.stageGroup.add(gateGroup);
  }

  /**
   * Samples 3D point and heading on the road spline at specified distance
   * @param {number} distanceMeters
   * @returns {{x: number, y: number, z: number, heading: number}}
   */
  getPointAtDistance(distanceMeters) {
    if (!this.roadCurve || this.sampleCache.length === 0) {
      return { x: 0, y: 0.5, z: distanceMeters, heading: 0 };
    }

    const clampedDist = Math.max(0, Math.min(this.totalDistance, distanceMeters));
    const u = clampedDist / this.totalDistance;
    const pt = this.roadCurve.getPointAt(u);
    const tangent = this.roadCurve.getTangentAt(u).normalize();
    const heading = Math.atan2(tangent.x, tangent.z) * (180 / Math.PI);

    return {
      x: pt.x,
      y: pt.y,
      z: pt.z,
      heading
    };
  }

  clear() {
    while (this.stageGroup.children.length > 0) {
      const child = this.stageGroup.children[0];
      this.stageGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }
  }
}
