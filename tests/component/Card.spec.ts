// Card.spec.ts

import { describe, expect, test } from "vitest";

import Card from "@/components/common/Card.vue";

import { mountWithVuetify } from "./mount";

describe("Card", () => {
  test("renders the slot content in an outlined card", () => {
    const wrapper = mountWithVuetify(Card, { slots: { default: "<p>Content</p>" } });

    const card = wrapper.find(".v-card");
    expect(card.classes()).toContain("card");
    expect(card.classes()).toContain("v-card--variant-outlined");
    expect(card.find("p").text()).toBe("Content");
  });
});
