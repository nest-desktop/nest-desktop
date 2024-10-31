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
 * Get an integer value based on an uniform distribution.
 */
export function randomUniformInt(start: number, end: number): number {
  return randomInt(start, end);
}

/**
 * Create an uniform distributed array of integer values.
 */
export function randomUniformIntArray(
  start: number,
  end: number,
  size: number
): number[] {
  return Array.from({ length: size }, () => randomInt(start, end));
}

/**
 * Get a float value based on an uniform distribution.
 */
export function randomUniformFloat(min: number, max: number): number {
  return d3.randomUniform(min, max)();
}

/**
 * Create an uniform distributed array of float values.
 */
export function randomUniformFloatArray(
  min: number,
  max: number,
  size: number
): number[] {
  return Array.from({ length: size }, () => d3.randomUniform(min, max)());
}

/**
 * Get a value based on a normal distribution.
 */
export function randomNormal(mu: number, sigma: number): number {
  return d3.randomNormal(mu, sigma)();
}

/**
 * Create a normal distributed array of float values.
 */
export function randomNormalArray(
  mu: number,
  sigma: number,
  size: number
): number[] {
  return Array.from({ length: size }, () => d3.randomNormal(mu, sigma)());
}
