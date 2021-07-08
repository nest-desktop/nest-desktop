<template>
  <div class="nodeChip">
    <v-chip :color="state.node.view.color" @click="selectNode" dark small>
      <span v-text="state.node.view.label" />
      <span class="mx-1 font-weight-light" v-text="state.node.model.label" />
      <span class="mx-1" v-if="state.node.network.project.app.config.devMode">
        (x:
        {{ state.node.view.position.x.toFixed() }} y:
        {{ state.node.view.position.y.toFixed() }})
      </span>
    </v-chip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { NetworkGraph } from '@/core/network/networkGraph';
import { Node } from '@/core/node/node';

export default Vue.extend({
  name: 'NodeChip',
  props: {
    graph: NetworkGraph,
    node: Node,
  },
  setup(props) {
    const state = reactive({
      graph: props.graph as NetworkGraph,
      node: props.node as Node,
    });

    const selectNode = () => {
      state.node.view.select();
      state.graph.updateNetworkGraph();
    };

    watch(
      () => [props.graph, props.node],
      () => {
        state.graph = props.graph as NetworkGraph;
        state.node = props.node as Node;
      }
    );

    return {
      selectNode,
      state,
    };
  },
});
</script>
