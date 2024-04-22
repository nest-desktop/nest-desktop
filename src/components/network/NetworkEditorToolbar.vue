<template>
  <v-toolbar
    :collapse="state.collapse"
    :key="graph?.network.hash"
    absolute
    density="compact"
  >
    <v-btn
      @click="graph?.network.nodes.state.selectedNode?.state.select()"
      icon
      size="small"
      v-if="graph?.network.nodes.state.selectedNode"
    >
      <NodeAvatar
        :node="(graph?.network.nodes.state.selectedNode as TNode)"
        size="32px"
      />
    </v-btn>

    <v-btn
      @click="
        graph?.network.connections.state.selectedConnection?.state.select()
      "
      v-if="graph?.network.connections.state.selectedConnection"
    >
      <ConnectionAvatar
        :connection="(graph?.network.connections.state.selectedConnection as TConnection)"
      />
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

import ConnectionAvatar from "@/components/connection/ConnectionAvatar.vue";
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import { TConnection } from "@/types/connectionTypes";
import { TNode } from "@/types/nodeTypes";
import { downloadSVGImage } from "@/helpers/common/download";
import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";

const networkGraphStore = useNetworkGraphStore();

const graph = computed(() => networkGraphStore.state.graph);

const state = reactive({
  collapse: false,
  dialogDelete: false,
  dialogDownload: false,
});

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
