// NodeChip.spec.ts

import { beforeEach, describe, expect, test, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import NodeChip from "@/components/node/NodeChip.vue";
import { useAppStore } from "@/stores/appStore";

import { mountWithVuetify } from "./mount";

const createNode = () => ({
  model: { state: { label: "iaf_psc_alpha" } },
  select: vi.fn(),
  view: { color: "#1f77b4", label: "n1", position: { x: 12.3, y: 45.6 } },
});

const mountChip = (node = createNode(), graph = { update: vi.fn() }) =>
  mountWithVuetify(NodeChip, { props: { graph, node } });

describe("NodeChip", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("shows the node and model labels", () => {
    const text = mountChip().find(".v-chip").text();

    expect(text).toContain("n1");
    expect(text).toContain("iaf_psc_alpha");
    expect(text).not.toContain("(12, 46)");
  });

  test("shows the node position in dev mode", () => {
    useAppStore().state.devMode = true;

    expect(mountChip().find(".v-chip").text()).toContain("(12, 46)");
  });

  test("selects the node and updates the graph on click", async () => {
    const node = createNode();
    const graph = { update: vi.fn() };
    const wrapper = mountChip(node, graph);

    await wrapper.find(".v-chip").trigger("click");

    expect(node.select).toHaveBeenCalledOnce();
    expect(graph.update).toHaveBeenCalledOnce();
  });
});
