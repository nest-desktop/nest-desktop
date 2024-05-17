<template>
  <ProjectNav :projectDBStore />

  <ProjectBar :project-store color="purple" />

  <ProjectController :projectStore />

  <router-view :key="projectStore.state.projectId" name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore = useNorseProjectStore();

import { useNorseProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = useNorseProjectDBStore();
</script>
