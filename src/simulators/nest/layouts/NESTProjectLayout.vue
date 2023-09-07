<template>
  <project-nav :store="projectDBStore" />

  <project-bar :project="(project as NESTProject)" color="blue" />

  <project-controller :store="projectStore">
    <template #networkParamEditor>
      <network-param-editor />
    </template>

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

import NetworkParamEditor from "@nest/components/network/NetworkParamEditor.vue";
import SimulationKernelEditor from "@nest/components/simulation/SimulationKernelEditor.vue";
import { NESTProject } from "@nest/helpers/project/nestProject";
import { NESTSimulation } from "@nest/helpers/simulation/nestSimulation";

import { useNESTProjectStore } from "@nest/store/project/nestProjectStore";
const projectStore = useNESTProjectStore();

import { useNESTProjectDBStore } from "@nest/store/project/nestProjectDBStore";
const projectDBStore = useNESTProjectDBStore();

const project = computed(() => projectStore.project);
</script>
