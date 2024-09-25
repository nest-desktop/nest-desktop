<template>
  <codemirror
    :extensions
    @blur="() => (state.focused = false)"
    @focus="() => (state.focused = true)"
    @ready="handleReady"
    @update="updateView($event)"
    style="font-size: 0.75rem; width: 100%"
    v-model="simulation.code.script"
  />
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, shallowRef, watch } from "vue";

import { TSimulation } from "@/types";
import {
  autocompletion,
  basicSetup,
  languagePython,
  oneDark,
} from "@/plugins/codemirror";
import { darkMode } from "@/helpers/common/theme";

import { Extension } from "@codemirror/state";
import { simulationCodeError } from "@/plugins/codemirror";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{ simulation: TSimulation }>();
const simulation = computed(() => props.simulation);

const view = shallowRef();
const state = reactive({
  cursor: { from: 0 },
  focused: false,
});

const extensions: Extension[] = [
  basicSetup,
  languagePython(),
  autocompletion({ override: appStore.currentSimulator.completionSources }),
  simulationCodeError(simulation.value.state),
];

if (darkMode()) {
  extensions.push(oneDark);
}

const handleReady = (payload: any) => {
  view.value = payload.view;
};

const updateView = (event: any) => {
  state.cursor = event.state.selection.ranges[0];
};

watch(
  () => simulation.value.code.script,
  () => {
    if (!state.focused && state.cursor.from > 0) {
      nextTick(() => {
        view.value.dispatch({
          selection: state.cursor,
        });
      });
    }
  }
);

watch(
  () => simulation.value.state.error,
  () => view.value.dispatch()
);
</script>

<style lang="scss">
.px-1px {
  padding-left: 1px;
  padding-right: 1px;
}

.cm-errorLine {
  background-color: rgba(
    var(--v-theme-red),
    var(--v-disabled-opacity)
  ) !important;
}

.cm-panels-bottom {
  padding: 4px;
}
</style>
