<template>
  <v-container>
    <v-layout id="networkGraphLayout" class="networkGraphLayout" style="height: 300px">
      <NESTNetworkGraph :key="currentProject.id" :network="currentProject.network" />
    </v-layout>

    <v-row no-gutters>
      <v-col v-if="currentProject.network.models.all.length > 0" :sm="6" class="pa-1" cols="12">
        <div class="text-button">Copied models</div>
        <CopyModelViewer
          v-for="(model, index) in currentProject.network.models.all"
          :key="index"
          :model="model as NESTCopyModel"
        />
      </v-col>

      <v-col :sm="ncols" class="pa-1" cols="12">
        <div class="text-button">Stimulator</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.stimulators"
          :key="index"
          :node="node as NESTNode"
        />
      </v-col>

      <v-col :sm="ncols" class="pa-1" cols="12">
        <div class="text-button">Neuron</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.neurons"
          :key="index"
          :node="node as NESTNode"
        />
      </v-col>

      <v-col :sm="ncols" class="pa-1" cols="12">
        <div class="text-button">Recorder</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.recorders"
          :key="index"
          :node="node as NESTNode"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

import NodeViewer from "@/networkGraph/components/node/NodeViewer.vue";

import CopyModelViewer from "../networkGraph/components/model/CopyModelViewer.vue";
import NESTNetworkGraph from "../networkGraph/components/networkGraph/NetworkGraph.vue";
import type { NESTCopyModel, NESTNode } from "../types";

import { currentProject } from "../stores/project/projectStore";
const ncols = computed(() => (currentProject.value.network.models.all.length > 0 ? 6 : 4));
</script>
