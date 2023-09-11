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
</script>
