// boolean.test.ts

import { expect, test } from "vitest";

import { getBoolean } from "./boolean";

test("Get true as boolean value.", () => {
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

test("Get false as boolean value.", () => {
  expect(getBoolean("0")).toBe(false);
  expect(getBoolean("OFF")).toBe(false);
  expect(getBoolean("false")).toBe(false);
  expect(getBoolean("n")).toBe(false);
  expect(getBoolean("no")).toBe(false);
  expect(getBoolean("")).toBe(false);
  expect(getBoolean(0)).toBe(false);
  expect(getBoolean(2)).toBe(false);
  expect(getBoolean(false)).toBe(false);
});
