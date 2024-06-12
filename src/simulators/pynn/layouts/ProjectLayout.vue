<template>
  <ProjectNav :modelDBStore :projectDBStore />

  <ProjectBar :project-store color="green" />

  <ProjectController :projectStore />

  <router-view :key="projectStore.state.projectId" name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";

import { usePyNNModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore = usePyNNModelDBStore();

import { usePyNNProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = usePyNNProjectDBStore();

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore = usePyNNProjectStore();
</script>
