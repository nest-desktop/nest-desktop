// ContextMenu.spec.ts

import { describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import ContextMenu from "@/components/common/ContextMenu.vue";

import { mountWithVuetify } from "./mount";

describe("ContextMenu", () => {
  test("opens the item list on right click and runs the item action", async () => {
    const onClick = vi.fn();
    const wrapper = mountWithVuetify(ContextMenu, {
      attachTo: document.body,
      props: { items: [{ icon: { icon: "mdi:mdi-delete" }, onClick, title: "Delete" }] },
      slots: { activator: `<template #activator="{ props }"><div class="target" v-bind="props">Node</div></template>` },
    });

    // The menu binds its activator after mount.
    await nextTick();
    const contextmenu = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    wrapper.find(".target").element.dispatchEvent(contextmenu);

    expect(contextmenu.defaultPrevented).toBe(true);
    await vi.waitFor(() => expect(document.querySelector(".v-overlay .v-list-item")).not.toBeNull());

    const item = document.querySelector<HTMLElement>(".v-overlay .v-list-item")!;
    expect(item.textContent).toContain("Delete");

    item.click();
    expect(onClick).toHaveBeenCalledOnce();

    wrapper.unmount();
  });
});
