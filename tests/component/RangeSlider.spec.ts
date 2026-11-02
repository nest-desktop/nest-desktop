// RangeSlider.spec.ts

import { describe, expect, test } from "vitest";

import RangeSlider from "@/components/controls/RangeSlider.vue";

import { mountWithVuetify } from "./mount";

const mountSlider = () =>
  mountWithVuetify(RangeSlider, { props: { inputLabel: ["start", "stop"], modelValue: [0, 100], unit: "ms" } });

const inputs = (wrapper: ReturnType<typeof mountSlider>) => {
  const [lower, upper] = wrapper.findAll("input[type=number]");
  return { lower, upper };
};

describe("RangeSlider", () => {
  test("labels the lower and upper inputs", () => {
    const wrapper = mountSlider();
    const [lower, upper] = wrapper.findAll(".v-text-field");

    expect(lower.text()).toContain("start");
    expect(upper.text()).toContain("stop");
  });

  test("shows the model value once it changes", async () => {
    const wrapper = mountSlider();

    await wrapper.setProps({ modelValue: [10, 20] });

    const { lower, upper } = inputs(wrapper);
    expect((lower.element as HTMLInputElement).value).toBe("10");
    expect((upper.element as HTMLInputElement).value).toBe("20");
  });

  test("emits both bounds when the lower bound is typed", async () => {
    const wrapper = mountSlider();
    await wrapper.setProps({ modelValue: [10, 20] });
    const { lower } = inputs(wrapper);

    await lower.setValue("5");
    await lower.trigger("keyup.enter");

    expect(wrapper.emitted("update:modelValue")).toEqual([[[5, 20]]]);
  });

  test("emits both bounds when the upper bound is typed", async () => {
    const wrapper = mountSlider();
    await wrapper.setProps({ modelValue: [10, 20] });
    const { upper } = inputs(wrapper);

    await upper.setValue("50");
    await upper.trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toEqual([[[10, 50]]]);
  });

  test("does not emit when the bounds are unchanged", async () => {
    const wrapper = mountSlider();
    await wrapper.setProps({ modelValue: [10, 20] });

    await inputs(wrapper).lower.trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});
