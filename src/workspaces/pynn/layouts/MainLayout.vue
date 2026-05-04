<template>
  <AppNavigation :nav-items />

  <v-main v-if="appStore.state.currentWorkspace === 'pynn'">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { AppNavigation } from "@/nav/components";
import { TStore } from "@/types";
import { getCurrentWorkspace, useAppStore } from "@/app";

const appStore = useAppStore();

import { usePyNNSimulatorStore } from "../backends/pynnSimulator";
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
  {
    icon: "mdi:mdi-sitemap-outline",
    id: "pynnCode",
    workspace: "pynn",
    title: "Code",
    to: { name: "pynnCodeGraphLayout" },
  },
];

onMounted(() => {
  const currentWorkspace = getCurrentWorkspace();
  if (!currentWorkspace) return;
  const stores = currentWorkspace.stores;

  // Update and check backend.
  if (pynnSimulatorStore.state.response.status != 200) {
    pynnSimulatorStore.update();
  }

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();
});
</script>
