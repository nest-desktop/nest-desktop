// AppLinks.spec.ts

import { describe, expect, test } from "vitest";

import AppLinks from "@/components/app/AppLinks.vue";

import { mountWithVuetify } from "./mount";

describe("AppLinks", () => {
  test("renders each link to open in a new tab", () => {
    const links = mountWithVuetify(AppLinks).findAll("a.v-list-item");

    expect(links.map((link) => link.find(".v-list-item-title").text())).toEqual([
      "Project website",
      "Help",
      "Report an issue",
      "Contribute to the app",
    ]);
    links.forEach((link) => {
      expect(link.attributes("target")).toBe("_blank");
      expect(link.find(".v-list-item-subtitle").text()).toBe(link.attributes("href"));
    });
  });
});
