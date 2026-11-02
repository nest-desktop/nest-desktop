// serialize.test.ts

import { expect, test } from "vitest";

import { dumpJSON, dumpYAML, parseJSON, parseYAML } from "@/utils/serialize";

const data = { name: "iaf_psc_alpha", params: { C_m: 250, V_th: -55 }, recordables: ["V_m"] };

test("Serialize data as JSON.", () => {
  expect(dumpJSON(data)).toBe('{"name":"iaf_psc_alpha","params":{"C_m":250,"V_th":-55},"recordables":["V_m"]}');
  expect(parseJSON(dumpJSON(data))).toEqual(data);
});

test("Serialize data as YAML.", () => {
  expect(parseYAML("name: iaf_psc_alpha\nparams:\n  C_m: 250\n")).toEqual({
    name: "iaf_psc_alpha",
    params: { C_m: 250 },
  });
  expect(parseYAML(dumpYAML(data))).toEqual(data);
});

test("Throw on invalid JSON.", () => {
  expect(() => parseJSON("{name:")).toThrow(SyntaxError);
});
