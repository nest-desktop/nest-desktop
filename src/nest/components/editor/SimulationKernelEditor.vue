<template>
  <div class="ma-2px simulationKernel">
    <card color="primary">
      <v-card-title class="pa-0 text-center text-button">
        Simulation kernel
      </v-card-title>

      <v-card-text>
        <TickSlider
          v-bind="options.threadSettings"
          @update:modelValue="paramChange()"
          class="mx-1 py-1"
          v-model="state.simulation.kernel.localNumThreads"
        />

        <TickSlider
          v-bind="options.resolutionSettings"
          @update:modelValue="paramChange()"
          class="mx-1 py-1"
          v-model="state.simulation.kernel.resolution"
        />

        <ValueSlider
          v-bind="options.rngSeedSettings"
          @update:modelValue="paramChange()"
          class="mx-1 py-1"
          v-model="state.simulation.kernel.rngSeed"
        />

        <v-checkbox
          v-bind="options.autoRNGSeedSettings"
          @update:modelValue="updateAutoRNGSeed"
          hide-details="auto"
          class="mx-1"
          v-model="state.autoRNGSeed"
        />
      </v-card-text>
    </card>

    <card color="primary">
      <v-card-title class="pa-0 text-center text-button">
        Simulation
      </v-card-title>

      <v-card-text class="py-0">
        <ValueSlider
          v-bind="options.simulationTimeSettings"
          @update:modelValue="paramChange()"
          class="mx-1 py-2"
          v-model="state.simulation.time"
        />
      </v-card-text>
    </card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

import { Simulation } from "@nest/core/simulation/simulation";
import ValueSlider from "@/components/common/ValueSlider.vue";
import Card from "@/components/common/Card.vue";
import TickSlider from "@/components/common/TickSlider.vue";

const props = defineProps({
  simulation: Simulation,
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
  simulation: props.simulation as Simulation,
});

/**
 * Triggers when parameter is changed.
 */
const paramChange = () => {
  state.simulation.project.simulation.code.generate();
};

/**
 * Updates when the usage of automatic RNG seed is switched on/off.
 */
function updateAutoRNGSeed() {
  state.simulation.kernel.updateConfig({
    autoRNGSeed: state.autoRNGSeed,
  });
}

onMounted(() => {
  state.simulation = props.simulation as Simulation;
  state.autoRNGSeed = state.simulation.kernel.config.autoRNGSeed;
});
</script>
