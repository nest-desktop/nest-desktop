// ValueSlider.spec.ts

import { describe, expect, test } from "vitest";

import ValueSlider from "@/components/controls/ValueSlider.vue";

import { mountWithVuetify } from "./mount";

const mountSlider = (props = {}) =>
  mountWithVuetify(ValueSlider, { props: { id: "weight", modelValue: 5, step: 2, unit: "pA", ...props } });

const buttons = (wrapper: ReturnType<typeof mountSlider>) => {
  const [minus, plus] = wrapper.findAll("button.v-icon-btn");
  return { minus, plus };
};

describe("ValueSlider", () => {
  test("shows the value, label and unit in the text field", () => {
    const wrapper = mountSlider();

    expect((wrapper.find("input[type=number]").element as HTMLInputElement).value).toBe("5");
    expect(wrapper.find(".v-text-field").text()).toContain("weight");
    expect(wrapper.find(".v-text-field__suffix").text()).toBe("pA");
  });

  test("increments by step", async () => {
    const wrapper = mountSlider();

    await buttons(wrapper).plus.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[7]]);
  });

  test("decrements by step", async () => {
    const wrapper = mountSlider();

    await buttons(wrapper).minus.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[3]]);
  });

  test("emits the typed value on enter", async () => {
    const wrapper = mountSlider();
    const input = wrapper.find("input[type=number]");

    await input.setValue("12.5");
    await input.trigger("keyup.enter");

    expect(wrapper.emitted("update:modelValue")).toEqual([[12.5]]);
  });

  test("does not emit when the value is unchanged", async () => {
    const wrapper = mountSlider();

    await wrapper.find("input[type=number]").trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});
