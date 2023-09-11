<template>
  <project-nav :store="projectDBStore" />

  <project-bar :project="(project as PyNNProject)" color="green" />

  <project-controller :store="projectStore" />

  <router-view :key="projectStore.projectId" name="project" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { PyNNProject } from "../helpers/project/project";

import { usePyNNProjectStore } from "../store/project/projectStore";
const projectStore = usePyNNProjectStore();

import { usePyNNProjectDBStore } from "../store/project/projectDBStore";
const projectDBStore = usePyNNProjectDBStore();

const project = computed(() => projectStore.project as PyNNProject);
</script>
