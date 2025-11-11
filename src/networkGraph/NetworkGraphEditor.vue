<template>
  <v-container>
    <NetworkGraphEditorToolbar />
    <NetworkGraph :key="network.project.id" :network />
  </v-container>
</template>

<script setup lang="ts">
import type { TNetwork } from "@/types";

import NetworkGraph from "./components/NetworkGraph.vue";
import NetworkGraphEditorToolbar from "./components/NetworkGraphEditorToolbar.vue";

defineProps<{ network: TNetwork }>();
</script>
