<template>
  <AppNavigation :nav-items />

  <v-main v-if="appStore.state.currentWorkspace === 'elephant'">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import AppNavigation from "@/components/app/AppNavigation.vue";
import { TStore } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useElephantServerStore } from "../stores/backends/elephantServerStore";
const elephantServerStore: TStore = useElephantServerStore();

const navItems = [
  {
    icon: "mdi:mdi-chart-scatter-plot",
    id: "elephantProject",
    workspace: "elephant",
    title: "Project",
    to: { name: "elephantProjectRoot" },
  },
  {
    icon: "elephant:logo",
    id: "elephantModel",
    workspace: "elephant",
    title: "Model",
    to: { name: "elephantModelRoot" },
  },
];

onMounted(() => {
  const stores = appStore.currentWorkspace.stores;

  // Update and check backend.
  if (elephantServerStore.state.response.status != 200) elephantServerStore.update();

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();
});
</script>
