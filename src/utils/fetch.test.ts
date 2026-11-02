// fetch.test.ts

import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { load, loadJSON, loadText, loadYAML } from "./fetch";

const files: Record<string, string> = {
  "config.json": '{"name":"NEST Simulator","port":52425}',
  "config.yaml": "name: NEST Simulator\nport: 52425\n",
  "model.nestml": "model iaf_psc_alpha:",
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (path: string) => new Response(files[path])),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("Load data from JSON file.", async () => {
  expect(await loadJSON("config.json")).toEqual({ name: "NEST Simulator", port: 52425 });
});

test("Load data from YAML file.", async () => {
  expect(await loadYAML("config.yaml")).toEqual({ name: "NEST Simulator", port: 52425 });
});

test("Load text from file.", async () => {
  expect(await loadText("model.nestml")).toBe("model iaf_psc_alpha:");
});

test("Load data by file extension.", async () => {
  expect(await load("config.json")).toEqual({ name: "NEST Simulator", port: 52425 });
  expect(await load("config.yaml")).toEqual({ name: "NEST Simulator", port: 52425 });
  expect(await load("model.nestml")).toBe("model iaf_psc_alpha:");
  expect(fetch).toHaveBeenCalledTimes(3);
});
