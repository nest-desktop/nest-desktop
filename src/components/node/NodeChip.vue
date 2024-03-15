<template>
  <v-chip
    :color="node.view.color"
    @click="selectNode"
    size="small"
    variant="outlined"
  >
    <span class="font-weight-bold">{{ node.view.label }}</span>
    <span class="mx-1">{{ node.model.label }}</span>

    <span class="mx-1" v-if="appSessionStore.state.devMode">
      ({{ node.view.state.position.x.toFixed() }},
      {{ node.view.state.position.y.toFixed() }})
    </span>
  </v-chip>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TNode, TNodeProps } from "@/types/nodeTypes";
import { useAppSessionStore } from "@/stores/appSessionStore";
import { TNetworkGraph, TNetworkGraphProps } from "@/types/networkGraphTypes";

const appSessionStore = useAppSessionStore();

const props = defineProps({
  graph: TNetworkGraphProps,
  node: TNodeProps,
});

const node = computed(() => props.node as TNode);
const graph = computed(() => props.graph as TNetworkGraph);

const selectNode = () => {
  node.value.state.select();
  graph.value.update();
};
</script>
