<template>
  <project-nav :projectDBStore="projectDBStore" />

  <project-bar
    :project="(project as NorseProject)"
    :project-store="projectStore"
    color="purple"
  />

  <project-controller :store="projectStore" />

  <router-view :key="projectStore.projectId" name="project" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { NorseProject } from "../helpers/project/project";

import { useNorseProjectStore } from "../store/project/projectStore";
const projectStore = useNorseProjectStore();

import { useNorseProjectDBStore } from "../store/project/projectDBStore";
const projectDBStore = useNorseProjectDBStore();

const project = computed(() => projectStore.project as NorseProject);
</script>
