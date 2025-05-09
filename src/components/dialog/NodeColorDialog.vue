<template>
  <v-card>
    <ColorPicker
      v-model="node.view.color"
      :color-scheme="state.colorScheme"
      hide-inputs
      @update:model-value="nodeColorChange()"
    />

    <v-select v-model="state.colorScheme" :items="colorSchemes" class="mx-2" density="compact" hide-details />

    <v-card-actions>
      <v-btn text="reset" @click="resetColor()" />
      <v-btn text="close" @click="closeDialog()" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, nextTick } from "vue";

import ColorPicker from "../common/ColorPicker.vue";
import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { TNode, TNodeGroup } from "@/types";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();
const graph = computed(() => networkGraphStore.state.graph as BaseNetworkGraph);

const props = defineProps<{ node?: TNode | TNodeGroup }>();
const node = computed(() => props.node as TNode);

const state = reactive<{
  colorScheme: string;
}>({
  colorScheme: "category10",
});

const colorSchemes = [
  "all",
  "category10",
  "category20",
  "paired",
  "set1",
  "set2",
  "set3",
  "spectral11",
  "tableau10",
  "google10c",
  "google20c",
];

const emit = defineEmits(["closeDialog"]);
const closeDialog = (value?: string | boolean) => emit("closeDialog", value);

/**
 * Update colors of network and activity.
 */
const nodeColorChange = () => {
  node.value?.changes();
  if (node.value?.isNode) nextTick(() => node.value?.nodes.updateRecordsColor());

  // Render network graph
  graph.value?.updateHash();
};

/**
 * Reset node color.
 */
const resetColor = () => {
  if (node.value) node.value.view.color = "";
  nodeColorChange();
};
</script>
