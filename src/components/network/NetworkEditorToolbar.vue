<template>
  <v-toolbar
    :key="graph?.network.hash"
    :collapse="state.collapse"
    density="compact"
    absolute
  >
    <v-btn
      v-if="graph?.network.nodes.state.selectedNode"
      icon
      size="small"
      @click="graph?.network.nodes.state.selectedNode.state.select()"
    >
      <NodeAvatar
        :node="(graph?.network.nodes.state.selectedNode as TNode)"
        size="32px"
      />
    </v-btn>

    <v-btn
      v-if="graph?.network.connections.state.selectedConnection"
      @click="
        graph?.network.connections.state.selectedConnection.state.select()
      "
    >
      <ConnectionAvatar
        :connection="(graph?.network.connections.state.selectedConnection as TConnection)"
      />
    </v-btn>

    <v-spacer />

    <v-btn
      icon="mdi:mdi-camera"
      size="small"
      title="Export network graph"
      @click="downloadNetworkGraph"
    />

    <!-- <v-btn
      @click="state.collapse = !state.collapse"
      icon="mdi:mdi-tools"
      size="small"
    /> -->

    <template v-if="!state.collapse">
      <v-dialog
        v-model="state.dialogDelete"
        max-width="450"
      >
        <template #activator="{ props }">
          <v-btn
            :disabled="graph?.network.isEmpty"
            icon="mdi:mdi-trash-can-outline"
            size="small"
            title="Delete all network elements"
            v-bind="props"
          />
        </template>

        <v-card>
          <v-card-text>
            Are you sure to delete all elements of this network?
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              size="small"
              variant="outlined"
              @click="state.dialogDelete = false"
            >
              close
            </v-btn>
            <v-btn
              size="small"
              variant="outlined"
              @click="deleteNetwork"
            >
              delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        size="small"
        title="Auto-center currently selected element"
        @click="() => graph?.workspace.toggleCenterSelected()"
      />

      <v-btn
        :color="graph?.workspace.state.centerNetwork ? 'amber' : 'grey'"
        icon="mdi:mdi-focus-field"
        size="small"
        title="Auto-center whole network graph"
        @click="() => graph?.workspace.toggleCenterNetwork()"
      />

      <v-btn
        :color="graph?.workspace.state.showGrid ? 'amber' : 'grey'"
        :icon="
          graph?.workspace.state.showGrid ? 'mdi:mdi-grid' : 'mdi:mdi-grid-off'
        "
        size="small"
        title="Show background grid"
        @click="() => graph?.workspace.toggleGrid()"
      />
    </template>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";

import ConnectionAvatar from "@/components/connection/ConnectionAvatar.vue";
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import { TConnection } from "@/types/connectionTypes";
import { TNode } from "@/types/nodeTypes";
import { downloadSVGImage } from "@/helpers/common/download";
import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";

const networkGraphStore = useNetworkGraphStore();

const graph = computed(() => networkGraphStore.state.graph);

const state = reactive({
  dialogDelete: false,
  dialogDownload: false,
  collapse: false,
});

/**
 * Delete network.
 */
const deleteNetwork = () => {
  graph.value?.network.clear();
  state.dialogDelete = false;
};

/**
 * Download network graph as svg.
 */
const downloadNetworkGraph = () => {
  if (!graph.value.selector) return;
  downloadSVGImage(
    graph.value?.selector.node(),
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
