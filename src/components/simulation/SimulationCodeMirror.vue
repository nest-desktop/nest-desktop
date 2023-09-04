<template>
  <codemirror
    :extensions="extensions"
    ref="codeMirror"
    style="font-size: 0.75rem; width: 100%"
    v-model="simulation.code.script"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { tooltips } from "@codemirror/view";
// import { autocompletion } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
// import { oneDark } from "@codemirror/theme-one-dark";

import { SimulationPropTypes } from "@/types/simulationTypes";
import { BaseSimulation } from "@/helpers/simulation/baseSimulation";

const props = defineProps({
  simulation: SimulationPropTypes,
});

const simulation = computed(() => props.simulation as BaseSimulation);

const extensions = [
  tooltips({
    position: "absolute",
  }),
  python(),
  // oneDark,
];
</script>

<style lang="scss">
.px-1px {
  padding-left: 1px;
  padding-right: 1px;
}
</style>
