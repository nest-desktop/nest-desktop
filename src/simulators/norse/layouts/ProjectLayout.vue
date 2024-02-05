<template>
  <project-nav :projectDBStore="projectDBStore" />

  <project-bar
    :project="(projectStore.project as NorseProject)"
    :project-store="projectStore"
    color="purple"
  />

  <project-controller :store="projectStore" />

  <router-view :key="projectStore.state.projectId" name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { NorseProject } from "../helpers/project/project";

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore = useNorseProjectStore();

import { useNorseProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = useNorseProjectDBStore();
</script>
