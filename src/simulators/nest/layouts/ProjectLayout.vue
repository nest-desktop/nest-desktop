<template>
  <project-nav :projectDBStore="projectDBStore" />

  <project-bar
    :project="(project as NESTProject)"
    :project-store="projectStore"
    color="blue"
  />

  <project-controller :store="projectStore">
    <template #simulationKernel>
      <simulation-kernel-editor
        :simulation="(project.simulation as NESTSimulation)"
      />
    </template>

    <template #nodes>
      <div :key="project.network.nodes.length">
        <div :key="index" v-for="(node, index) in project.network.nodes.all">
          <node-editor
            :node="(node as NESTNode)"
            @mouseenter="node.state.focus()"
            @mouseleave="node.nodes.unfocusNode()"
            v-if="project.network.nodes.showNode(node)"
          />
        </div>
      </div>
    </template>
  </project-controller>

  <router-view :key="projectStore.projectId" name="project" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";

import NodeEditor from "../components/node/NodeEditor.vue";
import SimulationKernelEditor from "../components/simulation/SimulationKernelEditor.vue";
import { NESTProject } from "../helpers/project/project";
import { NESTSimulation } from "../helpers/simulation/simulation";

import { useNESTProjectStore } from "../store/project/projectStore";
const projectStore = useNESTProjectStore();

import { useNESTProjectDBStore } from "../store/project/projectDBStore";
import { NESTNode } from "../helpers/node/node";
const projectDBStore = useNESTProjectDBStore();

const project = computed(() => projectStore.project as NESTProject);
</script>
