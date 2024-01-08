// converter.test.ts
import { expect, test } from "vitest";
import { degToRad, radToDeg, round, toFixed } from "./converter";

test("Convert degree to radian.", () => {
  expect(degToRad(0)).toBe(0);
  expect(degToRad(180)).toBe(Math.PI);
});

test("Convert radian to degree.", () => {
  expect(radToDeg(0)).toBe(0);
  expect(radToDeg(Math.PI)).toBe(180);
});

test("Round values to 2 digits.", () => {
  expect(round(3.1415)).toBe(3.14)
  expect(round(3.1415, 0)).toBe(3)
  expect(round(3.1415, 1)).toBe(3.1)
  expect(round(3.1415, 2)).toBe(3.14)
  expect(round(3.1415, 3)).toBe(3.142)
})

test("Convert number to string.", () => {
  expect(toFixed(3.14)).toBe("3.1")
  expect(toFixed(6.28)).toBe("6.3")
})
