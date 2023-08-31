<template>
  <v-toolbar color="transparent" density="compact">
    <v-btn-toggle class="mx-1" color="blue" multiple rounded="0" variant="text">
      <icon-btn
        :icon="item.icon"
        :key="index"
        size="x-small"
        v-for="(item, index) in codeBlocks"
      >
        {{ item.title }}
      </icon-btn>
    </v-btn-toggle>
    <v-spacer />
    <v-btn icon="mdi-download" size="small" />
    <v-btn icon="mdi-dots-vertical" size="small" />
  </v-toolbar>

  <Simulation-code-mirror :simulation="(simulation as Simulation)" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import IconBtn from "@/components/common/IconBtn.vue";
import { Simulation, SimulationPropTypes } from "@/types/simulationTypes";

import SimulationCodeMirror from "./SimulationCodeMirror.vue";

const props = defineProps({
  simulation: SimulationPropTypes,
});

const simulation = computed(() => props.simulation as Simulation);

const codeBlocks = [
  { icon: "mdi-delete-empty", title: "reset" },
  { icon: "mdi-arrow-down", title: "insite" },
  { icon: "mdi-engine-outline", title: "kernel" },
  { icon: "mdi-shape", title: "create" },
  { icon: "nest:network", title: "connect" },
  { icon: "mdi-play", title: "simulate" },
];
</script>
