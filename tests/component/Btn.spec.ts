// Btn.spec.ts

import { describe, expect, test } from "vitest";

import Btn from "@/components/common/Btn.vue";

import { mountWithVuetify } from "./mount";

describe("Btn", () => {
  test("renders the slot content in a text button", () => {
    const wrapper = mountWithVuetify(Btn, { slots: { default: "Click me" } });

    const btn = wrapper.find("button");
    expect(btn.text()).toBe("Click me");
    expect(btn.classes()).toContain("v-btn--variant-text");
    expect(btn.classes()).toContain("rounded-0");
  });
});
