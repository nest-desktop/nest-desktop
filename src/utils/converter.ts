// converter.ts

/**
 * Convert degree to radian.
 */
export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Convert radian to degree.
 */
export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

export function toFixed(value: number, digit: number = 1) {
  return value && !isNaN(value)
    ? (Math.round(value * 10 ** digit) / 10 ** digit).toFixed(digit)
    : NaN;
}
