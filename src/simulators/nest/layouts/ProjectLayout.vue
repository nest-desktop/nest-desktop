<template>
  <ProjectNav :project-d-b-store />

  <ProjectBar
    :project-store
    color="nest-project"
  />

  <ProjectController :project-store>
    <template #simulationKernel>
      <SimulationKernelEditor
        :simulation="(projectStore.project.simulation as NESTSimulation)"
      />
    </template>

    <template #nodes>
      <div :key="projectStore.project.network.nodes.length">
        <div
          v-for="(node, index) in projectStore.project.network.nodes.all"
          :key="index"
        >
          <NodeEditor
            v-if="node.state.show"
            :node="(node as NESTNode)"
            @mouseenter="node.state.focus()"
            @mouseleave="node.nodes.unfocusNode()"
          />
        </div>
      </div>
    </template>
  </ProjectController>

  <router-view
    :key="projectStore.state.projectId"
    name="project"
  />
</template>

<script lang="ts" setup>
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";

import NodeEditor from "../components/node/NodeEditor.vue";
import SimulationKernelEditor from "../components/simulation/SimulationKernelEditor.vue";
import { NESTNode } from "../helpers/node/node";
import { NESTSimulation } from "../helpers/simulation/simulation";

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore = useNESTProjectStore();

import { useNESTProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = useNESTProjectDBStore();
</script>
