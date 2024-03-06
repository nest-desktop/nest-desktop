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

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { BaseNode } from "@/helpers/node/node";
import { NodePropTypes } from "@/types/nodeTypes";
import { useAppSessionStore } from "@/stores/appSessionStore";

const appSessionStore = useAppSessionStore();

const props = defineProps({
  graph: BaseNetworkGraph,
  node: NodePropTypes,
});

const node = computed(() => props.node as BaseNode);
const graph = computed(() => props.graph as BaseNetworkGraph);

const selectNode = () => {
  node.value.state.select();
  graph.value.update();
};
</script>
