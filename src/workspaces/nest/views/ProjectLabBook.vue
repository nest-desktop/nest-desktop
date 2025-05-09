<template>
  <v-container>
    <v-layout id="networkGraphLayout" class="networkGraphLayout" style="height: 300px">
      <NESTNetworkGraph :key="currentProject.id" :network="currentProject.network" />
    </v-layout>

    <v-row no-gutters>
      <v-col class="pa-1" cols="12" sm="4">
        <div class="text-button">Stimulator</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.stimulators"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>

      <v-col class="pa-1" cols="12" sm="4">
        <div class="text-button">Neuron</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.neurons"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>

      <v-col class="pa-1" cols="12" sm="4">
        <div class="text-button">Recorder</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.recorders"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import NodeViewer from "@/components/node/NodeViewer.vue";

import NESTNetworkGraph from "../components/network/NetworkGraph.vue";
import { NESTNode } from "../helpers/node/node";

import { currentProject } from "../stores/project/projectStore";
</script>
