<template>
  <AppNavigation :nav-items />

  <v-main v-if="appStore.state.currentWorkspace === 'norse'">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import type { TStore } from "@/types";
import { AppNavigation } from "@/nav/components";
import { getCurrentWorkspace, useAppStore } from "@/app";

const appStore = useAppStore();

import { useNorseSimulatorStore } from "../backends/norseSimulator";
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
  {
    icon: "mdi:mdi-sitemap-outline",
    id: "norseCode",
    workspace: "norse",
    title: "Code",
    to: { name: "norseCodeGraphLayout" },
  },
];

onMounted(() => {
  const currentWorkspace = getCurrentWorkspace();
  if (!currentWorkspace) return;
  const stores = currentWorkspace.stores;

  // Update and check backend.
  if (norseSimulatorStore.state.response.status != 200) {
    norseSimulatorStore.update();
  }

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();
});
</script>
