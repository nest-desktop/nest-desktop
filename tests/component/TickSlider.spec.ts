// TickSlider.spec.ts

import { describe, expect, test } from "vitest";
import { nextTick } from "vue";

import TickSlider from "@/components/controls/TickSlider.vue";

import { mountWithVuetify } from "./mount";

const tickLabels = [0.1, 1, 10];

// The ticks are set up on mount, so they render one tick later.
const mountSlider = async (modelValue = 1) => {
  const wrapper = mountWithVuetify(TickSlider, { props: { modelValue, tickLabels, unit: "ms" } });
  await nextTick();
  return wrapper;
};

const buttons = (wrapper: Awaited<ReturnType<typeof mountSlider>>) => {
  const [minus, plus] = wrapper.findAll("button.v-icon-btn");
  return { minus, plus };
};

describe("TickSlider", async () => {
  test("renders a label for each tick and the unit", async () => {
    const wrapper = await mountSlider();

    expect(wrapper.findAll(".label").map((label) => label.text())).toEqual(["0.1", "1", "10"]);
    expect(wrapper.find(".unit").text()).toBe("ms");
  });

  test("starts at the tick of the model value", async () => {
    const wrapper = await mountSlider(10);

    expect(wrapper.find(".v-slider-thumb").attributes("aria-valuenow")).toBe("2");
  });

  test("emits the next tick label on increment", async () => {
    const wrapper = await mountSlider(1);

    await buttons(wrapper).plus.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[10]]);
  });

  test("emits the previous tick label on decrement", async () => {
    const wrapper = await mountSlider(1);

    await buttons(wrapper).minus.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[0.1]]);
  });

  test("stays within the first and last tick", async () => {
    const first = await mountSlider(0.1);
    await buttons(first).minus.trigger("click");
    expect(first.emitted("update:modelValue")).toBeUndefined();

    const last = await mountSlider(10);
    await buttons(last).plus.trigger("click");
    expect(last.emitted("update:modelValue")).toBeUndefined();
  });
});
