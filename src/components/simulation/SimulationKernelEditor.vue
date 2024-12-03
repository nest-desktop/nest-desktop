<template>
  <div class="simulationKernelEditor">
    <v-toolbar color="transparent" density="compact" title="Simulation kernel editor" />

    <Card :color="props.color" class="ma-1" title="Simulation">
      <v-card-text class="py-0">
        <ValueSlider
          v-bind="options.simulationTimeSettings"
          v-model="simulation.time"
          :thumb-color="props.color"
          class="mx-1 py-2"
        />
      </v-card-text>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Card from "../common/Card.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { TSimulation } from "@/types";

const props = defineProps<{
  color?: string;
  simulation: TSimulation;
}>();
const simulation = computed(() => props.simulation);

const options = {
  simulationTimeSettings: {
    id: "time",
    component: "valueSlider",
    label: "simulation time",
    max: 2000,
    min: 0,
    unit: "ms",
    value: 1000,
    rules: [
      (value: number) =>
        value < 2000 || "Large values generate many data points and can put quite a load on your browser.",
    ],
  },
};
</script>
