<template>
  <AppNavigation :navItems />

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import AppNavigation from "@/components/app/AppNavigation.vue";
import { TBackendStore } from "@/stores/defineBackendStore";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { usePyNNSimulatorStore } from "../stores/backends/pynnSimulatorStore";
const pynnSimulatorStore: TBackendStore = usePyNNSimulatorStore();

const navItems = [
  {
    icon: "network:network",
    id: "pynnProject",
    simulator: "pynn",
    title: "Project",
    to: { name: "pynnProjectRoot" },
  },
  {
    icon: "pynn:logo",
    id: "pynnModel",
    simulator: "pynn",
    title: "Model",
    to: { name: "pynnModelRoot" },
  },
];

onMounted(() => {
  const stores = appStore.currentSimulator.stores;

  // Update and check backend.
  if (pynnSimulatorStore.state.response.status != 200) {
    pynnSimulatorStore.update();
  }

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();
});
</script>
