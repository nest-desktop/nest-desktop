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
