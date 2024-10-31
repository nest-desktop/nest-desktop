<template>
  <v-card>
    <ColorPicker
      :colorScheme="state.colorScheme"
      @update:model-value="nodeColorChange()"
      hide-inputs
      v-model="node.view.color"
    />

    <v-select
      :items="colorSchemes"
      class="mx-2"
      density="compact"
      hide-details
      v-model="state.colorScheme"
    />

    <v-card-actions>
      <v-btn @click="resetColor" text="reset" />
      <v-btn @click="closeDialog()" text="close" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, reactive, nextTick } from "vue";

import ColorPicker from "../common/ColorPicker.vue";
import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TNode } from "@/types";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();
const graph = computed(() => networkGraphStore.state.graph);

const props = defineProps<{ node?: NodeGroup | TNode }>();
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
  if (node.value?.isNode) {
    nextTick(() => node.value?.nodes.updateRecordsColor());
  }

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
