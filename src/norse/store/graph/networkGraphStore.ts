// networkGraphStore.ts

import { Ref } from "vue";
import { defineStore } from "pinia";

import { NetworkGraph } from "@norse/graph/networkGraph/networkGraph";
import { Network } from "@norse/core/network/network";

export const useNetworkGraphStore = defineStore("network-graph", {
  state: () => ({
    // @ts-ignore
    graph: null as NetworkGraph,
  }),
  actions: {
    mount(ref: Ref<null>, network: Network) {
      this.graph = new NetworkGraph(ref, network);
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
