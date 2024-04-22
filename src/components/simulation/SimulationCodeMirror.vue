<template>
  <codemirror
    :extensions
    ref="codeMirror"
    style="font-size: 0.75rem; width: 100%"
    v-if="simulation"
    v-model="simulation.code.script"
  />
</template>

<script lang="ts" setup>
import { Compartment } from "@codemirror/state";
import { autocompletion } from "@codemirror/autocomplete";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { python } from "@codemirror/lang-python";

let language = new Compartment();

import { TSimulation } from "@/types/simulationTypes";
import { darkMode } from "@/helpers/common/theme";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

defineProps<{ simulation: TSimulation }>();

const extensions = [
  basicSetup,
  language.of(python()),
  autocompletion({ override: appStore.currentSimulator.autocomplete }),
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
