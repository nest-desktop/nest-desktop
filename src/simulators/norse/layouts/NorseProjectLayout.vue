<template>
  <project-nav :store="projectDBStore" />

  <project-bar :project="(project as NorseProject)" color="purple" />

  <project-controller :store="projectStore">
    <template #networkParamEditor>
      <network-param-editor />
    </template>

    <template #simulationKernelEditor>
      <simulation-kernel-editor
        :simulation="(project.simulation as NorseSimulation)"
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

import NetworkParamEditor from "@norse/components/network/NetworkParamEditor.vue";
import SimulationKernelEditor from "@norse/components/simulation/SimulationKernelEditor.vue";
import { NorseProject } from "@norse/helpers/project/norseProject";
import { NorseSimulation } from "@norse/helpers/simulation/norseSimulation";

import { useNorseProjectStore } from "@norse/store/project/norseProjectStore";
const projectStore = useNorseProjectStore();

import { useNorseProjectDBStore } from "@norse/store/project/norseProjectDBStore";
const projectDBStore = useNorseProjectDBStore();

const project = computed(() => projectStore.project as NorseProject);
</script>
