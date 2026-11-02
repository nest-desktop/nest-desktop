// ColorPicker.spec.ts

import { describe, expect, test } from "vitest";
import { nextTick } from "vue";

import ColorPicker from "@/components/common/ColorPicker.vue";

import { mountWithVuetify } from "./mount";

const swatchColors = (wrapper: ReturnType<typeof mountWithVuetify>) =>
  wrapper
    .findAll(".v-color-picker-swatches__swatch")
    .map((swatch) => swatch.findAll(".v-color-picker-swatches__color").length);

describe("ColorPicker", () => {
  test("shows the swatches of the given color scheme", async () => {
    const wrapper = mountWithVuetify(ColorPicker, { props: { colorScheme: "paired" } });
    await nextTick();

    expect(swatchColors(wrapper)).toEqual([2, 2, 2, 2, 2, 2]);
  });

  test("falls back to category10 without a color scheme", async () => {
    const wrapper = mountWithVuetify(ColorPicker, { props: { colorScheme: "" } });
    await nextTick();

    expect(swatchColors(wrapper)).toEqual(Array(10).fill(1));
  });

  test("updates the swatches when the color scheme changes", async () => {
    const wrapper = mountWithVuetify(ColorPicker, { props: { colorScheme: "category10" } });
    await nextTick();

    await wrapper.setProps({ colorScheme: "set3" });

    expect(swatchColors(wrapper)).toHaveLength(12);
  });
});
