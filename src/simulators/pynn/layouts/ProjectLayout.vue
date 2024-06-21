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
import { TBackendStore } from "@/stores/defineBackendStore";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { usePyNNModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore: TModelDBStore = usePyNNModelDBStore();

import { usePyNNProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore: TBackendStore = usePyNNProjectDBStore();

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = usePyNNProjectStore();
</script>
