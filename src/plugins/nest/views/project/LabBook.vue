<template>
  <v-container>
    <v-card>
      <v-card-title> Lab book </v-card-title>
      <v-card-subtitle> </v-card-subtitle>

      <v-card-text>
        <v-list density="compact">
          <v-list-item>
            Project: {{ projectStore.project.state.hash }}
          </v-list-item>
          <v-list-item>
            Network: {{ projectStore.project.network.state.hash }}
          </v-list-item>
          <v-list>
          <v-list-item :key="index" v-for="node,index in projectStore.project.network.nodes">
            Node {{ index }}: {{ node.state.hash }}
          </v-list-item>
          </v-list>
          <v-list-item>
            Simulation: {{ projectStore.project.simulation.code.state.hash }}
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-btn> Action </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useProjectStore } from "../../store/projectStore";
const projectStore = useProjectStore();
</script>
