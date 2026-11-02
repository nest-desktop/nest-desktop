// array.test.ts

import { expect, test } from "vitest";

import { deviation, diff, extent, fill, linSpace, max, mean, min, onlyUnique, range, sortString, sum } from "./array";

test("Get statistics of values.", () => {
  const values = [2, 4, 4, 4, 5, 5, 7, 9];
  expect(max(values)).toBe(9);
  expect(mean(values)).toBe(5);
  expect(min(values)).toBe(2);
  expect(sum(values)).toBe(40);
  expect(deviation(values)).toBeCloseTo(2.138, 3);
});

test("Get extent of values.", () => {
  expect(extent([3, 1, 2])).toEqual([1, 3]);
});

test("Get differences of values.", () => {
  expect(diff([1, 3, 6, 10])).toEqual([2, 3, 4]);
  expect(diff([1])).toEqual([0]);
  expect(diff([])).toEqual([0]);
});

test("Fill an array with a value.", () => {
  expect(fill(5, 3)).toEqual([5, 5, 5]);
  expect(fill(5, 0)).toEqual([]);
});

test("Create an array of ranged values.", () => {
  expect(range(3)).toEqual([0, 1, 2]);
  expect(range(2, 5)).toEqual([2, 3, 4]);
  expect(range(0, 10, 2.5)).toEqual([0, 2.5, 5, 7.5]);
});

test("Create an array of linear-spaced values.", () => {
  expect(linSpace(0, 1, 5)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  expect(linSpace(10, 20, 3)).toEqual([10, 15, 20]);

  // The step of 1/6 adds up to slightly more than the end value.
  const values = linSpace(0, 1, 7);
  expect(values).toHaveLength(7);
  expect(values[0]).toBe(0);
  expect(values[6]).toBeCloseTo(1);
});

test("Remove duplicated values.", () => {
  expect([1, 2, 2, 3, 1].filter(onlyUnique)).toEqual([1, 2, 3]);
  expect(["a", "b", "a"].filter(onlyUnique)).toEqual(["a", "b"]);
});

test("Sort strings.", () => {
  expect(["b", "c", "a"].sort((a, b) => sortString(a, b))).toEqual(["a", "b", "c"]);
  expect(["b", "c", "a"].sort((a, b) => sortString(a, b, false))).toEqual(["c", "b", "a"]);
  expect(sortString("a", "a")).toBe(0);
  expect(sortString(undefined, "a")).toBe(-1);
});
