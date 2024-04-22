<template>
  <v-btn-group density="compact" divided theme="dark" variant="outlined">
    <v-btn
      :disabled="disabled"
      :loading="loading"
      @click="projectStore?.startSimulation()"
      class="border-white"
      prepend-icon="mdi:mdi-play"
      title="Simulate"
      v-if="simulation"
    >
      <span v-if="simulation.code.runSimulation">Simulate</span>
      <span v-else>Prepare</span>
    </v-btn>

    <!-- <v-btn class="border-white pa-2" style="min-width: 0">
      <v-icon icon="mdi:mdi-menu-down" />

      <v-menu
        :close-on-content-click="false"
        activator="parent"
        theme="primary"
      >
        <v-list density="compact">
          <v-list-item :key="index" v-for="(itemKey, index) in itemKeys">
            <v-checkbox-btn
              :label="state[itemKey].title"
              v-model="state[itemKey].value"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn> -->
  </v-btn-group>
</template>

<script lang="ts" setup>
import { Store } from "pinia";
import { computed } from "vue";

import { TSimulation } from "@/types/simulationTypes";
// import { useProjectViewStore } from "@/stores/project/projectViewStore";

const props = defineProps<{
  disabled?: boolean;
  projectStore: Store<any, any>;
  simulation: TSimulation;
}>();

const simulation = computed(() => props.simulation);
const disabled = computed(
  () => props.disabled || simulation.value.state.running || false
);
const loading = computed(() => simulation.value.state.running);
const projectStore = computed(() => props.projectStore);

// const itemKeys = [
//   "simulateAfterChange",
//   "simulateAfterCheckout",
//   "simulateAfterLoad",
// ];

// const projectViewStore = useProjectViewStore();
// const state = projectViewStore.state;
</script>

<style lang="scss">
.border-white {
  border-color: white !important;
  border-inline-end-color: white !important;
}
</style>
