<template>
  <div class="nodeChip">
    <v-chip
      :color="node.view.color"
      @click="selectNode"
      size="small"
      variant="outlined"
    >
      <span class="font-weight-bold">{{ node.view.label }}</span>
      <span class="mx-1">{{ node.model.label }}</span>

      <span class="mx-1" v-if="appStore.devMode">
        ( {{ node.view.state.position.x.toFixed() }},
        {{ node.view.state.position.y.toFixed() }})
      </span>
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NetworkGraph } from "@/graph/networkGraph/networkGraph";
import { Node, NodePropTypes } from "@/types/nodeTypes";
import { useAppStore } from "@/store/appStore";

const appStore = useAppStore();

const props = defineProps({
  graph: NetworkGraph,
  node: NodePropTypes,
});

const node = computed(() => props.node as Node);
const graph = computed(() => props.graph as NetworkGraph);

const selectNode = () => {
  node.value.state.select();
  graph.value.update();
};
</script>
