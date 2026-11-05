import { R_AIR } from '../math/constants.js';

/**
 * Quadratic aerodynamic loads in the body frame.
 *   drag      F_x = +1/2 rho CdA |v_air| v_air,x   (v_air = air velocity relative to the car, so drag opposes motion)
 *   side      F_z = +1/2 rho CyA |v_air| v_air,z   (yawed flow)
 *   downforce F_y = -1/2 rho ClA v^2, split front/rear by `balance`
 * Air density from the ideal gas law at ambient pressure/temperature.
 */
export class Aero {
  /** @param {object} cfg chassis.json `aero` */
  constructor(cfg) { this.cfg = cfg; }

  /**
   * @param {{x:number,y:number,z:number}} vAir air velocity relative to the car, body frame [m/s]
   * @param {{pressure:number,temperature:number}} ambient
   */
  loads(vAir, ambient) {
    const c = this.cfg;
    const rho = ambient.pressure / (R_AIR * ambient.temperature);
    const q = 0.5 * rho;
    const v = Math.hypot(vAir.x, vAir.y, vAir.z);
    // vAir is the air velocity relative to the car, so the aerodynamic force points along it
    const fx = q * c.dragArea * v * vAir.x;
    const fz = q * c.sideArea * v * vAir.z;
    const fy = -q * c.liftArea * v * v;   // liftArea (ClA) > 0 => downforce (negative y)
    const front = c.downforceBalance;
    return { fx, fy, fz, downforceFront: -fy * front, downforceRear: -fy * (1 - front), rho, dynamicPressure: q * v * v };
  }
}
