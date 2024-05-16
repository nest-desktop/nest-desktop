<template>
  <v-toolbar color="transparent" density="compact">
    <v-btn-toggle class="mx-1" color="blue" multiple rounded="0" variant="text">
      <IconBtn
        :icon="item.icon"
        :key="index"
        :title="item.title"
        size="x-small"
        v-for="(item, index) in codeBlocks"
      />
    </v-btn-toggle>
    <v-spacer />
    <v-btn icon="mdi:mdi-download" size="small" />
    <v-btn icon="mdi:mdi-dots-vertical" size="small" />
  </v-toolbar>

  <v-btn
    :icon="state.disabled ? 'mdi:mdi-pencil-off' : 'mdi:mdi-pencil'"
    @click="state.disabled = !state.disabled"
    class="ma-2"
    size="small"
    style="position: absolute; right: 10px; z-index: 10"
    title="Edit mode"
    variant="outlined"
  />

  <Simulation-code-mirror
    :disabled="state.disabled"
    :simulation="simulation"
    v-if="simulation"
  />
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import IconBtn from "../common/IconBtn.vue";
import SimulationCodeMirror from "./SimulationCodeMirror.vue";
import { TSimulation } from "@/types";

defineProps<{ simulation: TSimulation }>();

const state = reactive({
  disabled: true,
});

const codeBlocks = [
  { icon: "mdi:mdi-delete-empty", title: "reset" },
  // { icon: "mdi:mdi-arrow-down", title: "insite" },
  // { icon: "mdi:mdi-engine-outline", title: "kernel" },
  { icon: "mdi:mdi-shape", title: "create" },
  { icon: "network:network", title: "connect" },
  { icon: "mdi:mdi-play", title: "simulate" },
];
</script>
