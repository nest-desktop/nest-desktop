<template>
  <project-nav :projectDBStore="projectDBStore" />

  <project-bar
    :project="(project as NESTProject)"
    :project-store="projectStore"
    color="blue"
  />

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
import { NESTProject } from "../helpers/project/project";
import { NESTSimulation } from "../helpers/simulation/simulation";

import { useNESTProjectStore } from "../store/project/projectStore";
const projectStore = useNESTProjectStore();

import { useNESTProjectDBStore } from "../store/project/projectDBStore";
const projectDBStore = useNESTProjectDBStore();

const project = computed(() => projectStore.project as NESTProject);
</script>
