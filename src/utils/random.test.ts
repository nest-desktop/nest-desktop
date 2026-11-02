// random.test.ts

import { afterEach, expect, test, vi } from "vitest";

import {
  randomInt,
  randomNormal,
  randomNormalArray,
  randomUniformFloat,
  randomUniformFloatArray,
  randomUniformInt,
  randomUniformIntArray,
} from "./random";

afterEach(() => {
  vi.restoreAllMocks();
});

test("Get random integers including both bounds.", () => {
  const random = vi.spyOn(Math, "random");

  random.mockReturnValue(0);
  expect(randomInt(1, 6)).toBe(1);

  random.mockReturnValue(0.9999);
  expect(randomInt(1, 6)).toBe(6);
  expect(randomUniformInt(-3, 3)).toBe(3);
});

test("Create arrays of uniform distributed values.", () => {
  const ints = randomUniformIntArray(0, 10, 100);
  expect(ints).toHaveLength(100);
  ints.forEach((value) => {
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(10);
  });

  const floats = randomUniformFloatArray(-1, 1, 100);
  expect(floats).toHaveLength(100);
  floats.forEach((value) => {
    expect(value).toBeGreaterThanOrEqual(-1);
    expect(value).toBeLessThan(1);
  });

  const value = randomUniformFloat(5, 6);
  expect(value).toBeGreaterThanOrEqual(5);
  expect(value).toBeLessThan(6);
});

test("Create values of a normal distribution.", () => {
  expect(randomNormal(3, 0)).toBe(3);
  expect(randomNormalArray(3, 0, 4)).toEqual([3, 3, 3, 3]);
  expect(randomNormalArray(0, 1, 10)).toHaveLength(10);
});
