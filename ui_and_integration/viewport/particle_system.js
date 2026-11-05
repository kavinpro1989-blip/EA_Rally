/**
 * @file /ui_and_integration/viewport/particle_system.js
 * @description High-Performance GPU/Instanced Particle System for Gravel Kickups, Mud, Dust, and Exhaust Flames.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import * as THREE from 'three';
import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';

export class RallyParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.maxDustParticles = 600;
    this.maxFlameParticles = 80;

    this.dustParticles = [];
    this.flameParticles = [];

    this._initDustMesh();
    this._initFlameMesh();
    this._setupListeners();
  }

  _initDustMesh() {
    // Instanced mesh for dust and gravel chunks
    const geom = new THREE.DodecahedronGeometry(0.18, 1);
    this.dustMaterial = new THREE.MeshStandardMaterial({
      color: 0x9e8871,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });

    this.dustInstancedMesh = new THREE.InstancedMesh(geom, this.dustMaterial, this.maxDustParticles);
    this.dustInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.dustInstancedMesh.name = 'RallyDustParticles';
    this.scene.add(this.dustInstancedMesh);

    // Dummy transformation object
    this.dummy = new THREE.Object3D();

    // Pool of active dust particles
    for (let i = 0; i < this.maxDustParticles; i++) {
      this.dustParticles.push({
        active: false,
        x: 0, y: 0, z: 0,
        vx: 0, vy: 0, vz: 0,
        scale: 0.1,
        maxScale: 1.2,
        life: 0,
        maxLife: 1.0,
        index: i
      });
      this.dummy.position.set(0, -9999, 0);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.dustInstancedMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.dustInstancedMesh.instanceMatrix.needsUpdate = true;
  }

  _initFlameMesh() {
    // Instanced flame particles for exhaust backfire pops
    const flameGeom = new THREE.SphereGeometry(0.08, 6, 6);
    this.flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff7700,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.flameInstancedMesh = new THREE.InstancedMesh(flameGeom, this.flameMaterial, this.maxFlameParticles);
    this.flameInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.flameInstancedMesh.name = 'RallyExhaustFlames';
    this.scene.add(this.flameInstancedMesh);

    for (let i = 0; i < this.maxFlameParticles; i++) {
      this.flameParticles.push({
        active: false,
        x: 0, y: 0, z: 0,
        vx: 0, vy: 0, vz: 0,
        scale: 0.2,
        life: 0,
        maxLife: 0.25,
        index: i
      });
      this.dummy.position.set(0, -9999, 0);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.flameInstancedMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.flameInstancedMesh.instanceMatrix.needsUpdate = true;
  }

  _setupListeners() {
    eventBus.on(RALLY_EVENTS.BACKFIRE_POP, () => {
      this.spawnExhaustBackfire();
    });

    // Adapt particle color to active surface (gravel, snow, tarmac)
    eventBus.on(RALLY_EVENTS.STAGE_SELECTED, ({ stage }) => {
      this.updateSurfaceColor(stage.surface);
    });
  }

  updateSurfaceColor(surface) {
    if (surface === 'snow') {
      this.dustMaterial.color.setHex(0xe8ecef);
      this.dustMaterial.opacity = 0.75;
    } else if (surface === 'gravel' || surface === 'rocky') {
      this.dustMaterial.color.setHex(0xa1887f);
      this.dustMaterial.opacity = 0.65;
    } else {
      // Tarmac tire smoke
      this.dustMaterial.color.setHex(0xcccccc);
      this.dustMaterial.opacity = 0.45;
    }
  }

  /**
   * Spawn dust plumes and gravel kicks behind tires
   * @param {THREE.Vector3} wheelPos World position of wheel
   * @param {number} slipAngle
   * @param {number} speedMs
   */
  emitWheelDust(wheelPos, slipAngle, speedMs) {
    if (speedMs < 2.0 && Math.abs(slipAngle) < 5.0) return;

    // Number of particles proportional to speed & slip
    const count = Math.min(3, Math.floor((speedMs / 25) + (Math.abs(slipAngle) / 8)));

    for (let c = 0; c < count; c++) {
      const p = this.dustParticles.find(item => !item.active);
      if (!p) break;

      p.active = true;
      p.x = wheelPos.x + (Math.random() - 0.5) * 0.35;
      p.y = wheelPos.y + 0.08;
      p.z = wheelPos.z + (Math.random() - 0.5) * 0.35;

      p.vx = (Math.random() - 0.5) * 1.8;
      p.vy = 0.6 + Math.random() * 1.6;
      p.vz = -(speedMs * 0.25) + (Math.random() - 0.5) * 1.2;

      p.scale = 0.15;
      p.maxScale = 1.0 + Math.random() * 1.4;
      p.life = 0;
      p.maxLife = 0.8 + Math.random() * 0.8;
    }
  }

  /**
   * Spawn explosive exhaust backfire flame
   * @param {THREE.Vector3} exhaustPos Tailpipe position in world coordinates
   */
  spawnExhaustBackfire(exhaustPos) {
    const pos = exhaustPos || new THREE.Vector3(0.55, 0.35, -2.15);
    const count = 12 + Math.floor(Math.random() * 10);

    for (let c = 0; c < count; c++) {
      const p = this.flameParticles.find(item => !item.active);
      if (!p) break;

      p.active = true;
      p.x = pos.x + (Math.random() - 0.5) * 0.12;
      p.y = pos.y + (Math.random() - 0.5) * 0.12;
      p.z = pos.z - Math.random() * 0.3;

      p.vx = (Math.random() - 0.5) * 0.8;
      p.vy = (Math.random() - 0.5) * 0.6;
      p.vz = -2.5 - Math.random() * 3.5; // Shot backwards from tailpipe

      p.scale = 0.25 + Math.random() * 0.3;
      p.life = 0;
      p.maxLife = 0.18 + Math.random() * 0.12;
    }
  }

  /**
   * Update particle positions, velocities, and fade animations
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    let dustNeedsUpdate = false;
    let flameNeedsUpdate = false;

    // 1. Update Dust & Gravel
    for (const p of this.dustParticles) {
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        this.dummy.position.set(0, -9999, 0);
        this.dummy.scale.set(0, 0, 0);
        this.dummy.updateMatrix();
        this.dustInstancedMesh.setMatrixAt(p.index, this.dummy.matrix);
        dustNeedsUpdate = true;
        continue;
      }

      const lifeRatio = p.life / p.maxLife;
      // Air drag slows particle velocity
      p.vx *= Math.pow(0.4, dt);
      p.vy += (0.4 - p.vy) * dt * 2.0; // Thermal rise
      p.vz *= Math.pow(0.4, dt);

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      // Expand cloud puff as it ages
      const currentScale = THREE.MathUtils.lerp(p.scale, p.maxScale, lifeRatio);
      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.scale.set(currentScale, currentScale, currentScale);
      this.dummy.updateMatrix();
      this.dustInstancedMesh.setMatrixAt(p.index, this.dummy.matrix);
      dustNeedsUpdate = true;
    }

    // 2. Update Exhaust Flames
    for (const p of this.flameParticles) {
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        this.dummy.position.set(0, -9999, 0);
        this.dummy.scale.set(0, 0, 0);
        this.dummy.updateMatrix();
        this.flameInstancedMesh.setMatrixAt(p.index, this.dummy.matrix);
        flameNeedsUpdate = true;
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      const shrink = (1.0 - (p.life / p.maxLife)) * p.scale;
      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.scale.set(shrink, shrink, shrink);
      this.dummy.updateMatrix();
      this.flameInstancedMesh.setMatrixAt(p.index, this.dummy.matrix);
      flameNeedsUpdate = true;
    }

    if (dustNeedsUpdate) {
      this.dustInstancedMesh.instanceMatrix.needsUpdate = true;
    }
    if (flameNeedsUpdate) {
      this.flameInstancedMesh.instanceMatrix.needsUpdate = true;
    }
  }
}
