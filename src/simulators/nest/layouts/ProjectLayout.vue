<template>
  <ProjectNav :projectDBStore />

  <ProjectBar :projectStore color="nest-project" />

  <ProjectController :projectStore>
    <template #activityController>
      <ActivityChartController
        :graph="project.activityGraph.activityChartGraph"
      />
      <ActivityAnimationController
        :graph="project.activityGraph.activityAnimationGraph"
      />
    </template>

    <template #simulationKernel>
      <SimulationKernelEditor :simulation="project.simulation" />
    </template>

    <template #nodes>
      <div :key="project.network.nodes.length">
        <div :key="index" v-for="(node, index) in project.network.nodes.all">
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
import { computed } from "vue";

import ActivityChartController from "@/components/activityChart/ActivityChartController.vue";
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";

import ActivityAnimationController from "../components/activityAnimation/ActivityAnimationController.vue";
import NodeEditor from "../components/node/NodeEditor.vue";
import SimulationKernelEditor from "../components/simulation/SimulationKernelEditor.vue";
import { NESTNode } from "../helpers/node/node";
import { NESTProject } from "../helpers/project/project";

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore = useNESTProjectStore();

import { useNESTProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = useNESTProjectDBStore();

const project = computed(() => projectStore.project as NESTProject);
</script>
