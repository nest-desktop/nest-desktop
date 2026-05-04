<template>
  <v-btn-group v-if="simulation" class="mx-2" density="compact" divided theme="dark" style="overflow-x: hidden">
    <v-btn :disabled :loading class="border-white" prepend-icon="mdi:mdi-play" title="Simulate" @click="simulate()">
      Simulate
    </v-btn>

    <v-btn :disabled class="border-white pa-2" style="min-width: 0">
      <v-icon icon="mdi:mdi-menu-down" />

      <v-menu :close-on-content-click="false" activator="parent" theme="primary">
        <v-list density="compact">
          <v-list-item v-for="(menuItem, index) in menuItems" :key="index">
            <!-- @vue-ignore Element implicitly has an 'any' type because expression of type 'string' can't be used to
                             index type '{ onCheckout: boolean; onLoad: boolean; onChange: boolean; }'.
                             No index signature with a parameter of type 'string' was found on type '{ onCheckout:
                             boolean; onLoad: boolean; onChange: boolean; }' -->
            <v-checkbox
              v-model="projectViewStore.state.simulationEvents[menuItem.value]"
              :label="menuItem.label"
              density="compact"
              hide-details
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-btn-group>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { TSimulation } from "@/types";

import { getCurrentViewStore } from "@/app";
const projectViewStore = getCurrentViewStore("project");

const props = defineProps<{
  simulation: TSimulation;
  disabled?: boolean;
}>();

const emit = defineEmits(["click:simulate"]);

const simulation = computed(() => props.simulation);
const disabled = computed(
  () =>
    ((props.disabled ||
      simulation.value.project.code.script.length === 0 ||
      simulation.value.state.running) as boolean) || false,
);
const loading = computed(() => simulation.value.state.running as boolean);

const menuItems = [
  { label: "simulate on change", value: "onChange" },
  { label: "simulate on checkout", value: "onCheckout" },
  { label: "simulate on load", value: "onLoad" },
];

const simulate = () => {
  if (!loading.value) {
    emit("click:simulate");
  }
};
</script>

<style lang="scss">
.border-white {
  border-color: white !important;
  border-inline-end-color: white !important;
}
</style>
