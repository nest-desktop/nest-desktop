<template>
  <v-container>
    <v-layout id="networkGraphLayout" class="networkGraphLayout" style="height: 300px">
      <NetworkGraph :key="network.project.id" :network />
    </v-layout>

    <v-row no-gutters>
      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Stimulator</div>
        <NodeViewer v-for="(node, index) in network.nodes.stimulators" :key="index" :node="(node as NorseNode)" />
      </v-col>

      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Neuron</div>
        <NodeViewer v-for="(node, index) in network.nodes.neurons" :key="index" :node="(node as NorseNode)" />
      </v-col>

      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Recorder</div>
        <NodeViewer v-for="(node, index) in network.nodes.recorders" :key="index" :node="(node as NorseNode)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NodeViewer from "@/components/node/NodeViewer.vue";

import { NorseNetwork } from "../helpers/network/network";
import { NorseNode } from "../helpers/node/node";

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore = useNorseProjectStore();

const network = computed(() => projectStore.state.project?.network as NorseNetwork);
</script>
