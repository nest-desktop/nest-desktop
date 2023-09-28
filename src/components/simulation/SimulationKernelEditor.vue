<template>
  <div class="simulationKernelEditor">
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title>Simulation kernel editor</v-toolbar-title>
    </v-toolbar>

    <card :color="props.color" class="ma-1">
      <v-card-title class="pa-0 text-center text-button">
        Simulation
      </v-card-title>

      <v-card-text class="py-0">
        <ValueSlider
          :color="props.color"
          class="mx-1 py-2"
          v-bind="options.simulationTimeSettings"
          v-model="simulation.time"
        />
      </v-card-text>
    </card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Card from "@/components/common/Card.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";
import { Simulation, SimulationPropTypes } from "@/types/simulationTypes";

const props = defineProps({
  color: { default: "accent", type: String },
  simulation: SimulationPropTypes,
});

const simulation = computed(() => props.simulation as Simulation);

const options = {
  simulationTimeSettings: {
    id: "time",
    variant: "valueSlider",
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
