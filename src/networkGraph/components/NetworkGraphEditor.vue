<template>
  <NetworkGraphEditorToolbar />
  <NetworkGraph :key="network.project.id" :network />
</template>

<script setup lang="ts">
import type { TNetwork } from "@/types";

import NetworkGraph from "./NetworkGraph.vue";
import NetworkGraphEditorToolbar from "./NetworkGraphEditorToolbar.vue";

defineProps<{ network: TNetwork }>();
</script>
