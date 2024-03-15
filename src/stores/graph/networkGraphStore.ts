// networkGraphStore.ts

import { reactive } from "vue";
import { defineStore } from "pinia";

import { TNetworkGraph } from "@/types/networkGraphTypes";

export const useNetworkGraphStore = defineStore("network-graph", () => {
  const state = reactive({
    // @ts-ignore
    graph: null as NetworkGraph,
  });

  const mount = (graph: TNetworkGraph): void => {
    state.graph = graph;
    state.graph.resizeObserver.observe(state.graph.selector?.node().parentNode);
    state.graph.init();
  };
  const unmount = (): void => {
    state.graph?.resizeObserver.disconnect();
    // @ts-ignore
    state.graph = null;
  };
  return { mount, state, unmount };
});
