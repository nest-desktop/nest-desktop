// Menu.spec.ts

import { describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import Menu from "@/components/common/Menu.vue";

import { mountWithVuetify } from "./mount";

describe("Menu", () => {
  test("opens the item list and runs the item action on click", async () => {
    const onClick = vi.fn();
    const wrapper = mountWithVuetify(Menu, {
      attachTo: document.body,
      props: { items: [{ icon: "mdi:mdi-pencil", onClick, title: "Rename" }] },
    });

    // The menu binds its activator after mount.
    await nextTick();
    await wrapper.find("button.menu-btn").trigger("click");
    await vi.waitFor(() => expect(document.querySelector(".v-overlay .v-list-item")).not.toBeNull());

    const item = document.querySelector<HTMLElement>(".v-overlay .v-list-item")!;
    expect(item.textContent).toContain("Rename");

    item.click();
    expect(onClick).toHaveBeenCalledOnce();

    wrapper.unmount();
  });
});
