// ArrayInput.spec.ts

import { describe, expect, test } from "vitest";

import ArrayInput from "@/components/controls/ArrayInput.vue";

import { mountWithVuetify } from "./mount";

const mountInput = () => mountWithVuetify(ArrayInput, { props: { modelValue: [1, 2] } });

describe("ArrayInput", () => {
  test("shows the array values", () => {
    const wrapper = mountInput();

    expect((wrapper.find("textarea").element as HTMLTextAreaElement).value).toBe("1,2");
  });

  test("emits comma separated values as an array on blur", async () => {
    const wrapper = mountInput();
    const textarea = wrapper.find("textarea");

    await textarea.setValue("1, 2.5, 3");
    await textarea.trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toEqual([[[1, 2.5, 3]]]);
  });

  test("emits values in brackets as an array on enter", async () => {
    const wrapper = mountInput();
    const textarea = wrapper.find("textarea");

    await textarea.setValue("[4, 5]");
    await textarea.trigger("keydown.enter");

    expect(wrapper.emitted("update:modelValue")).toEqual([[[4, 5]]]);
  });

  test("does not emit when the value is unchanged", async () => {
    const wrapper = mountInput();

    await wrapper.find("textarea").trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});
