<template>
  <v-card flat>
    <v-card-text>
      <v-layout style="height: 240px">
        <network-graph />
      </v-layout>

      <v-row>
        <v-col cols="12" md="4" sm="6">
          <div class="text-button">Stimulator</div>
          <node-viewer
            :node="(node as Node)"
            :key="index"
            v-for="(node, index) in projectStore.project.network.nodes
              .stimulators"
          />
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <div class="text-button">Neuron</div>
          <node-viewer
            :node="(node as Node)"
            :key="index"
            v-for="(node, index) in projectStore.project.network.nodes.neurons"
          />
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <div class="text-button">Recorder</div>
          <node-viewer
            :node="(node as Node)"
            :key="index"
            v-for="(node, index) in projectStore.project.network.nodes
              .recorders"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import NetworkGraph from "@/nest/components/graph/NetworkGraph.vue";
import NodeViewer from "@nest/components/viewer/NodeViewer.vue";
import { Node } from "@nest/core/node/node";
import { useProjectStore } from "@nest/store/project/projectStore";

const projectStore = useProjectStore();
</script>
