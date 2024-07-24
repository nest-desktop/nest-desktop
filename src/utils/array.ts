// array.ts

import * as d3 from "d3";

/**
 * Get standard deviation of values.
 */
export function deviation(values: number[]): number {
  return d3.deviation(values) as number;
}

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
 * Get extension of array, return [min, max].
 */
export function extent(values: number[]): number[] {
  return extent(values) as number[];
}

/**
 * Fill an array with a value.
 */
export function fill(value: number, size: number): number[] {
  return Array.from({ length: size }, () => value);
}

/**
 * Create an array of linear-spaced values in a specific array length.
 */
export function linSpace(start: number, end: number, size: number): number[] {
  const step: number = (end - start) / (size - 1);
  return range(start, end + step, step);
}

/**
 * Get max value.
 */
export function max(values: number[]): number {
  return d3.max(values) as number;
}

/**
 * Get mean of values.
 */
export function mean(values: number[]): number {
  return d3.mean(values) as number;
}

/**
 * Get min value.
 */
export function min(values: number[]): number {
  return d3.min(values) as number;
}

/**
 * Remove duplicated values in an array.
 *
 * https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
 */
export function onlyUnique(
  value: Object | number | string,
  index: number,
  array: (Object | number | string)[]
): boolean {
  return array.indexOf(value) === index;
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

export function sortString(
  a: string = "",
  b: string = "",
  asc: boolean = true
) {
  return (asc ? 1 : -1) * (a < b ? -1 : a > b ? 1 : 0);
}

/**
 * Get summed value of array.
 */
export function sum(values: number[]): number {
  return d3.sum(values);
}
