// converter.ts

/**
 * Convert degree to radian.
 * @param deg
 * @returns rad
 */
export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Convert radian to degree.
 * @param rad
 * @returns deg
 */
export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

/**
 * Convert number to string.
 * @param value number
 * @param digit number
 * @returns number | string
 */
export function toFixed(value: number, digit: number = 1): number | string {
  return !isNaN(value)
    ? (Math.round(value * 10 ** digit) / 10 ** digit).toFixed(digit)
    : NaN;
}

/**
 * Round values to 2 digits.
 * @param value number
 * @returns number
 */
export function round(value: number): number {
  return Math.floor(value * 100) / 100;
}
