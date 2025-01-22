<template>
  <v-container>
    <v-layout id="networkGraphLayout" class="networkGraphLayout" style="height: 300px">
      <!-- <NetworkGraph :key="network.project.id" :network /> -->
    </v-layout>

    <!-- <v-row no-gutters>
      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Stimulator</div>
        <NodeViewer v-for="(node, index) in network.nodes.stimulators" :key="index" :node="(node as BaseNode)" />
      </v-col>

      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Neuron</div>
        <NodeViewer v-for="(node, index) in network.nodes.neurons" :key="index" :node="(node as BaseNode)" />
      </v-col>

      <v-col class="pa-1" cols="12" md="4" sm="6">
        <div class="text-button">Recorder</div>
        <NodeViewer v-for="(node, index) in network.nodes.recorders" :key="index" :node="(node as BaseNode)" />
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script setup lang="ts">
// import { computed } from "vue";

// import NetworkGraph from "@/components/network/NetworkGraph.vue";
// import NodeViewer from "@/components/node/NodeViewer.vue";
// import { BaseNetwork } from "@/helpers/network/network";
// import { BaseNode } from "@/helpers/node/node";

// import { useElephantProjectStore } from "../stores/project/projectStore";
// const projectStore = useElephantProjectStore();

// const network = computed(() => projectStore.state.project?.network as BaseNetwork);
</script>
