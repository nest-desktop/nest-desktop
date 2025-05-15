<template>
  <v-layout id="networkGraphLayout" class="networkGraphLayout" full-height>
    <NetworkEditorToolbar />
    <NetworkGraph :key="currentProject.id" :network="currentProject.network" />
  </v-layout>
</template>

<script setup lang="ts">
import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";

import { currentProject } from "../stores/project/projectStore";
</script>
