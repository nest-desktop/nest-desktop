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
import { computed, nextTick, reactive, ref, watch } from "vue";

import { TSimulation } from "@/types";
import { codemirrorExtensions } from "@/plugins/codemirror";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{ simulation: TSimulation }>();
const simulation = computed(() => props.simulation);

const view = ref();
const state = reactive({
  cursor: { from: 0 },
  focused: false,
});

const extensions = codemirrorExtensions(
  appStore.currentSimulator.completionSources
);

const handleReady = (payload: any) => {
  view.value = payload.view;
};

const updateView = (event: any) => {
  state.cursor = event.state.selection.ranges[0];
};

watch(
  () => props.simulation.code.script,
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
</script>

<style lang="scss">
.px-1px {
  padding-left: 1px;
  padding-right: 1px;
}
</style>
