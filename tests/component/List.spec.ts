// List.spec.ts

import { describe, expect, test } from "vitest";
import { nextTick } from "vue";

import List from "@/components/common/List.vue";

import { mountWithVuetify } from "./mount";

const items = [
  { icon: "mdi:mdi-home", title: "Home", value: "home" },
  {
    icon: "mdi:mdi-folder",
    title: "Projects",
    value: "projects",
    items: [
      { icon: "mdi:mdi-file", title: "Project A", value: "a" },
      { icon: "mdi:mdi-file", title: "Project B", value: "b" },
    ],
  },
];

// Attach to the document, so that the visibility of collapsed items is computed.
const mountList = () => mountWithVuetify(List, { attachTo: document.body, props: { items } });

const titles = (wrapper: ReturnType<typeof mountWithVuetify>) =>
  wrapper
    .findAll(".v-list-item")
    .filter((item) => item.isVisible())
    .map((item) => item.text());

describe("List", () => {
  test("renders the top level items", () => {
    const wrapper = mountList();

    expect(titles(wrapper)).toEqual(["Home", "Projects"]);

    wrapper.unmount();
  });

  test("opens a group in place of the top level items and goes back", async () => {
    const wrapper = mountList();

    await wrapper.findAll(".v-list-item")[1].trigger("click");
    await nextTick();
    expect(titles(wrapper)).toEqual(["projects", "Project A", "Project B"]);

    await wrapper.find(".v-list-item").trigger("click");
    await nextTick();
    expect(titles(wrapper)).toEqual(["Home", "Projects"]);

    wrapper.unmount();
  });
});
