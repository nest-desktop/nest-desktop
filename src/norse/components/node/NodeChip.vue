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

import { useAppStore } from "@/store/appStore";

import { NetworkGraph } from "@norse/graph/networkGraph/networkGraph";
import { Node } from "@norse/core/node/node";

const appStore = useAppStore();

const props = defineProps({
  graph: NetworkGraph,
  node: Node,
});

const node = computed(() => props.node as Node);
const graph = computed(() => props.graph as NetworkGraph);

const selectNode = () => {
  node.value.state.select();
  graph.value.update();
};
</script>
