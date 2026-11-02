// events.test.ts

import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { debounce, throttle } from "@/utils/events";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("Debounce calls until the interval has passed.", () => {
  const callback = vi.fn();
  const debounced = debounce(callback, 100);

  debounced();
  vi.advanceTimersByTime(50);
  debounced();
  vi.advanceTimersByTime(50);
  expect(callback).not.toHaveBeenCalled();

  vi.advanceTimersByTime(50);
  expect(callback).toHaveBeenCalledOnce();
});

test("Debounce passes the arguments of the last call.", () => {
  const callback = vi.fn();
  const debounced = debounce(callback, 100);

  debounced("first");
  debounced("last");
  vi.advanceTimersByTime(100);

  expect(callback).toHaveBeenCalledExactlyOnceWith("last");
});

test("Throttle calls at most once per interval.", () => {
  const callback = vi.fn();
  const throttled = throttle(callback, 300);

  throttled("first");
  throttled("second");
  vi.advanceTimersByTime(0);
  expect(callback).toHaveBeenCalledExactlyOnceWith("first");

  vi.advanceTimersByTime(300);
  throttled("third");
  vi.advanceTimersByTime(0);
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith("third");
});
