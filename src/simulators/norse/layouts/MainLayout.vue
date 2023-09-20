<template>
  <v-app v-if="norseSessionStore.loading">
    <v-progress-circular class="ma-auto" indeterminate color="primary" />
  </v-app>

  <template v-else>
    <app-navigation :nav-items="navItems" />

    <v-main>
      <router-view />
    </v-main>
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import AppNavigation from "@/components/app/AppNavigation.vue";

import { useNorseSessionStore } from "../store/sessionStore";
import { useNorseModelStore } from "../store/model/modelStore";
import { useNorseProjectStore } from "../store/project/projectStore";

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
  modelStore.init();
  projectStore.init();
  norseSessionStore.loading = false;
});
</script>
