<template>
  <div v-if="state.graph && state.network">
    <v-toolbar
      :key="state.network.state.hash"
      absolute
      dense
      flat
      height="32"
      style="width: 100%; background-color: transparent"
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
                <v-icon class="ma-1" small v-text="'mdi-arrow-right'" />
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
        <span v-if="state.network.project.app.config.devMode">
          <v-chip
            label
            outlined
            small
            v-if="state.network.state.hash"
            v-text="state.network.state.hash.slice(0, 6)"
          />
        </span>

        <span>
          <v-dialog max-width="450" v-model="state.dialogDownload">
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                small
                title="Export network graph"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small v-text="'mdi-camera'" />
              </v-btn>
            </template>

            <v-card>
              <v-card-title v-text="'Export network graph'" />
              <v-card-subtitle v-text="'Please select the export options'" />
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
                  outlined
                  small
                  text
                  v-text="'close'"
                />
                <v-btn
                  @click="DownloadNetworkGraph"
                  outlined
                  small
                  v-text="'save'"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog max-width="450" v-model="state.dialogDelete">
            <template #activator="{ on, attrs }">
              <v-btn
                :disabled="state.network.isEmpty"
                icon
                small
                title="Delete all network elements"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small v-text="'mdi-trash-can-outline'" />
              </v-btn>
            </template>

            <v-card>
              <v-card-title
                v-text="'Are you sure to delete all elements of this network?'"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  @click="state.dialogDelete = false"
                  outlined
                  small
                  text
                  v-text="'close'"
                />
                <v-btn
                  @click="deleteNetwork"
                  outlined
                  small
                  v-text="'delete'"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn
            :color="
              state.graph.workspace.state.centerSelected ? 'amber' : 'grey'
            "
            @click="() => state.graph.workspace.toggleCenterSelected()"
            icon
            small
            title="Auto-center currently selected element"
          >
            <v-icon
              small
              v-text="
                state.graph.workspace.state.centerSelected
                  ? 'mdi-image-filter-center-focus'
                  : 'mdi-image-filter-center-focus-strong-outline'
              "
            />
          </v-btn>

          <v-btn
            :color="
              state.graph.workspace.state.centerNetwork ? 'amber' : 'grey'
            "
            @click="() => state.graph.workspace.toggleCenterNetwork()"
            icon
            small
            title="Auto-center whole network graph"
          >
            <v-icon small v-text="'mdi-focus-field'" />
          </v-btn>

          <v-btn
            :color="state.graph.workspace.state.showGrid ? 'amber' : 'grey'"
            @click="() => state.graph.workspace.toggleGrid()"
            icon
            small
            title="Show background grid"
          >
            <v-icon
              small
              v-text="
                state.graph.workspace.state.showGrid
                  ? 'mdi-grid'
                  : 'mdi-grid-off'
              "
            />
          </v-btn>
        </span>
      </v-card>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Network } from '@/core/network/network';
import { NetworkGraph } from '@/core/network/networkGraph/networkGraph';
import NodeChip from '@/components/node/NodeChip.vue';

export default Vue.extend({
  name: 'NetworkEditorToolbar',
  components: {
    NodeChip,
  },
  props: {
    graph: NetworkGraph,
    network: Network,
  },
  setup(props) {
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
      state.graph.downloadImage();
      state.dialogDownload = false;
    };

    watch(
      () => [props.graph, props.network, props.transparentWorkspace],
      () => {
        state.graph = props.graph as NetworkGraph;
        state.network = props.network as Network;
      }
    );

    return {
      deleteNetwork,
      DownloadNetworkGraph,
      state,
    };
  },
});
</script>

<style>
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
