<template>
  <div>
    <v-chip class="ma-2" density="compact" style="position: absolute; top: 72px; z-index: 1000">
      {{ modelStore.state.projectId }}
    </v-chip>

    <ActivityChartGraph
      v-if="modelStore.state.project?.activityGraph && modelStore.state.model.isNeuron"
      :graph="modelStore.state.project.activityGraph.activityChartGraph"
    />
  </div>
</template>

<script setup lang="ts">
import { ActivityChartGraph } from "@/activityGraph/components";
import { getCurrentStore } from "@/app";

const modelStore = getCurrentStore("model");
</script>
