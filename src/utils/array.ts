// array.ts

import * as d3 from "d3";

/**
 * Get values difference in an array.
 */
export function diff(values: number[]): number[] {
  if (values.length <= 1) {
    return [0];
  }
  const data = [];
  for (let ii = 0; ii < values.length - 1; ii++) {
    data.push(values[ii + 1] - values[ii]);
  }
  return data;
}

/**
 * Get standard deviation of values.
 */
export function deviation(values: number[]): number {
  return d3.deviation(values) as number;
}

/**
 * Get extension of array, return [min, max].
 */
export function extent(values: number[]): number[] {
  return extent(values) as number[];
}

/**
 * Create an array of linear-spaced values in a speficic array length.
 */
export function linspace(start: number, end: number, size: number): number[] {
  const step: number = (end - start) / (size - 1);
  return range(start, end + step, step);
}

/**
 * Get mean of values.
 */
export function mean(values: number[]): number {
  return d3.mean(values) as number;
}

/**
 * Fill an array with a value.
 */
export function fill(value: number, size: number): number[] {
  return Array.from({ length: size }, () => value);
}

/**
 * Remove duplicated values in an array.
 */
export function onlyUnique(
  values: number[],
  index: number,
  value: any
): boolean {
  return value.indexOf(values) === index;
}

/**
 * Create an array of ranged values with value steps.
 */

export function range(start: number, end?: number, step?: number): number[] {
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

export function sum(values: number[]): number {
  return d3.sum(values);
}
