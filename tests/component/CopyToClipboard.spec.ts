// CopyToClipboard.spec.ts

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

import CopyToClipboard from "@/components/code/CopyToClipboard.vue";

import { mountWithVuetify } from "./mount";

const { toClipboard } = vi.hoisted(() => ({ toClipboard: vi.fn() }));

vi.mock("vue-clipboard3", () => ({ default: () => ({ toClipboard }) }));

describe("CopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    toClipboard.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("copies the text and shows a check icon for two seconds", async () => {
    toClipboard.mockResolvedValue(undefined);
    const wrapper = mountWithVuetify(CopyToClipboard, { props: { text: "nest.Simulate(1000.)" } });

    await wrapper.find('button[title="Copy code script"]').trigger("click");
    await flushPromises();

    expect(toClipboard).toHaveBeenCalledWith("nest.Simulate(1000.)");
    expect(wrapper.find(".mdi-check-bold").exists()).toBe(true);

    await vi.advanceTimersByTimeAsync(2000);

    expect(wrapper.find(".mdi-check-bold").exists()).toBe(false);
    expect(wrapper.find('button[title="Copy code script"]').exists()).toBe(true);
  });

  test("keeps the copy button when copying fails", async () => {
    const error = new Error("denied");
    toClipboard.mockRejectedValue(error);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const wrapper = mountWithVuetify(CopyToClipboard, { props: { text: "text" } });

    await wrapper.find('button[title="Copy code script"]').trigger("click");
    await flushPromises();

    expect(consoleError).toHaveBeenCalledWith(error);
    expect(wrapper.find(".mdi-check-bold").exists()).toBe(false);
    consoleError.mockRestore();
  });
});
