<template>
  <div v-if="state.graph && state.network">
    <v-toolbar
      :key="state.network.state.hash"
      absolute
      density="compact"
      height="32"
      style="width: 100%; background-color: transparent"
      variant="flat"
    >
      <div v-if="state.network">
        <v-row>
          <v-col>
            <transition-group name="list" style="display: inline-flex">
              <span
                key="sourceNode"
                v-if="
                  state.network.state.selectedNode ||
                  state.network.state.selectedConnection
                "
              >
                <NodeChip
                  :graph="state.graph"
                  :node="state.network.state.selectedNode"
                  v-if="state.network.state.selectedNode"
                />
                <NodeChip
                  :graph="state.graph"
                  :node="state.network.state.selectedConnection.source"
                  v-if="state.network.state.selectedConnection"
                />
              </span>

              <span
                key="connection"
                v-if="
                  state.network.state.selectedConnection ||
                  state.graph.workspace.state.enableConnection
                "
              >
                <v-icon class="ma-1" size="small" icon="mdi-arrow-right" />
              </span>

              <span
                key="targetNode"
                v-if="state.network.state.selectedConnection"
              >
                <NodeChip
                  :graph="state.graph"
                  :node="state.network.state.selectedConnection.target"
                />
              </span>
            </transition-group>
          </v-col>
        </v-row>
      </div>

      <v-spacer />

      <v-card flat>
        <span v-if="appStore.devMode">
          <v-chip
            label
            size="small"
            variant="outlined"
            v-if="state.network.state.hash"
          >
            {{ state.network.state.hash.slice(0, 6) }}
          </v-chip>
        </span>

        <span>
          <v-dialog max-width="450" v-model="state.dialogDownload">
            <template #activator="{ props }">
              <v-btn
                icon="mdi-camera"
                size="small"
                title="Export network graph"
                v-bind="props"
              />
            </template>

            <v-card>
              <v-card-title> v-text="'Export network graph'" </v-card-title>
              <v-card-subtitle>
                'Please select the export options'
              </v-card-subtitle>
              <v-card-text>
                <v-checkbox
                  label="Transparent background"
                  v-model="state.graph.config.transparentWorkspace"
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  @click="state.dialogDownload = false"
                  size="small"
                  variant="outlined"
                >
                  close
                </v-btn>
                <v-btn @click="DownloadNetworkGraph" size="small">save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog max-width="450" v-model="state.dialogDelete">
            <template #activator="{ props }">
              <v-btn
                :disabled="state.network.isEmpty"
                icon="mdi-trash-can-outline"
                small
                title="Delete all network elements"
                v-bind="props"
              />
            </template>

            <v-card>
              <v-card-title>
                Are you sure to delete all elements of this network?
              </v-card-title>
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

          <v-btn
            :color="
              state.graph.workspace.state.centerSelected ? 'amber' : 'grey'
            "
            :icon="
              state.graph.workspace.state.centerSelected
                ? 'mdi-image-filter-center-focus'
                : 'mdi-image-filter-center-focus-strong-outline'
            "
            @click="() => state.graph.workspace.toggleCenterSelected()"
            size="small"
            title="Auto-center currently selected element"
          />

          <v-btn
            :color="
              state.graph.workspace.state.centerNetwork ? 'amber' : 'grey'
            "
            @click="() => state.graph.workspace.toggleCenterNetwork()"
            icon="mdi-focus-field"
            size="small"
            title="Auto-center whole network graph"
          />

          <v-btn
            :color="state.graph.workspace.state.showGrid ? 'amber' : 'grey'"
            @click="() => state.graph.workspace.toggleGrid()"
            :icon="
              state.graph.workspace.state.showGrid ? 'mdi-grid' : 'mdi-grid-off'
            "
            size="small"
            title="Show background grid"
          />
        </span>
      </v-card>
    </v-toolbar>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

import { Network } from "@nest/core/network/network";
import { NetworkGraph } from "@nest/graph/networkGraph/networkGraph";
import NodeChip from "@nest/components/NodeChip.vue";
import { downloadSVGImage } from "@/utils/download";
import { useAppStore } from "@/store/appStore";

const appStore = useAppStore();

const props = defineProps({
  graph: NetworkGraph,
  network: Network,
  transparentWorkspace: { default: false, type: Boolean },
});

const state = reactive({
  dialogDelete: false,
  dialogDownload: false,
  graph: props.graph as NetworkGraph,
  network: props.network as Network,
});

/**
 * Delete network.
 */
const deleteNetwork = () => {
  state.network.empty();
  state.dialogDelete = false;
};

/**
 * Download network graph as svg.
 */
const DownloadNetworkGraph = () => {
  downloadSVGImage(state.graph.selector.node(), state.network.project.name);
  state.dialogDownload = false;
};

watch(
  () => [props.graph, props.network, props.transparentWorkspace],
  () => {
    state.graph = props.graph as NetworkGraph;
    state.network = props.network as Network;
  }
);
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
