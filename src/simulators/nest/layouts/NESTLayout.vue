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
    path: "/nest/project",
    simulator: "nest",
    title: "Project",
  },
  {
    icon: "nest:logo",
    id: "nestModel",
    path: "/nest/model",
    simulator: "nest",
    title: "Model",
  },
];
</script>
