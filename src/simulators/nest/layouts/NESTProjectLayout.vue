<template>
  <project-nav :store="projectDBStore" />

  <project-bar :project="(project as NESTProject)" color="blue" />

  <project-controller :store="projectStore">
    <template #simulationKernelEditor>
      <simulation-kernel-editor
        :simulation="(project.simulation as NESTSimulation)"
      />
    </template>
  </project-controller>

  <router-view :key="projectStore.projectId" name="project" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";

import SimulationKernelEditor from "../components/simulation/SimulationKernelEditor.vue";
import { NESTProject } from "../helpers/project/nestProject";
import { NESTSimulation } from "../helpers/simulation/nestSimulation";

import { useNESTProjectStore } from "../store/project/nestProjectStore";
const projectStore = useNESTProjectStore();

import { useNESTProjectDBStore } from "../store/project/nestProjectDBStore";
const projectDBStore = useNESTProjectDBStore();

const project = computed(() => projectStore.project);
</script>
