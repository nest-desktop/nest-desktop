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

import { useNorseSimulatorStore } from "../stores/backends/norseSimulatorStore";
const norseSimulatorStore: TBackendStore = useNorseSimulatorStore();

const navItems = [
  {
    icon: "network:network",
    id: "norseProject",
    simulator: "norse",
    title: "Project",
    to: { name: "norseProjectRoot" },
  },
  {
    icon: "norse:logo",
    id: "norseModel",
    simulator: "norse",
    title: "Model",
    to: { name: "norseModelRoot" },
  },
];

onMounted(() => {
  const stores = appStore.currentSimulator.stores;

  // Update and check backend.
  if (norseSimulatorStore.state.response.status != 200) {
    norseSimulatorStore.update();
  }

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();
});
</script>
