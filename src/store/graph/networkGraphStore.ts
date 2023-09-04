// networkGraphStore.ts

import { defineStore } from "pinia";

import { NetworkGraph } from "@/types/networkGraphTypes";

export const useNetworkGraphStore = defineStore("network-graph", {
  state: () => ({
    // @ts-ignore
    graph: null as NetworkGraph,
  }),
  actions: {
    mount(graph: NetworkGraph) {
      this.graph = graph;
      this.graph.resizeObserver.observe(this.graph.selector?.node().parentNode);
      this.graph.init();
    },
    unmount() {
      this.graph.resizeObserver.disconnect();
      // @ts-ignore
      this.graph = null;
    },
  },
});
