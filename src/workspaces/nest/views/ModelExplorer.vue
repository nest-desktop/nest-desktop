<template>
  <v-chip class="ma-2" density="compact" style="position: absolute; top: 72px; z-index: 1000">
    {{ modelStore.state.projectId }}
  </v-chip>

  <ActivityChartGraph
    v-if="currentProject.activityGraph && currentModel.isNeuron"
    :graph="currentProject.activityGraph.activityChartGraph"
  />
</template>

<script lang="ts" setup>
import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";

import { currentModel, currentProject, useNESTModelStore } from "../stores/model/modelStore";
const modelStore = useNESTModelStore();

defineProps<{ modelId: string }>();
</script>
