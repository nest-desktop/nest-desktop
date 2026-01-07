// useNetworkGraph.ts

import { nextTick, type Ref, ref } from "vue";

import type { TNetworkGraph } from "@/types";

const networkGraphRef: Ref<TNetworkGraph | null> = ref(null);

export function mountNetworkGraph(networkGraph: TNetworkGraph) {
  networkGraphRef.value = networkGraph;

  networkGraph.resizeObserver.observe(networkGraph.selector?.node().parentNode);
  nextTick(() => networkGraph.init());
}

export function unmountNetworkGraph() {
  networkGraphRef.value?.resizeObserver.disconnect();

  networkGraphRef.value = null;
}

export function useNetworkGraph(): Ref<TNetworkGraph | null> {
  return networkGraphRef;
}
