<template>
  <v-app v-if="norseSessionStore.loading">
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

import { useNorseModelStore } from "../stores/model/modelStore";
import { useNorseProjectStore } from "../stores/project/projectStore";
import { useNorseSessionStore } from "../stores/sessionStore";

const modelStore = useNorseModelStore();
const norseSessionStore = useNorseSessionStore();
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
  // Initialize model and project stores.
  modelStore.init();
  projectStore.init();

  // Loading off.
  norseSessionStore.loading = false;
});
</script>
