// numeric.ts

import { deviation, extent, mean, randomNormal, randomUniform } from "d3";

/**
 * An object for array generation.
 */
export class Numeric {
  constructor() {}

  /**
   * Convert degree to radian.
   */
  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  /**
   * Get standard deviation of values.
   */
  deviation(values: number[]): number {
    return deviation(values) as number;
  }

  /**
   * Get extension of array, return [min, max].
   */
  extent(values: number[]): number[] {
    return extent(values) as number[];
  }

  /**
   * Fill an array with a value.
   */
  fill(value: number, size: number): number[] {
    return Array.from({ length: size }, () => value);
  }

  /**
   * Create an array of linear-spaced values in a speficic array length.
   */
  linspace(start: number, end: number, size: number): number[] {
    const step: number = (end - start) / (size - 1);
    return this.range(start, end + step, step);
  }

  /**
   * Get mean of values.
   */
  mean(values: number[]): number {
    return mean(values) as number;
  }

  /**
   * Remove duplicated values in an array.
   */
  onlyUnique(values: number[], index: number, value: any): boolean {
    return value.indexOf(values) === index;
  }

  /**
   * Create a distributed array.
   */
  randomInt(min: number, max: number): number {
    const range: number = max - min + 1;
    return Math.floor(Math.random() * range) + min;
  }

  /**
   * Create an uniform distributed array of integer values.
   */
  randomUniformInt(start: number, end: number, size: number): number[] {
    return Array.from({ length: size }, () => this.randomInt(start, end));
  }

  /**
   * Create an uniform distributed array of float values.
   */
  randomUniformFloat(min: number, max: number, size: number): number[] {
    return Array.from({ length: size }, () => randomUniform(min, max)());
  }

  /**
   * Create an normal distributed array of float values.
   */
  randomNormal(mu: number, sigma: number, size: number): number[] {
    return Array.from({ length: size }, () => randomNormal(mu, sigma)());
  }

  /**
   * Create an array of ranged values with value steps.
   */
  range(start: number, end?: number, step?: number): number[] {
    if (!end) {
      return Array.from({ length: start }, (_, index: number) => index);
    } else if (!step) {
      return Array.from(
        { length: end - start },
        (_, index: number) => start + index
      );
    } else {
      return Array.from(
        { length: Math.ceil((end - start) / step) },
        (_, index: number) => start + index * step
      );
    }
  }

  /**
   * Convert radian to degree.
   */
  radToDeg(rad: number): number {
    return rad * (180 / Math.PI);
  }
}
