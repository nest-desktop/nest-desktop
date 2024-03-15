<template>
  <codemirror
    :extensions
    ref="codeMirror"
    style="font-size: 0.75rem; width: 100%"
    v-model="simulation.code.script"
    v-if="simulation"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { tooltips } from "@codemirror/view";
// import { autocompletion } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

import { TSimulation, TSimulationProps } from "@/types/simulationTypes";
import { darkMode } from "@/helpers/common/theme";

const props = defineProps({
  simulation: TSimulationProps,
});

const simulation = computed(() => props.simulation as TSimulation);

const extensions = [
  tooltips({
    position: "absolute",
  }),
  python(),
];

if (darkMode()) {
  extensions.push(oneDark);
}
</script>

<style lang="scss">
.px-1px {
  padding-left: 1px;
  padding-right: 1px;
}
</style>
