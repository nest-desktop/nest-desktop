<template>
  <v-app v-if="pynnSessionStore.loading">
    <v-container class="fill-height">
      <v-progress-circular
        class="ma-auto"
        color="primary"
        indeterminate
      />
    </v-container>

    <app-footer />
  </v-app>

  <template v-else>
    <app-navigation :nav-items />

    <v-main>
      <router-view />
    </v-main>
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import AppFooter from "@/components/app/AppFooter.vue";
import AppNavigation from "@/components/app/AppNavigation.vue";

import { usePyNNModelStore } from "../stores/model/modelStore";
import { usePyNNProjectStore } from "../stores/project/projectStore";
import { usePyNNSessionStore } from "../stores/sessionStore";

const modelStore = usePyNNModelStore();
const projectStore = usePyNNProjectStore();
const pynnSessionStore = usePyNNSessionStore();

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
  // Initialize model and project stores.
  modelStore.init();
  projectStore.init();

  // Loading off.
  pynnSessionStore.loading = false;
});
</script>
