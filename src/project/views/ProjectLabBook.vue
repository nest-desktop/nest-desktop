<template>
  <div>
    <v-layout style="height: 300px">
      <NetworkGraph :key="projectStore.state.project.id" :network="projectStore.state.project.network" />
    </v-layout>

    <v-container v-if="projectStore.state.project">
      <v-row no-gutters>
        <v-col class="pa-1" cols="12" md="4" sm="6">
          <div class="text-button">Stimulator</div>
          <NodeViewer
            v-for="(node, index) in projectStore.state.project.network.nodes.stimulators"
            :key="index"
            :node
          />
        </v-col>

        <v-col class="pa-1" cols="12" md="4" sm="6">
          <div class="text-button">Neuron</div>
          <NodeViewer v-for="(node, index) in projectStore.state.project.network.nodes.neurons" :key="index" :node />
        </v-col>

        <v-col class="pa-1" cols="12" md="4" sm="6">
          <div class="text-button">Recorder</div>
          <NodeViewer v-for="(node, index) in projectStore.state.project.network.nodes.recorders" :key="index" :node />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { NetworkGraph } from "@/networkGraph/components";
import { NodeViewer } from "@/network/components";
import { getCurrentStore } from "@/app";

const projectStore = getCurrentStore("project");
</script>
