<template>
  <v-toolbar
    :collapse="state.collapse"
    :key="graph?.network.hash"
    absolute
    density="compact"
  >
    <v-btn
      @click="groupSelectedNodes()"
      icon="mdi:mdi-select-group"
      size="small"
      :disabled="!graph?.network.nodes.hasAnySelectedNodes"
    />

    <v-btn
      @click="graph?.network.nodes.toggleNodeSelection(node as TNode)"
      :key="index"
      icon
      size="small"
      v-for="(node, index) in graph?.network.nodes.state.selectedNodes"
    >
      <NodeAvatar :node="(node as TNode)" :size="32" />
    </v-btn>

    <v-spacer />

    <v-btn
      @click="downloadNetworkGraph"
      icon="mdi:mdi-camera"
      size="small"
      title="Export network graph"
    />

    <!-- <v-btn
      @click="state.collapse = !state.collapse"
      icon="mdi:mdi-tools"
      size="small"
    /> -->

    <template v-if="!state.collapse">
      <v-btn
        :disabled="graph?.network.isEmpty"
        @click="emptyNetwork()"
        icon="mdi:mdi-trash-can-outline"
        size="small"
        title="Delete all network elements"
      />

      <!--
      <v-text-field
        class="px-4"
        hide-details
        prepend-inner-icon="mdi:mdi-pencil"
        single-line
        v-model="projectStore.state.project.name"
      /> -->

      <v-btn
        :color="graph?.workspace.state.centerSelected ? 'amber' : 'grey'"
        :icon="
          graph?.workspace.state.centerSelected
            ? 'mdi:mdi-image-filter-center-focus'
            : 'mdi:mdi-image-filter-center-focus-strong-outline'
        "
        @click="() => graph?.workspace.toggleCenterSelected()"
        size="small"
        title="Auto-center currently selected element"
      />

      <v-btn
        :color="graph?.workspace.state.centerNetwork ? 'amber' : 'grey'"
        @click="() => graph?.workspace.toggleCenterNetwork()"
        icon="mdi:mdi-focus-field"
        size="small"
        title="Auto-center whole network graph"
      />

      <v-btn
        :color="graph?.workspace.state.showGrid ? 'amber' : 'grey'"
        :icon="
          graph?.workspace.state.showGrid ? 'mdi:mdi-grid' : 'mdi:mdi-grid-off'
        "
        @click="() => graph?.workspace.toggleGrid()"
        size="small"
        title="Show background grid"
      />
    </template>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import NodeAvatar from "../node/avatar/NodeAvatar.vue";
import { TNode } from "@/types";
import { downloadSVGImage } from "@/utils/download";
import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";

const networkGraphStore = useNetworkGraphStore();

const graph = computed(() => networkGraphStore.state.graph);

const state = reactive<{
  collapse: boolean;
  dialogDelete: boolean;
  dialogDownload: boolean;
}>({
  collapse: false,
  dialogDelete: false,
  dialogDownload: false,
});

/**
 * Download network graph as svg.
 */
const downloadNetworkGraph = () => {
  if (!graph.value?.selector) return;

  downloadSVGImage(
    graph.value?.selector.node() as Node,
    graph.value?.network.project.name
  );
  state.dialogDownload = false;
};

/**
 * Empty network.
 */
const emptyNetwork = () => {
  createDialog({
    buttons: [
      { title: "no", key: "no" },
      { title: "yes", key: "yes" },
    ],
    text: "Are you sure to delete all elements of this network?",
    title: "Empty network?",
  }).then((answer: string) => {
    if (answer === "yes") {
      graph.value?.network.clear();
    }
  });
};

const groupSelectedNodes = () => {
  if (graph && graph.value) {
    graph.value.network.nodes.groupSelected();
    graph.value.nodeGroupGraph.update();
  }
};
</script>

<style lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
