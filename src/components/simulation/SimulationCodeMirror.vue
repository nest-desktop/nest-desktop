<template>
  <codemirror
    :extensions
    @blur="updateView($event)"
    @focus="updateView($event)"
    @ready="handleReady"
    style="font-size: 0.75rem; width: 100%"
    v-model="simulation.code.script"
  />
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";

import { TSimulation } from "@/types";
import { codemirrorExtensions } from "@/plugins/codemirror";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{ simulation: TSimulation }>();
const simulation = computed(() => props.simulation);

const view = ref();
const cursor = ref({ from: 0 });

const extensions = codemirrorExtensions(
  appStore.currentSimulator.completionSources
);

const handleReady = (payload: any) => {
  view.value = payload.view;
};

const updateView = (event: any) => {
  cursor.value = event.state.selection.ranges[0];
};

watch(
  () => props.simulation.code.script,
  () => {
    nextTick(() => {
      view.value.dispatch({
        selection: cursor.value,
      });
    });
  }
);
</script>

<style lang="scss">
.px-1px {
  padding-left: 1px;
  padding-right: 1px;
}
</style>
