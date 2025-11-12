<template>
  <NetworkGraphEditorToolbar />
  <NetworkGraph :key="network.project.id" :network />
</template>

<script setup lang="ts">
import type { TNetwork } from "@/types";

import NetworkGraph from "./components/NetworkGraph.vue";
import NetworkGraphEditorToolbar from "./components/NetworkGraphEditorToolbar.vue";

defineProps<{ network: TNetwork }>();
</script>
