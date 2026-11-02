// DeleteDialog.spec.ts

import { describe, expect, test, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

import DeleteDialog from "@/components/dialog/DeleteDialog.vue";

import { mountWithVuetify } from "./mount";

const createStore = () => {
  const model = { state: { label: "iaf_psc_alpha" }, toJSON: () => ({ id: "iaf_psc_alpha" }) };
  return {
    deleteModels: vi.fn(),
    deleteProjects: vi.fn(),
    state: {
      models: [model],
      projects: [{ name: "Project A", createdAt: "2026-01-01" }],
    },
  };
};

const mountDialog = async (store = createStore()) => {
  const wrapper = mountWithVuetify(DeleteDialog, { props: { store } });
  // The items are collected on mount.
  await flushPromises();
  return wrapper;
};

const findButton = (wrapper: Awaited<ReturnType<typeof mountDialog>>, text: string) =>
  wrapper.findAll(".v-card-actions button").find((btn) => btn.text().toLowerCase() === text)!;

describe("DeleteDialog", () => {
  test("lists projects and models of the store", async () => {
    const wrapper = await mountDialog();

    const text = wrapper.find(".v-table").text();
    expect(text).toContain("Project A");
    expect(text).toContain("iaf_psc_alpha");
  });

  test("disables the delete button without a selection", async () => {
    expect(findButton(await mountDialog(), "delete selected").attributes("disabled")).toBeDefined();
  });

  test("deletes the selected items and closes the dialog", async () => {
    const store = createStore();
    const wrapper = await mountDialog(store);

    // The first checkbox selects all rows.
    await wrapper.find(".v-table thead input[type='checkbox']").setValue(true);
    await findButton(wrapper, "delete selected").trigger("click");

    expect(store.deleteProjects).toHaveBeenCalledWith([store.state.projects[0]]);
    expect(store.deleteModels).toHaveBeenCalledWith([{ id: "iaf_psc_alpha" }]);
    expect(wrapper.emitted("closeDialog")).toEqual([[undefined]]);
  });

  test("emits closeDialog on close", async () => {
    const wrapper = await mountDialog();

    await findButton(wrapper, "close").trigger("click");

    expect(wrapper.emitted("closeDialog")).toEqual([[undefined]]);
  });
});
