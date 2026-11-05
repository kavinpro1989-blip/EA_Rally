/**
 * @file /ui_and_integration/viewport/scene_manager.js
 * @description Master Three.js Scene Orchestrator, Lighting, Tone Mapping, and Render Pipeline.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import * as THREE from 'three';
import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';
import { StageMeshGenerator } from './stage_mesh_generator.js';
import { VehicleRenderer } from './vehicle_renderer.js';
import { RallyParticleSystem } from './particle_system.js';
import { RallyCameraRig } from './camera_rig.js';
import { physicsBridge } from '../core/physics_bridge.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = canvasContainer.clientWidth || window.innerWidth;
    this.height = canvasContainer.clientHeight || window.innerHeight;

    this.clock = new THREE.Clock();
    this.lastTelemetry = null;

    // 1. Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 2000);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    // 2. Subsystems
    this.stageMeshGen = new StageMeshGenerator(this.scene);
    this.vehicleRenderer = new VehicleRenderer(this.scene);
    this.particleSystem = new RallyParticleSystem(this.scene);
    this.cameraRig = new RallyCameraRig(this.camera);

    // 3. Dynamic Environment Lighting
    this.dirLight = null;
    this.hemiLight = null;
    this._setupEnvironmentLighting();

    // 4. Build Active Stage
    this.buildActiveStage();

    // 5. Connect Physics Spline
    physicsBridge.setStageSpline(this.stageMeshGen);

    // 6. Bind Event Handlers
    this._setupEventListeners();

    // 7. Start Render Loop
    this._startRenderLoop();
  }

  _setupEnvironmentLighting() {
    // Hemisphere Light (Sky vs Ground bounce)
    this.hemiLight = new THREE.HemisphereLight(0xffeedd, 0x332211, 0.7);
    this.scene.add(this.hemiLight);

    // Directional Sunlight with Shadows
    this.dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.dirLight.position.set(250, 300, -200);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 800;
    this.dirLight.shadow.bias = -0.0004;

    const shadowBoxSize = 90;
    this.dirLight.shadow.camera.left = -shadowBoxSize;
    this.dirLight.shadow.camera.right = shadowBoxSize;
    this.dirLight.shadow.camera.top = shadowBoxSize;
    this.dirLight.shadow.camera.bottom = -shadowBoxSize;

    this.scene.add(this.dirLight);
    this.scene.add(this.dirLight.target);
  }

  /**
   * Builds the stage from the state store active stage configuration
   */
  buildActiveStage() {
    const stage = stateStore.activeStage;
    if (!stage) return;

    // Configure stage atmosphere & fog
    const amb = stage.ambientLighting || {};
    this.scene.background = new THREE.Color(amb.skyColor || 0x87ceeb);
    this.scene.fog = new THREE.FogExp2(
      new THREE.Color(amb.fogColor || 0xb0c4de),
      amb.fogDensity || 0.0006
    );

    if (this.hemiLight) {
      this.hemiLight.color.set(amb.skyColor || 0xffeedd);
      this.hemiLight.groundColor.set(amb.groundColor || 0x3e2723);
    }
    if (this.dirLight) {
      this.dirLight.color.set(amb.sunColor || 0xfffaed);
      if (amb.sunPosition) {
        this.dirLight.position.set(amb.sunPosition[0], amb.sunPosition[1], amb.sunPosition[2]);
      }
    }

    // Extrude 3D road and terrain
    this.stageMeshGen.buildStage(stage);
    physicsBridge.setStageSpline(this.stageMeshGen);
  }

  _setupEventListeners() {
    // Window Resize
    window.addEventListener('resize', this.onResize);

    // Telemetry updates from physics bridge
    eventBus.on(RALLY_EVENTS.TELEMETRY_UPDATE, (telemetry) => {
      this.lastTelemetry = telemetry;
    });

    // Stage changes
    eventBus.on(RALLY_EVENTS.STAGE_SELECTED, () => {
      this.buildActiveStage();
    });

    eventBus.on(RALLY_EVENTS.STAGE_COMPILED, () => {
      this.buildActiveStage();
    });
  }

  onResize = () => {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    eventBus.emit(RALLY_EVENTS.VIEWPORT_RESIZED, { width: this.width, height: this.height });
  };

  _startRenderLoop = () => {
    requestAnimationFrame(this._startRenderLoop);

    const dt = Math.min(this.clock.getDelta(), 0.1);

    // 1. Update Vehicle 3D Kinematics & Glow
    if (this.lastTelemetry) {
      this.vehicleRenderer.update(this.lastTelemetry, this.particleSystem);

      // Follow directional light target with car
      if (this.dirLight && this.vehicleRenderer.carRoot) {
        const carPos = this.vehicleRenderer.carRoot.position;
        this.dirLight.target.position.set(carPos.x, carPos.y, carPos.z);
        this.dirLight.target.updateMatrixWorld();
      }
    }

    // 2. Update Particle Systems (Dust, Gravel, Flames)
    this.particleSystem.update(dt);

    // 3. Update Camera Rig
    if (this.vehicleRenderer.carRoot) {
      this.cameraRig.update(this.lastTelemetry, this.vehicleRenderer.carRoot, dt);
    }

    // 4. Render Scene
    this.renderer.render(this.scene, this.camera);
  };
}
