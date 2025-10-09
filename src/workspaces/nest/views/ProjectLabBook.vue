<template>
  <v-container>
    <v-layout id="networkGraphLayout" class="networkGraphLayout" style="height: 300px">
      <NESTNetworkGraph :key="currentProject.id" :network="currentProject.network" />
    </v-layout>

    <v-row no-gutters>
      <v-col  v-if="currentProject.network.models.all.length > 0" class="pa-1" cols="12" :sm="6">
        <div class="text-button">Copied models</div>
        <CopyModelViewer
          v-for="(model, index) in currentProject.network.models.all"
          :key="index"
          :model="(model as NESTCopyModel)"
        />
      </v-col>

      <v-col class="pa-1" cols="12" :sm="ncols">
        <div class="text-button">Stimulator</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.stimulators"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>

      <v-col class="pa-1" cols="12" :sm="ncols">
        <div class="text-button">Neuron</div>
        <NodeViewer
          v-for="(node, index) in currentProject.network.nodes.neurons"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>

      <v-col class="pa-1" cols="12" :sm="ncols">
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
import { computed } from "vue";

import NodeViewer from "@/components/node/NodeViewer.vue";

import CopyModelViewer from "../components/model/CopyModelViewer.vue";
import NESTNetworkGraph from "../components/network/NetworkGraph.vue";
import { NESTCopyModel } from "../types";
import { NESTNode } from "../helpers/node/node";
import { currentProject } from "../stores/project/projectStore";

const ncols = computed(() => (currentProject.value.network.models.all.length > 0 ? 6 : 4));
</script>
