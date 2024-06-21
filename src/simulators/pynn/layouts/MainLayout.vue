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
import { usePyNNModelStore } from "../stores/model/modelStore";
import { usePyNNProjectStore } from "../stores/project/projectStore";
import { usePyNNSimulatorStore } from "../stores/backends/pynnSimulatorStore";

const modelStore: TModelStore = usePyNNModelStore();
const projectStore: TProjectStore = usePyNNProjectStore();
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
  // Update and check backends.
  pynnSimulatorStore.update();

  // Initialize model and project stores.
  modelStore.init();
  projectStore.init();
});
</script>
