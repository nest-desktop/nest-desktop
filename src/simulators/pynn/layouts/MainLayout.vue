<template>
  <app-navigation :nav-items="navItems" />

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import AppNavigation from "@/components/app/AppNavigation.vue";

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
</script>
