<template>
  <v-layout
    class="networkGraphLayout"
    id="networkGraphLayout"
    style="height: 300px"
  >
    <svg class="networkGraph" height="100%" ref="networkGraphRef" width="100%">
      <network-graph :graph="(state.graph as NetworkGraphClass)" />
    </svg>
  </v-layout>

  <v-row no-gutters>
    <v-col class="pa-1" cols="12" md="4" sm="6">
      <div class="text-button">Stimulator</div>
      <node-viewer
        :node="(node as Node)"
        :key="index"
        v-for="(node, index) in projectStore.project.network.nodes.stimulators"
      />
    </v-col>

    <v-col class="pa-1" cols="12" md="4" sm="6">
      <div class="text-button">Neuron</div>
      <node-viewer
        :node="(node as Node)"
        :key="index"
        v-for="(node, index) in projectStore.project.network.nodes.neurons"
      />
    </v-col>

    <v-col class="pa-1" cols="12" md="4" sm="6">
      <div class="text-button">Recorder</div>
      <node-viewer
        :node="(node as Node)"
        :key="index"
        v-for="(node, index) in projectStore.project.network.nodes.recorders"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { Ref, onBeforeUnmount, onMounted, reactive, ref } from "vue";

import NetworkGraph from "@nest/components/network/NetworkGraph.vue";
import NodeViewer from "@nest/components/viewer/NodeViewer.vue";
import { Node } from "@nest/core/node/node";
import { useProjectStore } from "@nest/store/project/projectStore";
import { NetworkGraph as NetworkGraphClass } from "@nest/graph/networkGraph/networkGraph";
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
