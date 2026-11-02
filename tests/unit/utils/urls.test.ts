// urls.test.ts

import { expect, test } from "vitest";

import { combineURLs, isURL } from "@/utils/urls";

test("Combine URLs.", () => {
  expect(combineURLs("http://localhost:52425", "api")).toBe("http://localhost:52425/api");
  expect(combineURLs("http://localhost:52425/", "/api")).toBe("http://localhost:52425/api");
  expect(combineURLs("http://localhost:52425//", "//api/exec")).toBe("http://localhost:52425/api/exec");
  expect(combineURLs("http://localhost:52425/")).toBe("http://localhost:52425/");
  expect(combineURLs("http://localhost:52425", "")).toBe("http://localhost:52425");
});

test("Check if a string is an HTTP URL.", () => {
  expect(isURL("http://localhost:52425")).toBe(true);
  expect(isURL("https://nest-desktop.readthedocs.io")).toBe(true);
  expect(isURL("ftp://example.com")).toBe(false);
  expect(isURL("localhost:52425")).toBe(false);
  expect(isURL("not a url")).toBe(false);
  expect(isURL("")).toBe(false);
});
