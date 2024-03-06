<template>
  <ProjectNav :projectDBStore />

  <ProjectBar :projectStore color="blue" />

  <ProjectController :projectStore>
    <template #simulationKernel>
      <SimulationKernelEditor
        :simulation="(projectStore.project.simulation as NESTSimulation)"
      />
    </template>

    <template #nodes>
      <div :key="projectStore.project.network.nodes.length">
        <div
          :key="index"
          v-for="(node, index) in projectStore.project.network.nodes.all"
        >
          <NodeEditor
            :node="(node as NESTNode)"
            @mouseenter="node.state.focus()"
            @mouseleave="node.nodes.unfocusNode()"
            v-if="node.state.show"
          />
        </div>
      </div>
    </template>
  </ProjectController>

  <router-view :key="projectStore.state.projectId" name="project" />
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
