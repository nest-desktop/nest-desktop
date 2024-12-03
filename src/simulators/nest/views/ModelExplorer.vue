<template>
  <v-chip class="ma-2" density="compact" style="position: absolute; top: 72px; z-index: 1000">
    {{ modelStore.state.projectId }}
  </v-chip>

  <ActivityChartGraph v-if="graph && modelStore.model.isNeuron" :graph="graph.activityChartGraph" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";
import { TModelStore } from "@/stores/model/defineModelStore";

import { NESTActivityGraph } from "../helpers/activity/activityGraph";

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

defineProps<{ modelId: string }>();

const graph = computed(() => modelStore.state.project?.activityGraph as NESTActivityGraph);
</script>
