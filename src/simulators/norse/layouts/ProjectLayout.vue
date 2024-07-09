<template>
  <ProjectNav />

  <ProjectBar color="purple" />

  <ProjectController />

  <router-view :key="projectStore.state.projectId" name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNorseProjectStore();
</script>
