<template>
  <div class="simulationKernelEditor">
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title>Simulation kernel editor</v-toolbar-title>
    </v-toolbar>

    <Card :color="props.color || 'primary'" class="ma-1">
      <v-card-title class="pa-0 text-center text-button">
        Simulation
      </v-card-title>

      <v-card-text class="py-0">
        <ValueSlider
          :thumb-color="props.color || 'primary'"
          class="mx-1 py-2"
          v-bind="options.simulationTimeSettings"
          v-model="simulation.time"
        />
      </v-card-text>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import Card from "../common/Card.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { TSimulation } from "@/types";

const props = defineProps<{
  color?: string;
  simulation: TSimulation;
}>();

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
        value < 2000 ||
        "Large values generate many data points and can put quite a load on your browser.",
    ],
  },
};
</script>
