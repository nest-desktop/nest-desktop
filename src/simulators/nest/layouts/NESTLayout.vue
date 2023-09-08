<template>
  <app-navigation :nav-items="navItems" />

  <v-main>
    <v-app v-if="nestSessionStore.loading">
      <v-progress-circular class="ma-auto" indeterminate color="primary" />
    </v-app>
    <router-view v-else />
  </v-main>
</template>

<script lang="ts" setup>
import AppNavigation from "@/components/app/AppNavigation.vue";

import { useNESTSessionStore } from "@nest/store/nestSessionStore";
const nestSessionStore = useNESTSessionStore();

const navItems = [
  {
    icon: "nest:network",
    id: "nestProject",
    simulator: "nest",
    title: "Project",
    to: { name: "nestProjectRoot" },
  },
  {
    icon: "nest:logo",
    id: "nestModel",
    simulator: "nest",
    title: "Model",
    to: { name: "nestModelRoot" },
  },
];
</script>
