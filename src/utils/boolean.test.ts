// boolean.test.ts

import { expect, test } from "vitest";

import { getBoolean, parseBoolean } from "./boolean";

test("Get boolean value as boolean type.", () => {
  expect(getBoolean("1")).toBe(true);
  expect(getBoolean("ON")).toBe(true);
  expect(getBoolean("On")).toBe(true);
  expect(getBoolean("TRUE")).toBe(true);
  expect(getBoolean("True")).toBe(true);
  expect(getBoolean("Y")).toBe(true);
  expect(getBoolean("YES")).toBe(true);
  expect(getBoolean("Yes")).toBe(true);
  expect(getBoolean("on")).toBe(true);
  expect(getBoolean("true")).toBe(true);
  expect(getBoolean("y")).toBe(true);
  expect(getBoolean("yes")).toBe(true);
  expect(getBoolean(1)).toBe(true);
  expect(getBoolean(true)).toBe(true);
});

test("Parse boolean value to Python string.", () => {
  expect(parseBoolean(true)).toBe("True");
  expect(parseBoolean(false)).toBe("False");
});
