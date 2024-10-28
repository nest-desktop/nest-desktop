<template>
  <v-btn-group
    class="mx-2"
    density="compact"
    divided
    theme="dark"
    v-if="simulation"
  >
    <v-btn
      :disabled
      :loading
      @click="simulate()"
      class="border-white"
      prepend-icon="mdi:mdi-play"
      title="Simulate"
    >
      <span v-if="simulation.code.runSimulation">Simulate</span>
      <span v-else>Prepare</span>
    </v-btn>

    <v-btn :disabled class="border-white pa-2" style="min-width: 0">
      <v-icon icon="mdi:mdi-menu-down" />

      <v-menu
        :close-on-content-click="false"
        activator="parent"
        theme="primary"
      >
        <v-list density="compact">
          <v-list-item :key="index" v-for="(menuItem, index) in menuItems">
            <!-- @vue-ignore Element implicitly has an 'any' type because expression of type 'string' can't be used to
                             index type '{ onCheckout: boolean; onLoad: boolean; onChange: boolean; }'.
                             No index signature with a parameter of type 'string' was found on type '{ onCheckout:
                             boolean; onLoad: boolean; onChange: boolean; }' -->
            <v-checkbox
              :label="menuItem.label"
              density="compact"
              hide-details
              v-model="projectViewStore.state.simulationEvents[menuItem.value]"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-btn-group>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TSimulation } from "@/types";

import { useProjectViewStore } from "@/stores/project/projectViewStore";
const projectViewStore = useProjectViewStore();

const props = defineProps<{
  simulation: TSimulation;
  disabled?: boolean;
}>();

const emit = defineEmits(["click:simulate"]);

const simulation = computed(() => props.simulation);
const disabled = computed(
  () => props.disabled || simulation.value.state.running || false
);
const loading = computed(() => simulation.value.state.running);

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
