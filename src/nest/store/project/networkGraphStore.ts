// networkGraphStore.ts

import { defineStore } from "pinia";

import { NetworkGraph } from "@/nest/graph/networkGraph/networkGraph";

export const useNetworkGraphStore = defineStore("network-graph", {
  state: () => ({
    graph?: NetworkGraph,
  }),
});
