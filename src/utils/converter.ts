// converter.ts

/**
 * Convert string to boolean.
 * @param input
 * @returns
 */
export function convertToBoolean(input: string): boolean | undefined {
  try {
    return JSON.parse(input.toLowerCase());
  } catch (e) {
    return undefined;
  }
}

/**
 * Convert degree to radian.
 * @param deg number
 * @returns number
 */
export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Convert radian to degree.
 * @param rad number
 * @returns number
 */
export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

/**
 * Round values to digits.
 * @param value number
 * @returns number
 */
export function round(value: number, digit: number = 2): number {
  return Math.round(value * 10 ** digit) / 10 ** digit;
}

/**
 * Convert number to string.
 * @param value number
 * @param digit number
 * @returns number | string
 */
export function toFixed(value: number, digit: number = 1): number | string {
  return !isNaN(value) ? round(value, digit).toFixed(digit) : NaN;
}
