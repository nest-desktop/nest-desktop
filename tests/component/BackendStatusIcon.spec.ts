// BackendStatusIcon.spec.ts

import { describe, expect, test } from "vitest";

import BackendStatusIcon from "@/components/iconsets/BackendStatusIcon.vue";

import { mountWithVuetify } from "./mount";

const mountIcon = (enabled: boolean, isOK = true, isValid = true) =>
  mountWithVuetify(BackendStatusIcon, {
    props: { backendStore: { isOK, isValid, state: { enabled, name: "NEST Simulator" } } },
  });

describe("BackendStatusIcon", () => {
  test("shows the backend name as title", () => {
    expect(mountIcon(true).find(".v-icon").attributes("title")).toBe("NEST Simulator");
  });

  test.each([
    ["disabled", mountIcon(false), "text-grey"],
    ["ok and valid", mountIcon(true), "text-green"],
    ["not ok", mountIcon(true, false), "text-red"],
    ["not valid", mountIcon(true, true, false), "text-red"],
  ])("colors the icon of a %s backend", (_, wrapper, color) => {
    expect(wrapper.find(".v-icon").classes()).toContain(color);
  });
});
