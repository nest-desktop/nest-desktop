<template>
  <project-nav :projectDBStore="projectDBStore" />

  <project-bar :project="(projectStore.project as PyNNProject)" color="green" />

  <project-controller :store="projectStore" />

  <router-view :key="projectStore.state.projectId" name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { PyNNProject } from "../helpers/project/project";

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore = usePyNNProjectStore();

import { usePyNNProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = usePyNNProjectDBStore();
</script>
