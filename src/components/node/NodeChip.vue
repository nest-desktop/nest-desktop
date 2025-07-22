<template>
  <v-chip :color="node.color" size="small" @click="selectNode">
    <span class="font-weight-bold">{{ node.label }}</span>
    <span class="mx-1">{{ node.model.state.label }}</span>

    <span v-if="appStore.state.devMode" class="mx-1">
      ({{ node.state.position.x.toFixed() }}, {{ node.state.position.y.toFixed() }})
    </span>
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { TNetworkGraph, TNode } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{
  graph: TNetworkGraph;
  node: TNode;
}>();
const graph = computed(() => props.graph);
const node = computed(() => props.node);

const selectNode = () => {
  node.value.select();
  graph.value.update();
};
</script>
