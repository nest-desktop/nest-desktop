<template>
  <v-chip :color="node.view.color" size="small" @click="selectNode">
    <span class="font-weight-bold">{{ node.view.label }}</span>
    <span class="mx-1">{{ node.model.state.label }}</span>

    <span v-if="appStore.state.devMode" class="mx-1">
      ({{ node.view.position.x.toFixed() }}, {{ node.view.position.y.toFixed() }})
    </span>
  </v-chip>
</template>

<script lang="ts" setup>
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
