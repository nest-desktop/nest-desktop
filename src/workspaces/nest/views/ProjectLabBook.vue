<template>
  <v-container>
    <v-layout id="networkGraphLayout" class="networkGraphLayout" style="height: 300px">
      <NetworkGraph :key="currentProject.id" :network="currentProject.network">
        <template #marker="{ connection }">
          <circle
            v-if="connection.view.markerEndLabel === 'assigned'"
            fill="transparent"
            r="4"
            stroke="currentcolor"
            transform="translate(5,5)"
          />
        </template>

        <template #components>
          <g id="nodeGroups" />
          <g id="modelAssigned" />
          <g id="connections" />
          <g id="nodes" />
        </template>
      </NetworkGraph>
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

<script lang="ts" setup>
import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NodeViewer from "@/components/node/NodeViewer.vue";

import { NESTNode } from "../helpers/node/node";

import { currentProject } from "../stores/project/projectStore";
</script>
