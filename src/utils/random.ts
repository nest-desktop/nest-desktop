// random.ts

import * as d3 from "d3";

/**
 * Create a distributed array.
 */
export function randomInt(min: number, max: number): number {
  const range: number = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

/**
 * Create an uniform distributed array of integer values.
 */
export function randomUniformInt(
  start: number,
  end: number,
  size: number
): number[] {
  return Array.from({ length: size }, () => randomInt(start, end));
}

/**
 * Create an uniform distributed array of float values.
 */
export function randomUniformFloat(
  min: number,
  max: number,
  size: number
): number[] {
  return Array.from({ length: size }, () => d3.randomUniform(min, max)());
}

/**
 * Create an normal distributed array of float values.
 */
export function randomNormal(
  mu: number,
  sigma: number,
  size: number
): number[] {
  return Array.from({ length: size }, () => d3.randomNormal(mu, sigma)());
}
