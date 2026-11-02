// Slider.spec.ts

import { describe, expect, test } from "vitest";

import RangeSlider from "@/components/controls/RangeSlider.vue";
import Slider from "@/components/controls/Slider.vue";
import TickSlider from "@/components/controls/TickSlider.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";

import { mountWithVuetify } from "./mount";

describe("Slider", () => {
  test.each([
    ["rangeSlider", RangeSlider, [0, 1]],
    ["tickSlider", TickSlider, 1],
    ["valueSlider", ValueSlider, 1],
    [undefined, ValueSlider, 1],
  ])("renders %s as the matching slider", (component, expected, value) => {
    const wrapper = mountWithVuetify(Slider, { props: { modelValue: value, options: { component, value } } });

    expect(wrapper.findComponent(expected).exists()).toBe(true);
  });

  test("forwards updates of the inner slider", async () => {
    const wrapper = mountWithVuetify(Slider, { props: { modelValue: 1, options: { step: 1, value: 1 } } });

    await wrapper.findComponent(ValueSlider).vm.$emit("update:modelValue", 3);

    expect(wrapper.emitted("update:modelValue")).toEqual([[3]]);
  });
});
