<template>
  <v-container>
    <v-layout
      class="networkGraphLayout"
      id="networkGraphLayout"
      style="height: 300px"
    >
      <NetworkGraph :key="network.project.id" :network />
    </v-layout>

    <v-row no-gutters>
      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Stimulator</div>
        <NodeViewer
          :node="(node as NESTNode)"
          :key="index"
          v-for="(node, index) in network.nodes.stimulators"
        />
      </v-col>

      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Neuron</div>
        <NodeViewer
          :node="(node as NESTNode)"
          :key="index"
          v-for="(node, index) in network.nodes.neurons"
        />
      </v-col>

      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Recorder</div>
        <NodeViewer
          :node="(node as NESTNode)"
          :key="index"
          v-for="(node, index) in network.nodes.recorders"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NodeViewer from "@/components/node/NodeViewer.vue";

import NetworkGraph from "../components/network/NetworkGraph.vue";
import { NESTNetwork } from "../helpers/network/network";
import { NESTNode } from "../helpers/node/node";

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore = useNESTProjectStore();

const network = computed(
  () => projectStore.state.project.network as NESTNetwork
);
</script>
