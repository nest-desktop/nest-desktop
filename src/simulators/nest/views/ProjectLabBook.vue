<template>
  <v-container>
    <v-layout
      id="networkGraphLayout"
      class="networkGraphLayout"
      style="height: 300px"
    >
      <NetworkGraph
        :key="network.project.id"
        :network
      >
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
      <v-col
        class="pa-1"
        cols="12"
        sm="4"
      >
        <div class="text-button">
          Stimulator
        </div>
        <NodeViewer
          v-for="(node, index) in network.nodes.stimulators"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>

      <v-col
        class="pa-1"
        cols="12"
        sm="4"
      >
        <div class="text-button">
          Neuron
        </div>
        <NodeViewer
          v-for="(node, index) in network.nodes.neurons"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>

      <v-col
        class="pa-1"
        cols="12"
        sm="4"
      >
        <div class="text-button">
          Recorder
        </div>
        <NodeViewer
          v-for="(node, index) in network.nodes.recorders"
          :key="index"
          :node="(node as NESTNode)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NodeViewer from "@/components/node/NodeViewer.vue";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { NESTNetwork } from "../helpers/network/network";
import { NESTNode } from "../helpers/node/node";

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNESTProjectStore();

const network = computed(
  () => projectStore.state.project.network as NESTNetwork
);
</script>
