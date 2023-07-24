<template>
  <div class="simulationKernelEditor">
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title> Simulation kernel editor</v-toolbar-title>
    </v-toolbar>

    <card :color="props.color" class="ma-1">
      <v-card-title class="pa-0 text-center text-button">
        Simulation kernel
      </v-card-title>

      <v-card-text>
        <TickSlider
          :color="props.color"
          class="mx-1 py-1"
          v-bind="options.threadSettings"
          v-model="projectStore.project.simulation.kernel.localNumThreads"
        />

        <TickSlider
          :color="props.color"
          class="mx-1 py-1"
          v-bind="options.resolutionSettings"
          v-model="projectStore.project.simulation.kernel.resolution"
        />

        <ValueSlider
          :color="props.color"
          class="mx-1 py-1"
          v-bind="options.rngSeedSettings"
          v-model="projectStore.project.simulation.kernel.rngSeed"
        />

        <v-checkbox
          :color="props.color"
          @update:modelValue="updateAutoRNGSeed()"
          class="mx-1"
          hide-details="auto"
          v-bind="options.autoRNGSeedSettings"
          v-model="state.autoRNGSeed"
        />
      </v-card-text>
    </card>

    <card :color="props.color" class="ma-1">
      <v-card-title class="pa-0 text-center text-button">
        Simulation
      </v-card-title>

      <v-card-text class="py-0">
        <ValueSlider
          :color="props.color"
          class="mx-1 py-2"
          v-bind="options.simulationTimeSettings"
          v-model="projectStore.project.simulation.time"
        />
      </v-card-text>
    </card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

import ValueSlider from "@/components/common/ValueSlider.vue";
import Card from "@/components/common/Card.vue";
import TickSlider from "@/components/common/TickSlider.vue";

import { useProjectStore } from "@nest/store/project/projectStore";

const projectStore = useProjectStore();

const props = defineProps({
  color: { default: "accent", type: String },
});

const options = {
  autoRNGSeedSettings: {
    input: "checkbox",
    label: "randomize seed",
    rules: [
      (value: boolean) =>
        !value ||
        "It always generates new script code. Uncheck if you want to modify the script.",
    ],
  },
  resolutionSettings: {
    id: "resolution",
    input: "tickSlider",
    label: "simulation resolution",
    ticks: [0.01, 0.1, 1, 10],
    unit: "ms",
    rules: [
      (value: number) =>
        value >= 0.1 ||
        "Small values generate many data points and can put quite a load on your browser.",
    ],
  },
  rngSeedSettings: {
    id: "rng_seed",
    input: "valueSlider",
    label: "seed of the random number generator",
    max: 1000,
    min: 1,
    rules: [
      (value: number) => value > 0 || "The value must be strictly positive.",
    ],
    value: 1,
  },
  simulationTimeSettings: {
    id: "time",
    input: "valueSlider",
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
  threadSettings: {
    input: "tickSlider",
    label: "local number of threads",
    ticks: [1, 2, 4, 8],
  },
};

const state = reactive({
  autoRNGSeed: false,
});

/**
 * Updates when the usage of automatic RNG seed is switched on/off.
 */
function updateAutoRNGSeed() {
  projectStore.project.simulation.kernel.updateConfig({
    autoRNGSeed: state.autoRNGSeed,
  });
}

onMounted(() => {
  state.autoRNGSeed = projectStore.project.simulation.kernel.config.autoRNGSeed;
});
</script>
