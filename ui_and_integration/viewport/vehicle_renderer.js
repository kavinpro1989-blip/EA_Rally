/**
 * @file /ui_and_integration/viewport/vehicle_renderer.js
 * @description 3D Rally Vehicle Mesh Generator, Livery Textures, Aero Kits, and Suspension Kinematics.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import * as THREE from 'three';
import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';

export class VehicleRenderer {
  constructor(scene) {
    this.scene = scene;
    this.carRoot = new THREE.Group();
    this.carRoot.name = 'RallyCarRoot';
    this.scene.add(this.carRoot);

    this.wheelRadius = 0.33;
    this.wheelWidth = 0.24;

    // References to dynamic car parts
    this.bodyMesh = null;
    this.bodyMaterial = null;
    this.steeringWheel = null;
    this.brakeDiscs = {};
    this.wheelMeshes = {};
    this.suspensionArms = {};
    this.aeroGroup = null;
    this.lightPodGroup = null;
    this.mudflapGroup = null;
    this.headlights = [];
    this.brakeLights = [];

    // Texture cache
    this.textureLoader = new THREE.TextureLoader();
    this.loadedTextures = {};

    this._buildCarHierarchy();
    this._setupEventListeners();
  }

  _buildCarHierarchy() {
    const tuning = stateStore.currentTuning;

    // 1. Main Car Body & Cockpit
    this._buildBodyMesh(tuning);

    // 2. Interior & Roll Cage
    this._buildInterior();

    // 3. 4-Corner Wheel Assemblies
    this._buildWheels(tuning);

    // 4. Aero Kits
    this.updateAeroKit(tuning.visual_parts?.aeroKit || 'wrc_spec_high_downforce');

    // 5. Hood Rally Light Pods
    this.updateLightPods(tuning.visual_parts?.lightPods || 'quad_hella_hood');

    // 6. Mudflaps
    this.updateMudflaps(tuning.visual_parts?.mudflaps || 'rally_red');

    // 7. Headlights & Taillights
    this._buildLighting();

    // 8. Load Active Livery Texture
    this.loadLiveryTexture(tuning.visual_parts?.liveryPreset || 'wrc_red');
  }

  _buildBodyMesh(tuning) {
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'CarBodyGroup';

    // Base body material with custom paint
    const bodyColor = tuning.visual_parts?.bodyColor || '#e10600';
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bodyColor),
      metalness: 0.75,
      roughness: 0.32,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });

    // Aerodynamic Rally Hatchback Chassis Geometry
    // Lower body / sill
    const lowerBodyGeom = new THREE.BoxGeometry(1.85, 0.48, 4.1, 4, 2, 8);
    // Bevel front and rear
    const pos = lowerBodyGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      const y = pos.getY(i);
      if (z > 1.2) {
        // Taper front hood down
        pos.setY(i, y - (z - 1.2) * 0.18);
      } else if (z < -1.4) {
        // Rear taper
        pos.setY(i, y + 0.08);
      }
    }
    lowerBodyGeom.computeVertexNormals();

    this.bodyMesh = new THREE.Mesh(lowerBodyGeom, this.bodyMaterial);
    this.bodyMesh.position.y = 0.48;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    bodyGroup.add(this.bodyMesh);

    // Cabin / Roof Canopy
    const cabinGeom = new THREE.BoxGeometry(1.48, 0.52, 2.1);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.75,
      transparent: true,
      opacity: 0.85
    });

    const cabinMesh = new THREE.Mesh(cabinGeom, glassMat);
    cabinMesh.position.set(0, 0.88, -0.2);
    cabinMesh.castShadow = true;
    bodyGroup.add(cabinMesh);

    // Roof air scoop
    const scoopGeom = new THREE.BoxGeometry(0.38, 0.12, 0.65);
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.8 });
    const scoopMesh = new THREE.Mesh(scoopGeom, carbonMat);
    scoopMesh.position.set(0, 1.18, 0.2);
    scoopMesh.castShadow = true;
    bodyGroup.add(scoopMesh);

    // Widebody Fenders
    const fenderMat = this.bodyMaterial;
    for (const [xOffset, zOffset] of [[-0.95, 1.25], [0.95, 1.25], [-0.95, -1.25], [0.95, -1.25]]) {
      const fenderGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.18, 16, 1, false, 0, Math.PI);
      fenderGeom.rotateZ(Math.PI / 2);
      fenderGeom.rotateY(xOffset > 0 ? -Math.PI / 2 : Math.PI / 2);

      const fender = new THREE.Mesh(fenderGeom, fenderMat);
      fender.position.set(xOffset, 0.45, zOffset);
      fender.castShadow = true;
      bodyGroup.add(fender);
    }

    // Front aggressive splitter
    const splitterGeom = new THREE.BoxGeometry(1.82, 0.06, 0.45);
    const splitter = new THREE.Mesh(splitterGeom, carbonMat);
    splitter.position.set(0, 0.22, 2.05);
    splitter.castShadow = true;
    bodyGroup.add(splitter);

    // Rear diffuser
    const diffuserGeom = new THREE.BoxGeometry(1.72, 0.18, 0.48);
    const diffuser = new THREE.Mesh(diffuserGeom, carbonMat);
    diffuser.position.set(0, 0.26, -2.0);
    diffuser.castShadow = true;
    bodyGroup.add(diffuser);

    // Dual exhaust tailpipes
    const exhaustGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.35, 12);
    exhaustGeom.rotateX(Math.PI / 2);
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.2 });

    const exhaustPipeL = new THREE.Mesh(exhaustGeom, exhaustMat);
    exhaustPipeL.position.set(-0.45, 0.24, -2.15);
    const exhaustPipeR = new THREE.Mesh(exhaustGeom, exhaustMat);
    exhaustPipeR.position.set(0.45, 0.24, -2.15);
    bodyGroup.add(exhaustPipeL);
    bodyGroup.add(exhaustPipeR);

    this.carRoot.add(bodyGroup);
    this.carBodyGroup = bodyGroup;
  }

  _buildInterior() {
    const cageMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.8, roughness: 0.3 });
    const barGeom = new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8);

    // Roll cage cross tubes
    const cageL = new THREE.Mesh(barGeom, cageMat);
    cageL.position.set(-0.55, 0.85, -0.2);
    cageL.rotateX(Math.PI / 4);

    const cageR = new THREE.Mesh(barGeom, cageMat);
    cageR.position.set(0.55, 0.85, -0.2);
    cageR.rotateX(-Math.PI / 4);

    this.carBodyGroup.add(cageL);
    this.carBodyGroup.add(cageR);

    // Rally Steering Wheel
    const wheelTorus = new THREE.TorusGeometry(0.18, 0.022, 8, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    this.steeringWheel = new THREE.Mesh(wheelTorus, wheelMat);
    this.steeringWheel.position.set(-0.35, 0.78, 0.35);
    this.steeringWheel.rotateX(-Math.PI / 3.5);
    this.carBodyGroup.add(this.steeringWheel);
  }

  _buildWheels(tuning) {
    const wheelOffsets = {
      fl: { x: -0.92, z: 1.25 },
      fr: { x: 0.92, z: 1.25 },
      rl: { x: -0.92, z: -1.25 },
      rr: { x: 0.92, z: -1.25 }
    };

    const rimColor = tuning.visual_parts?.rimColor || '#f0f0f0';
    const caliperColor = tuning.visual_parts?.brakeCaliperColor || '#ff1a1a';

    // Materials
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.92, metalness: 0.08 });
    const rimMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(rimColor), metalness: 0.85, roughness: 0.25 });
    const caliperMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(caliperColor), metalness: 0.7, roughness: 0.3 });

    for (const [id, offset] of Object.entries(wheelOffsets)) {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.name = `WheelAssembly_${id}`;

      // 1. Rotating hub (tire + rim + brake rotor)
      const rotatingHub = new THREE.Group();
      rotatingHub.name = `RotatingHub_${id}`;

      // Rubber Tire
      const tireGeom = new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, this.wheelWidth, 24);
      tireGeom.rotateZ(Math.PI / 2);
      const tireMesh = new THREE.Mesh(tireGeom, tireMat);
      tireMesh.castShadow = true;
      rotatingHub.add(tireMesh);

      // Alloy Rim
      const rimGeom = new THREE.CylinderGeometry(this.wheelRadius * 0.75, this.wheelRadius * 0.75, this.wheelWidth * 1.02, 16);
      rimGeom.rotateZ(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeom, rimMat);
      rotatingHub.add(rimMesh);

      // Brake Rotor Disc (with emissive glow material for hard braking)
      const brakeGeom = new THREE.CylinderGeometry(this.wheelRadius * 0.65, this.wheelRadius * 0.65, 0.03, 16);
      brakeGeom.rotateZ(Math.PI / 2);
      const brakeMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.95,
        roughness: 0.2,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.0
      });
      const brakeDisc = new THREE.Mesh(brakeGeom, brakeMat);
      rotatingHub.add(brakeDisc);
      this.brakeDiscs[id] = brakeMat;

      wheelAssembly.add(rotatingHub);

      // 2. Fixed Brake Caliper
      const caliperGeom = new THREE.BoxGeometry(0.12, 0.16, 0.18);
      const caliperMesh = new THREE.Mesh(caliperGeom, caliperMat);
      caliperMesh.position.set(offset.x > 0 ? -0.06 : 0.06, 0.12, 0);
      wheelAssembly.add(caliperMesh);

      wheelAssembly.position.set(offset.x, 0.35, offset.z);
      this.carRoot.add(wheelAssembly);

      this.wheelMeshes[id] = {
        assembly: wheelAssembly,
        rotatingHub,
        baseY: 0.35,
        offset
      };
    }
  }

  _buildLighting() {
    // 1. High-power Rally Headlight Beams (Spotlights)
    const headlightTargetL = new THREE.Object3D();
    headlightTargetL.position.set(-0.6, 0.3, 15);
    this.carRoot.add(headlightTargetL);

    const headlightL = new THREE.SpotLight(0xffffff, 4.0, 75, Math.PI / 5, 0.45, 1.2);
    headlightL.position.set(-0.65, 0.5, 2.0);
    headlightL.target = headlightTargetL;
    headlightL.castShadow = true;
    headlightL.shadow.mapSize.width = 1024;
    headlightL.shadow.mapSize.height = 1024;
    this.carRoot.add(headlightL);

    const headlightTargetR = new THREE.Object3D();
    headlightTargetR.position.set(0.6, 0.3, 15);
    this.carRoot.add(headlightTargetR);

    const headlightR = new THREE.SpotLight(0xffffff, 4.0, 75, Math.PI / 5, 0.45, 1.2);
    headlightR.position.set(0.65, 0.5, 2.0);
    headlightR.target = headlightTargetR;
    headlightR.castShadow = true;
    this.carRoot.add(headlightR);

    this.headlights = [headlightL, headlightR];

    // 2. Rear Tail & Brake Lamp Emissive Meshes
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xcc0000,
      emissive: new THREE.Color(0xff1111),
      emissiveIntensity: 0.8
    });

    const tailGeom = new THREE.BoxGeometry(0.32, 0.12, 0.05);
    const tailL = new THREE.Mesh(tailGeom, tailMat);
    tailL.position.set(-0.7, 0.65, -2.05);
    const tailR = new THREE.Mesh(tailGeom, tailMat);
    tailR.position.set(0.7, 0.65, -2.05);

    this.carBodyGroup.add(tailL);
    this.carBodyGroup.add(tailR);
    this.brakeLights = [tailL, tailR];
  }

  /**
   * Swap and configure Aero Kits
   * @param {'wrc_spec_high_downforce' | 'group_b_big_wing' | 'gravel_clubman'} kitType
   */
  updateAeroKit(kitType) {
    if (this.aeroGroup) {
      this.carBodyGroup.remove(this.aeroGroup);
    }

    this.aeroGroup = new THREE.Group();
    this.aeroGroup.name = 'AeroKitGroup';
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.4, metalness: 0.8 });

    if (kitType === 'wrc_spec_high_downforce') {
      // Modern WRC aggressive swan-neck rear wing with endplates
      const wingMain = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.05, 0.42), carbonMat);
      wingMain.position.set(0, 1.15, -1.85);
      wingMain.rotateX(0.12);

      const endplateGeom = new THREE.BoxGeometry(0.04, 0.38, 0.52);
      const endplateL = new THREE.Mesh(endplateGeom, carbonMat);
      endplateL.position.set(-0.86, 1.15, -1.85);
      const endplateR = new THREE.Mesh(endplateGeom, carbonMat);
      endplateR.position.set(0.86, 1.15, -1.85);

      const pylonGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.45);
      const pylonL = new THREE.Mesh(pylonGeom, carbonMat);
      pylonL.position.set(-0.45, 0.95, -1.85);
      const pylonR = new THREE.Mesh(pylonGeom, carbonMat);
      pylonR.position.set(0.45, 0.95, -1.85);

      this.aeroGroup.add(wingMain, endplateL, endplateR, pylonL, pylonR);
    } else if (kitType === 'group_b_big_wing') {
      // Massive dual-plane Group B rally monster wing
      const wing1 = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.06, 0.5), carbonMat);
      wing1.position.set(0, 1.25, -1.88);
      wing1.rotateX(0.16);

      const wing2 = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 0.4), carbonMat);
      wing2.position.set(0, 1.0, -1.78);
      wing2.rotateX(0.08);

      const hugeEndplate = new THREE.BoxGeometry(0.05, 0.65, 0.65);
      const plateL = new THREE.Mesh(hugeEndplate, carbonMat);
      plateL.position.set(-0.92, 1.12, -1.85);
      const plateR = new THREE.Mesh(hugeEndplate, carbonMat);
      plateR.position.set(0.92, 1.12, -1.85);

      this.aeroGroup.add(wing1, wing2, plateL, plateR);
    } else {
      // Clubman ducktail spoiler
      const ducktail = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.12, 0.28), carbonMat);
      ducktail.position.set(0, 0.78, -1.95);
      ducktail.rotateX(0.28);
      this.aeroGroup.add(ducktail);
    }

    this.carBodyGroup.add(this.aeroGroup);
  }

  /**
   * Swap Hood Auxiliary Rally Light Pods
   * @param {'quad_hella_hood' | 'led_lightbar' | 'clean_stock'} podType
   */
  updateLightPods(podType) {
    if (this.lightPodGroup) {
      this.carBodyGroup.remove(this.lightPodGroup);
    }

    this.lightPodGroup = new THREE.Group();
    this.lightPodGroup.name = 'LightPodGroup';

    if (podType === 'quad_hella_hood') {
      const podCaseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
      const podGlassMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(0xfffae0),
        emissiveIntensity: 2.2
      });

      const podOffsets = [-0.45, -0.15, 0.15, 0.45];
      for (const x of podOffsets) {
        const podGeom = new THREE.CylinderGeometry(0.11, 0.09, 0.12, 16);
        podGeom.rotateX(Math.PI / 2);
        const podMesh = new THREE.Mesh(podGeom, podCaseMat);

        const glassGeom = new THREE.CircleGeometry(0.1, 16);
        const glass = new THREE.Mesh(glassGeom, podGlassMat);
        glass.position.z = 0.062;
        podMesh.add(glass);

        podMesh.position.set(x, 0.76, 1.45);
        this.lightPodGroup.add(podMesh);
      }
    } else if (podType === 'led_lightbar') {
      const barCase = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.08, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.9 })
      );
      const ledLens = new THREE.Mesh(
        new THREE.BoxGeometry(1.04, 0.05, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: new THREE.Color(0xaae8ff),
          emissiveIntensity: 3.5
        })
      );
      ledLens.position.z = 0.065;
      barCase.add(ledLens);
      barCase.position.set(0, 0.74, 1.48);
      this.lightPodGroup.add(barCase);
    }

    this.carBodyGroup.add(this.lightPodGroup);
  }

  /**
   * Update Mudflaps
   * @param {'rally_red' | 'neon_yellow' | 'stealth_black' | 'none'} flapType
   */
  updateMudflaps(flapType) {
    if (this.mudflapGroup) {
      this.carRoot.remove(this.mudflapGroup);
    }

    if (flapType === 'none') return;

    this.mudflapGroup = new THREE.Group();
    this.mudflapGroup.name = 'MudflapGroup';

    const colors = {
      rally_red: 0xd32f2f,
      neon_yellow: 0xc6ff00,
      stealth_black: 0x1f1f1f
    };
    const flapMat = new THREE.MeshStandardMaterial({
      color: colors[flapType] || 0xd32f2f,
      roughness: 0.85
    });

    const flapGeom = new THREE.BoxGeometry(0.24, 0.32, 0.02);
    for (const [x, z] of [[-0.92, 0.95], [0.92, 0.95], [-0.92, -1.55], [0.92, -1.55]]) {
      const flap = new THREE.Mesh(flapGeom, flapMat);
      flap.position.set(x, 0.22, z);
      this.mudflapGroup.add(flap);
    }

    this.carRoot.add(this.mudflapGroup);
  }

  /**
   * Loads and wraps AI-generated livery textures onto car body
   * @param {'wrc_red' | 'mud_camo' | 'stealth_carbon' | string} liveryId
   */
  loadLiveryTexture(liveryId) {
    const texturePaths = {
      wrc_red: '/textures/livery_wrc_red.jpg',
      mud_camo: '/textures/livery_mud_camo.jpg',
      stealth_carbon: '/textures/livery_stealth_carbon.jpg'
    };

    const path = texturePaths[liveryId] || texturePaths.wrc_red;

    if (this.loadedTextures[path]) {
      this._applyTexture(this.loadedTextures[path]);
      return;
    }

    this.textureLoader.load(
      path,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1.5, 1.5);
        this.loadedTextures[path] = texture;
        this._applyTexture(texture);
      },
      undefined,
      (err) => {
        console.warn(`[VehicleRenderer] Livery texture load error for ${path}:`, err);
      }
    );
  }

  _applyTexture(texture) {
    if (this.bodyMaterial) {
      this.bodyMaterial.map = texture;
      this.bodyMaterial.needsUpdate = true;
    }
  }

  _setupEventListeners() {
    // Listen for tuning updates from Garage
    eventBus.on(RALLY_EVENTS.TUNING_UPDATED, ({ section, key, value, fullTuning }) => {
      if (section === 'visual_parts' || section === 'all') {
        const vp = fullTuning.visual_parts;
        if (vp.aeroKit) this.updateAeroKit(vp.aeroKit);
        if (vp.lightPods) this.updateLightPods(vp.lightPods);
        if (vp.mudflaps) this.updateMudflaps(vp.mudflaps);
        if (vp.liveryPreset) this.loadLiveryTexture(vp.liveryPreset);
        if (vp.bodyColor && this.bodyMaterial) {
          this.bodyMaterial.color.set(vp.bodyColor);
        }
      }
    });

    eventBus.on(RALLY_EVENTS.VISUAL_PART_CHANGED, ({ partType, value }) => {
      if (partType === 'aeroKit') this.updateAeroKit(value);
      if (partType === 'lightPods') this.updateLightPods(value);
      if (partType === 'mudflaps') this.updateMudflaps(value);
      if (partType === 'liveryPreset') this.loadLiveryTexture(value);
    });
  }

  /**
   * Synchronize 3D Vehicle transforms, suspension articulation, wheel spin, and glow with physics telemetry.
   * @param {Object} telemetry Live telemetry frame
   * @param {RallyParticleSystem} [particleSystem]
   */
  update(telemetry, particleSystem) {
    if (!telemetry) return;

    const { vehicle, suspension, tires, gForces } = telemetry;

    // 1. Root Position & Yaw Rotation
    const pb = stateStore.physicsBridge || {};
    this.carRoot.position.set(
      telemetry.position?.x || pb.position?.x || 0,
      telemetry.position?.y || pb.position?.y || 0.48,
      telemetry.position?.z || pb.position?.z || 0
    );

    const yawRad = (pb.rotation?.yaw || 0) * (Math.PI / 180);
    this.carRoot.rotation.y = yawRad;

    // 2. Chassis Pitch & Roll (Weight transfer tilt)
    const pitchRad = (gForces.longitudinalG * 0.05); // Dive forward on braking
    const rollRad = (gForces.lateralG * 0.065); // Lean outwards on turns
    this.carBodyGroup.rotation.x = pitchRad;
    this.carBodyGroup.rotation.z = -rollRad;

    // 3. Steering Wheel Rotation
    if (this.steeringWheel) {
      this.steeringWheel.rotation.z = -(vehicle.steeringAngleDeg * (Math.PI / 180)) * 2.5;
    }

    // 4. Wheel Assemblies & Suspension Kinematics
    for (const [id, data] of Object.entries(this.wheelMeshes)) {
      const susp = suspension[id];
      const tire = tires[id];

      // Vertical suspension travel compression
      const travelOffsetM = ((susp.travelMm - 140) / 1000);
      data.assembly.position.y = data.baseY + travelOffsetM;

      // Wheel steer angle (FL, FR)
      if (id === 'fl' || id === 'fr') {
        data.assembly.rotation.y = (vehicle.steeringAngleDeg * (Math.PI / 180));
      }

      // Wheel continuous spinning
      const wheelSpeedRad = (vehicle.speedKph / 3.6 / this.wheelRadius) * 0.016;
      data.rotatingHub.rotation.x += wheelSpeedRad;

      // Brake Rotor Thermal Glow under heavy braking
      const discMat = this.brakeDiscs[id];
      if (discMat) {
        if (vehicle.brake > 0.4 && vehicle.speedKph > 15) {
          discMat.emissive.setHex(0xff3300);
          discMat.emissiveIntensity = THREE.MathUtils.lerp(discMat.emissiveIntensity, vehicle.brake * 2.5, 0.1);
        } else {
          discMat.emissiveIntensity = THREE.MathUtils.lerp(discMat.emissiveIntensity, 0.0, 0.05);
        }
      }

      // Particle Dust & Gravel kickups
      if (particleSystem) {
        const wheelWorldPos = new THREE.Vector3();
        data.assembly.getWorldPosition(wheelWorldPos);
        particleSystem.emitWheelDust(wheelWorldPos, tire.slipAngleDeg, vehicle.speedKph / 3.6);
      }
    }

    // 5. Brake Lights Intensity
    for (const lamp of this.brakeLights) {
      lamp.material.emissiveIntensity = vehicle.brake > 0.1 ? 2.5 : 0.6;
    }
  }
}
