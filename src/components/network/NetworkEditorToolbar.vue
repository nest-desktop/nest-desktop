<template>
  <v-toolbar
    :collapse="state.collapse"
    :key="graph?.network.state.hash"
    density="compact"
    absolute
  >
    <v-btn icon size="small" v-if="graph?.network.nodes.state.selectedNode">
      <node-avatar
        :node="(graph?.network.nodes.state.selectedNode as Node)"
        @click="graph?.network.nodes.state.selectedNode.state.select()"
        size="32px"
      />
    </v-btn>

    <v-spacer />

    <div v-if="graph?.network.connections.state.selectedConnection">
      <connection-avatar
        :connection="(graph?.network.connections.state.selectedConnection as Connection)"
      />
    </div>

    <v-spacer />

    <v-btn
      icon="mdi-camera"
      size="small"
      title="Export network graph"
      @click="downloadNetworkGraph"
    />

    <!-- <v-btn
      @click="state.collapse = !state.collapse"
      icon="mdi-tools"
      size="small"
    /> -->

    <template v-if="!state.collapse">
      <v-dialog maxWidth="450" v-model="state.dialogDelete">
        <template #activator="{ props }">
          <v-btn
            :disabled="graph?.network.isEmpty"
            icon="mdi-trash-can-outline"
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
              @click="state.dialogDelete = false"
              size="small"
              variant="outlined"
            >
              close
            </v-btn>
            <v-btn @click="deleteNetwork" size="small" variant="outlined">
              delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--
      <v-text-field
        class="px-4"
        hideDetails
        prependInnerIcon="mdi-pencil"
        singleLine
        v-model="projectStore.state.project.name"
      /> -->

      <v-btn
        :color="graph?.workspace.state.centerSelected ? 'amber' : 'grey'"
        :icon="
          graph?.workspace.state.centerSelected
            ? 'mdi-image-filter-center-focus'
            : 'mdi-image-filter-center-focus-strong-outline'
        "
        @click="() => graph?.workspace.toggleCenterSelected()"
        size="small"
        title="Auto-center currently selected element"
      />

      <v-btn
        :color="graph?.workspace.state.centerNetwork ? 'amber' : 'grey'"
        @click="() => graph?.workspace.toggleCenterNetwork()"
        icon="mdi-focus-field"
        size="small"
        title="Auto-center whole network graph"
      />

      <v-btn
        :color="graph?.workspace.state.showGrid ? 'amber' : 'grey'"
        :icon="graph?.workspace.state.showGrid ? 'mdi-grid' : 'mdi-grid-off'"
        @click="() => graph?.workspace.toggleGrid()"
        size="small"
        title="Show background grid"
      />
    </template>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";

import { downloadSVGImage } from "@/helpers/common/download";
import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
import ConnectionAvatar from "@/components/connection/ConnectionAvatar.vue";
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import { Node } from "@/types/nodeTypes";
import { Connection } from "@/types/connectionTypes";

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
