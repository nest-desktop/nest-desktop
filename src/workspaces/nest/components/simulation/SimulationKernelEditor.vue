<template>
  <div class="simulationKernelEditor">
    <v-toolbar color="transparent" density="compact" title="Simulation kernel editor" />

    <Card :color="props.color" class="ma-1" title="Modules">
      <v-card-text>
        <NESTModuleSelect
          v-model="simulation.modules"
          :return-object="false"
          chips
          clearable
          closable-chips
          class="pa-2"
          hide-selected
          label="Install modules"
          multiple
          @update:model-value="simulation.changes({ preventSimulation: true })"
        />
      </v-card-text>
    </Card>

    <Card :color="props.color" class="ma-1" title="Simulation kernel">
      <v-card-text>
        <TickSlider
          v-bind="options.threadSettings"
          v-model="simulation.kernel.localNumThreads"
          :thumb-color="props.color"
          class="mx-1 py-1"
        />

        <TickSlider
          v-bind="options.resolutionSettings"
          v-model="simulation.kernel.resolution"
          :thumb-color="props.color"
          class="mx-1 py-1"
        />

        <ValueSlider
          v-bind="options.rngSeedSettings"
          v-model="simulation.kernel.rngSeed"
          :thumb-color="props.color"
          class="mx-1 py-1"
        />

        <v-checkbox
          v-bind="options.autoRNGSeedSettings"
          v-model="state.autoRNGSeed"
          :color="props.color"
          class="mx-1"
          hide-details="auto"
          @update:model-value="updateAutoRNGSeed()"
        />
      </v-card-text>
    </Card>

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

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";

import Card from "@/components/common/Card.vue";
import TickSlider from "@/components/controls/TickSlider.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";

import NESTModuleSelect from "../module/NESTModuleSelect.vue";
import { NESTSimulation } from "../../helpers/simulation/simulation";

import { useNESTProjectStore } from "../../stores/project/projectStore";
const projectStore = useNESTProjectStore();

const props = defineProps({ color: { default: "primary", type: String } });

const simulation = computed(() => projectStore.state.project?.simulation as NESTSimulation);

const options = {
  autoRNGSeedSettings: {
    component: "checkbox",
    label: "randomize seed",
    rules: [
      (value: boolean) => !value || "It always generates new script code. Uncheck if you want to modify the script.",
    ],
  },
  resolutionSettings: {
    id: "resolution",
    component: "tickSlider",
    label: "simulation resolution",
    tickLabels: [0.01, 0.1, 1, 10],
    unit: "ms",
    rules: [
      (value: number) =>
        value >= 0.1 || "Small values generate many data points and can put quite a load on your browser.",
    ],
  },
  rngSeedSettings: {
    id: "rng_seed",
    component: "valueSlider",
    label: "seed of the random number generator",
    max: 1000,
    min: 1,
    rules: [(value: number) => value > 0 || "The value must be strictly positive."],
    value: 1,
  },
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
  threadSettings: {
    component: "tickSlider",
    label: "local number of threads",
    tickLabels: [1, 2, 4, 8],
  },
};

const state = reactive<{ autoRNGSeed: boolean }>({
  autoRNGSeed: false,
});

/**
 * Updates when the usage of automatic RNG seed is switched on/off.
 */
function updateAutoRNGSeed() {
  simulation.value.kernel.config?.update({
    autoRNGSeed: state.autoRNGSeed,
  });
}

onMounted(() => {
  state.autoRNGSeed = simulation.value.kernel.config?.localStorage.autoRNGSeed;
});
</script>
