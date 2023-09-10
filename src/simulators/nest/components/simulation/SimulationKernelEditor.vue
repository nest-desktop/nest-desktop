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
          v-model="simulation.kernel.localNumThreads"
        />

        <TickSlider
          :color="props.color"
          class="mx-1 py-1"
          v-bind="options.resolutionSettings"
          v-model="simulation.kernel.resolution"
        />

        <ValueSlider
          :color="props.color"
          class="mx-1 py-1"
          v-bind="options.rngSeedSettings"
          v-model="simulation.kernel.rngSeed"
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
          v-model="simulation.time"
        />
      </v-card-text>
    </card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import ValueSlider from "@/components/controls/ValueSlider.vue";
import Card from "@/components/common/Card.vue";
import TickSlider from "@/components/controls/TickSlider.vue";

import { NESTSimulation } from "../../helpers/simulation/nestSimulation";

import { useNESTProjectStore } from "../../store/project/nestProjectStore";
const projectStore = useNESTProjectStore();

const props = defineProps({
  color: { default: "accent", type: String },
});

const simulation = computed(
  () => projectStore.project.simulation as NESTSimulation
);

const options = {
  autoRNGSeedSettings: {
    variant: "checkbox",
    label: "randomize seed",
    rules: [
      (value: boolean) =>
        !value ||
        "It always generates new script code. Uncheck if you want to modify the script.",
    ],
  },
  resolutionSettings: {
    id: "resolution",
    variant: "tickSlider",
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
    variant: "valueSlider",
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
  threadSettings: {
    variant: "tickSlider",
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
  simulation.value.kernel.updateConfig({
    autoRNGSeed: state.autoRNGSeed,
  });
}

onMounted(() => {
  state.autoRNGSeed = simulation.value.kernel.config.autoRNGSeed;
});
</script>
