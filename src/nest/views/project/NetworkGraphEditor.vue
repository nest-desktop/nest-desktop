<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <network-editor-toolbar :graph="(state.graph as NetworkGraphClass)" />
    <svg class="networkGraph" height="100%" ref="networkGraphRef" width="100%">
      <network-graph :graph="(state.graph as NetworkGraphClass)" />
    </svg>
  </v-layout>
</template>

<script lang="ts" setup>
import { Ref, onBeforeUnmount, onMounted, reactive, ref } from "vue";

import NetworkGraph from "@nest/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@nest/components/network/NetworkEditorToolbar.vue";
import { NetworkGraph as NetworkGraphClass } from "@nest/graph/networkGraph/networkGraph";
import { useProjectStore } from "@nest/store/project/projectStore";
import { Network } from "@nest/core/network/network";

const projectStore = useProjectStore();

const networkGraphRef: Ref<null> = ref(null);

const state = reactive({
  graph: new NetworkGraphClass(
    networkGraphRef,
    projectStore.project.network as Network
  ),
});

onMounted(() => {
  state.graph = new NetworkGraphClass(
    networkGraphRef,
    projectStore.project.network as Network
  );

  const ref = state.graph.selector?.node().parentNode;
  state.graph.resizeObserver.observe(ref);
  state.graph.init();
});

onBeforeUnmount(() => {
  state.graph.resizeObserver.disconnect();
});
</script>
