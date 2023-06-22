<template>
  <div class="nodeChip">
    <v-chip
      :color="state.node.view.color"
      @click="selectNode"
      size="small"
      variant="outlined"
    >
      <span class="font-weight-bold">{{ state.node.view.label }}</span>
      <span class="mx-1">{{ state.node.model.label }}</span>

      <span class="mx-1" v-if="appStore.devMode">
        ( {{ state.node.view.position.x.toFixed() }},
        {{ state.node.view.position.y.toFixed() }})
      </span>
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

import { NetworkGraph } from "@nest/graph/networkGraph/networkGraph";
import { Node } from "@nest/core/node/node";
import { useAppStore } from "@/store/appStore";

const appStore = useAppStore();

const props = defineProps({
  graph: NetworkGraph,
  node: Node,
});
const state = reactive({
  graph: props.graph as NetworkGraph,
  node: props.node as Node,
});

const selectNode = () => {
  state.node.state.select();
  state.graph.update();
};

watch(
  () => [props.graph, props.node],
  () => {
    state.graph = props.graph as NetworkGraph;
    state.node = props.node as Node;
  }
);
</script>
