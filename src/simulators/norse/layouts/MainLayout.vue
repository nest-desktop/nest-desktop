<template>
  <AppNavigation :nav-items />

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import AppNavigation from "@/components/app/AppNavigation.vue";

import { useNorseModelStore } from "../stores/model/modelStore";
import { useNorseProjectStore } from "../stores/project/projectStore";
import { useNorseSimulatorStore } from "../stores/backends/norseSimulatorStore";

const modelStore = useNorseModelStore();
const norseSimulatorStore = useNorseSimulatorStore();
const projectStore = useNorseProjectStore();

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
  // Update and check backends.
  norseSimulatorStore.update();

  // Initialize model and project stores.
  modelStore.init();
  projectStore.init();
});
</script>
