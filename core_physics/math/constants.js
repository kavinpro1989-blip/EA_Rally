// Physical constants and unit conversions. Everything in the engine is SI:
// metres, kilograms, seconds, newtons, pascals, kelvin, radians.

export const G = 9.80665;               // m/s^2
export const P_ATM = 101325;            // Pa, ISA sea level
export const T_ISA = 288.15;            // K
export const R_AIR = 287.05;            // J/(kg K)
export const GAMMA_AIR = 1.4;
export const CP_AIR = 1004.7;           // J/(kg K)
export const GAMMA_EXH = 1.33;
export const CP_EXH = 1150;             // J/(kg K), exhaust gas average
export const FUEL_LHV = 43e6;           // J/kg gasoline
export const KELVIN = 273.15;

export const TWO_PI = Math.PI * 2;
export const RPM_TO_RADS = Math.PI / 30;
export const RADS_TO_RPM = 30 / Math.PI;
export const DEG = Math.PI / 180;
export const KPA = 1000;

// WGS84 ellipsoid
export const WGS84_A = 6378137.0;
export const WGS84_F = 1 / 298.257223563;
export const WGS84_E2 = WGS84_F * (2 - WGS84_F);
