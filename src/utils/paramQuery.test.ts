// paramQuery.test.ts

import { afterEach, expect, test, vi } from "vitest";
import type { RouteLocationNormalizedLoaded } from "vue-router";

import { getParamFromURL } from "./paramQuery";

const route = (query = {}, params = {}) => ({ params, query }) as RouteLocationNormalizedLoaded;

afterEach(() => {
  vi.unstubAllGlobals();
});

test("Get parameter from route query.", () => {
  expect(getParamFromURL(route({ projectId: "query" }, { projectId: "params" }), "projectId")).toBe("query");
});

test("Get parameter from route params.", () => {
  expect(getParamFromURL(route({}, { projectId: "params" }), "projectId")).toBe("params");
});

test("Get parameter from window location.", () => {
  vi.stubGlobal("window", { location: { search: "?projectId=location" } });

  expect(getParamFromURL(route(), "projectId")).toBe("location");
  expect(getParamFromURL(route(), "modelId")).toBeNull();
});
