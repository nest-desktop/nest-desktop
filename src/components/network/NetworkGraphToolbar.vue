<template>
  <div v-if="state.graph && state.network">
    <v-toolbar
      :key="state.network.hash"
      absolute
      dense
      flat
      style="width:100%; background-color:transparent"
    >
      <div v-if="state.network">
        <v-row>
          <v-col>
            <transition-group name="list" style="display:inline-flex">
              <span
                key="sourceNode"
                v-if="
                  state.network.view.selectedNode ||
                    state.network.view.selectedConnection
                "
              >
                <NetworkNodeChip
                  :graph="state.graph"
                  :node="state.network.view.selectedNode"
                  v-if="state.network.view.selectedNode"
                />
                <NetworkNodeChip
                  :graph="state.graph"
                  :node="state.network.view.selectedConnection.source"
                  v-if="state.network.view.selectedConnection"
                />
              </span>

              <span
                key="connection"
                v-if="
                  state.network.view.selectedConnection ||
                    state.graph.state.enableConnection
                "
              >
                <v-icon class="ma-1" small v-text="'mdi-arrow-right'" />
              </span>

              <span
                key="targetNode"
                v-if="state.network.view.selectedConnection"
              >
                <NetworkNodeChip
                  :graph="state.graph"
                  :node="state.network.view.selectedConnection.target"
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
            v-text="state.network.hash.slice(0, 6)"
            v-if="state.network.hash"
          />
        </span>

        <span>
          <v-btn
            :color="state.graph.state.centerSelected ? 'amber' : 'grey'"
            @click="() => state.graph.toggleCenterSelected()"
            icon
            small
            title="Auto-centering selected"
          >
            <v-icon
              small
              v-text="
                state.graph.state.centerSelected
                  ? 'mdi-image-filter-center-focus'
                  : 'mdi-image-filter-center-focus-strong-outline'
              "
            />
          </v-btn>

          <v-btn
            :color="state.graph.state.centerNetwork ? 'amber' : 'grey'"
            @click="() => state.graph.toggleCenterNetwork()"
            icon
            small
            title="Auto-centering network graph"
          >
            <v-icon small v-text="'mdi-focus-field'" />
          </v-btn>

          <v-btn
            :color="state.graph.state.showGrid ? 'amber' : 'grey'"
            @click="() => state.graph.toggleGrid()"
            icon
            small
            title="Show grid"
          >
            <v-icon
              small
              v-text="state.graph.state.showGrid ? 'mdi-grid' : 'mdi-grid-off'"
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
import { NetworkGraph } from '@/core/network/networkGraph';
import NetworkNodeChip from '@/components/network/NetworkNodeChip.vue';

export default Vue.extend({
  name: 'NetworkGraphToolbar',
  components: {
    NetworkNodeChip,
  },
  props: {
    graph: NetworkGraph,
    network: Network,
  },
  setup(props) {
    const state = reactive({
      graph: props.graph as NetworkGraph,
      network: props.network as Network,
    });

    watch(
      () => [props.graph, props.network],
      () => {
        state.graph = props.graph as NetworkGraph;
        state.network = props.network as Network;
      }
    );

    return {
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
