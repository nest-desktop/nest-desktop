// networkGraphStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

import { TNetworkGraph } from "@/types";

export const useNetworkGraphStore = defineStore("network-graph", () => {
  const state = reactive<{
    graph: TNetworkGraph | null;
  }>({
    graph: null,
  });

  const mount = (graph: TNetworkGraph): void => {
    state.graph = graph;
    state.graph.resizeObserver.observe(state.graph.selector?.node().parentNode);
    state.graph.init();
  };

  const unmount = (): void => {
    state.graph?.resizeObserver.disconnect();
    state.graph = null;
  };

  return { mount, state, unmount };
});
