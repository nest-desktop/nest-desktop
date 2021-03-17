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
        <transition-group
          :key="node.idx"
          name="list"
          v-for="node in state.network.nodes"
        >
          <v-chip
            :color="node.view.color"
            :key="node.idx"
            class="ma-1"
            dark
            small
            tile
            v-if="state.network.view.isNodeSelected(node, false)"
          >
            {{ node.model.label }}
            <span class="mx-1" v-if="state.network.project.app.config.devMode">
              (x: {{ node.view.position.x.toFixed() }} y:
              {{ node.view.position.y.toFixed() }})
            </span>
          </v-chip>
        </transition-group>
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

        <span class="ma-1">
          <v-btn
            :color="state.graph.state.centerFocus ? 'amber' : 'grey'"
            @click="() => state.graph.toggleCenterFocus()"
            icon
            small
            tile
            title="Auto center focus network graph"
          >
            <v-icon
              v-if="state.graph.state.centerFocus"
              v-text="'mdi-image-filter-center-focus'"
            />
            <v-icon
              v-if="!state.graph.state.centerFocus"
              v-text="'mdi-image-filter-center-focus-strong-outline'"
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

export default Vue.extend({
  name: 'NetworkGraphToolbar',
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
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
