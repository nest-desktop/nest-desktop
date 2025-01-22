<template>
  <AppNavigation :nav-items />

  <v-main v-if="appStore.state.currentWorkspace === 'pynn'">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import AppNavigation from "@/components/app/AppNavigation.vue";
import { TStore } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { usePyNNSimulatorStore } from "../stores/backends/pynnSimulatorStore";
const pynnSimulatorStore: TStore = usePyNNSimulatorStore();

const navItems = [
  {
    icon: "graph:network",
    id: "pynnProject",
    workspace: "pynn",
    title: "Project",
    to: { name: "pynnProjectRoot" },
  },
  {
    icon: "pynn:logo",
    id: "pynnModel",
    workspace: "pynn",
    title: "Model",
    to: { name: "pynnModelRoot" },
  },
];

onMounted(() => {
  const stores = appStore.currentWorkspace.stores;

  // Update and check backend.
  if (pynnSimulatorStore.state.response.status != 200) {
    pynnSimulatorStore.update();
  }

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();
});
</script>
