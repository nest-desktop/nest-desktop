// TextFieldDialog.spec.ts

import { describe, expect, test } from "vitest";

import TextFieldDialog from "@/components/dialog/TextFieldDialog.vue";

import { mountWithVuetify } from "./mount";

const mountDialog = (modelValue = "initial") => mountWithVuetify(TextFieldDialog, { props: { modelValue } });

describe("TextFieldDialog", () => {
  test("shows the initial value in the text field", () => {
    const wrapper = mountDialog();

    expect((wrapper.find("input").element as HTMLInputElement).value).toBe("initial");
  });

  test("emits closeDialog without a value on cancel", async () => {
    const wrapper = mountDialog();

    await wrapper.find("input").setValue("changed");
    await wrapper.find('button[title="Cancel"]').trigger("click");

    expect(wrapper.emitted("closeDialog")).toEqual([[undefined]]);
  });

  test("emits closeDialog with the edited value on submit", async () => {
    const wrapper = mountDialog();

    await wrapper.find("input").setValue("changed");
    await wrapper.find('button[title="Submit"]').trigger("click");

    expect(wrapper.emitted("closeDialog")).toEqual([["changed"]]);
  });
});
