<template>
  <AppNavigation :nav-items />

  <v-main v-if="appStore.state.currentWorkspace === 'norse'">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import AppNavigation from "@/components/app/AppNavigation.vue";
import { TStore } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNorseSimulatorStore } from "../stores/backends/norseSimulatorStore";
const norseSimulatorStore: TStore = useNorseSimulatorStore();

const navItems = [
  {
    icon: "graph:network",
    id: "norseProject",
    workspace: "norse",
    title: "Project",
    to: { name: "norseProjectRoot" },
  },
  {
    icon: "norse:logo",
    id: "norseModel",
    workspace: "norse",
    title: "Model",
    to: { name: "norseModelRoot" },
  },
];

onMounted(() => {
  const stores = appStore.currentWorkspace.stores;

  // Update and check backend.
  if (norseSimulatorStore.state.response.status != 200) {
    norseSimulatorStore.update();
  }

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();
});
</script>
