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
    id: "norseProject",
    path: "/norse/project",
    simulator: "norse",
    title: "Project",
  },
];
</script>
