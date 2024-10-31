<template>
  <v-chip
    class="ma-2"
    density="compact"
    style="position: absolute; top: 72px; z-index: 1000"
  >
    {{ modelStore.state.projectId }}
  </v-chip>

  <ActivityChartGraph
    :graph="graph.activityChartGraph"
    v-if="graph && modelStore.model.isNeuron"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";
import { BaseActivityGraph } from "@/helpers/activity/activityGraph";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNorseModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNorseModelStore();

defineProps<{ modelId: string }>();

const graph = computed(
  () => modelStore.state.project?.activityGraph as BaseActivityGraph
);
</script>
