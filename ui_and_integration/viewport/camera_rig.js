/**
 * @file /ui_and_integration/viewport/camera_rig.js
 * @description Dynamic Chase, Onboard Cockpit, and Helicopter Camera Rigs with Speed FOV and Drift Lookahead.
 * Lead Frontend & Three.js 3D Viewport Engineer - EA Rally Integration
 */

import * as THREE from 'three';
import { eventBus, RALLY_EVENTS } from '../core/event_bus.js';
import { stateStore } from '../core/state_store.js';

export class RallyCameraRig {
  constructor(camera) {
    this.camera = camera;
    this.currentMode = stateStore.cameraMode || 'chase';

    // Camera target and position smoothing vectors
    this.currentPosition = new THREE.Vector3(0, 5, -10);
    this.currentTarget = new THREE.Vector3(0, 1, 0);

    // Chase Camera parameters
    this.chaseDistance = 6.4;
    this.chaseHeight = 2.1;
    this.chaseLookAtHeight = 1.2;
    this.chaseLagDamping = 6.5;

    // Helicopter Camera parameters
    this.heliAngle = 0;
    this.heliHeight = 24.0;
    this.heliDistance = 38.0;

    // Head vibration & G-force tilt
    this.vibrationOffset = new THREE.Vector3();

    this._setupListeners();
  }

  _setupListeners() {
    eventBus.on(RALLY_EVENTS.CAMERA_VIEW_CHANGED, ({ mode }) => {
      this.currentMode = mode;
      eventBus.emit(RALLY_EVENTS.NOTIFICATION, {
        title: 'Camera Angle',
        message: mode.toUpperCase()
      });
    });
  }

  /**
   * Update camera position, orientation, and field-of-view tracking vehicle physics.
   * @param {Object} telemetry Live telemetry frame
   * @param {THREE.Group} carRoot 3D vehicle root object
   * @param {number} dt Delta time in seconds
   */
  update(telemetry, carRoot, dt) {
    if (!carRoot) return;

    const carPos = new THREE.Vector3();
    carRoot.getWorldPosition(carPos);

    const carRotY = carRoot.rotation.y;
    const speedKph = telemetry?.vehicle?.speedKph || 0;
    const speedRatio = Math.min(1.0, speedKph / 180.0);

    if (this.currentMode === 'chase') {
      this._updateChaseCamera(carPos, carRotY, telemetry, speedRatio, dt);
    } else if (this.currentMode === 'onboard') {
      this._updateOnboardCamera(carPos, carRotY, telemetry, dt);
    } else if (this.currentMode === 'helicopter') {
      this._updateHelicopterCamera(carPos, dt);
    }

    // Apply smoothed position and lookAt target
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  _updateChaseCamera(carPos, carRotY, telemetry, speedRatio, dt) {
    // 1. Dynamic FOV widening at high speeds (62 deg -> 76 deg)
    const targetFov = 62 + speedRatio * 14;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, dt * 4.0);
    this.camera.updateProjectionMatrix();

    // 2. Drift angle anticipation (swings camera outward during powerslides to see corner exit)
    const driftAngleDeg = telemetry?.gForces?.yawRateDegS ? telemetry.gForces.yawRateDegS * 0.25 : 0;
    const adjustedHeading = carRotY - (driftAngleDeg * Math.PI / 180);

    // 3. Compute desired camera world coordinates behind car
    const behindX = carPos.x - Math.sin(adjustedHeading) * this.chaseDistance;
    const behindZ = carPos.z - Math.cos(adjustedHeading) * this.chaseDistance;
    const targetY = carPos.y + this.chaseHeight + (speedRatio * 0.4);

    const desiredPos = new THREE.Vector3(behindX, targetY, behindZ);

    // Smooth spring interpolation
    const lerpFactor = Math.min(1.0, dt * this.chaseLagDamping);
    this.currentPosition.lerp(desiredPos, lerpFactor);

    // Aim ahead of vehicle
    const lookTarget = new THREE.Vector3(
      carPos.x + Math.sin(carRotY) * 4.5,
      carPos.y + this.chaseLookAtHeight,
      carPos.z + Math.cos(carRotY) * 4.5
    );
    this.currentTarget.lerp(lookTarget, lerpFactor * 1.5);
  }

  _updateOnboardCamera(carPos, carRotY, telemetry, dt) {
    this.camera.fov = 74;
    this.camera.updateProjectionMatrix();

    // Hood / Bonnet mounting position
    const hoodOffset = new THREE.Vector3(0, 0.95, 0.45);
    hoodOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY);

    // Engine RPM high frequency vibration
    const rpm = telemetry?.vehicle?.engineRpm || 1200;
    const vibMagnitude = (rpm / 8000) * 0.008;
    this.vibrationOffset.set(
      (Math.random() - 0.5) * vibMagnitude,
      (Math.random() - 0.5) * vibMagnitude,
      (Math.random() - 0.5) * vibMagnitude
    );

    // G-force head inertia (braking dips down, lateral cornering tilts side)
    const gLat = telemetry?.gForces?.lateralG || 0;
    const gLong = telemetry?.gForces?.longitudinalG || 0;

    const desiredPos = new THREE.Vector3()
      .copy(carPos)
      .add(hoodOffset)
      .add(this.vibrationOffset);

    this.currentPosition.copy(desiredPos);

    // Look straight ahead along car nose
    const lookAheadDist = 25.0;
    const lookTarget = new THREE.Vector3(
      carPos.x + Math.sin(carRotY) * lookAheadDist + gLat * 1.2,
      carPos.y + 1.1 + gLong * 0.8,
      carPos.z + Math.cos(carRotY) * lookAheadDist
    );
    this.currentTarget.copy(lookTarget);
  }

  _updateHelicopterCamera(carPos, dt) {
    this.camera.fov = 55;
    this.camera.updateProjectionMatrix();

    // Slowly orbiting aerial drone view
    this.heliAngle += dt * 0.15;

    const heliX = carPos.x + Math.sin(this.heliAngle) * this.heliDistance;
    const heliZ = carPos.z + Math.cos(this.heliAngle) * this.heliDistance;
    const heliY = carPos.y + this.heliHeight;

    const desiredPos = new THREE.Vector3(heliX, heliY, heliZ);
    this.currentPosition.lerp(desiredPos, dt * 2.5);

    const lookTarget = new THREE.Vector3(carPos.x, carPos.y + 0.8, carPos.z);
    this.currentTarget.lerp(lookTarget, dt * 3.5);
  }
}
