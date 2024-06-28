<template>
  <AppNavigation :nav-items />

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import AppNavigation from "@/components/app/AppNavigation.vue";

import { TBackendStore } from "@/stores/defineBackendStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { useNorseModelStore } from "../stores/model/modelStore";
import { useNorseProjectStore } from "../stores/project/projectStore";
import { useNorseSimulatorStore } from "../stores/backends/norseSimulatorStore";

const modelStore: TModelStore = useNorseModelStore();
const norseSimulatorStore: TBackendStore = useNorseSimulatorStore();
const projectStore: TProjectStore = useNorseProjectStore();

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
  // Update and check backend.
  if (norseSimulatorStore.state.response.status != 200) {
    norseSimulatorStore.update();
  }

  // Initialize model and project stores.
  modelStore.init();
  projectStore.init();
});
</script>
