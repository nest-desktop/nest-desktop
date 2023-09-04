<template>
  <v-toolbar
    :collapse="state.collapse"
    :key="graph?.network.state.hash"
    color="transparent"
    density="compact"
    absolute
  >
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
      <v-dialog max-width="450" v-model="state.dialogDelete">
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
        class="px-4  "
        hide-details
        prepend-inner-icon="mdi-pencil"
        single-line
        v-model="projectStore.project.name"
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
        @click="() => graph?.workspace.toggleGrid()"
        :icon="graph?.workspace.state.showGrid ? 'mdi-grid' : 'mdi-grid-off'"
        size="small"
        title="Show background grid"
      />
    </template>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";

import { downloadSVGImage } from "@/utils/download";

import { NetworkGraph } from "@nest/graph/networkGraph/networkGraph";
import { useNetworkGraphStore } from "@nest/store/graph/networkGraphStore";

const networkGraphStore = useNetworkGraphStore();
const graph = computed(() => networkGraphStore.graph as NetworkGraph);

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
