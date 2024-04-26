<template>
  <ProjectNav :projectDBStore />

  <ProjectBar :projectStore color="nest-project">
    <template #tabs>
      <v-tab
        :to="{
          name: 'nestNetworkEditor',
          params: { projectId: projectStore.state.projectId },
        }"
        title="Network Editor"
        size="small"
        stacked
        value="edit"
      >
        <v-icon icon="network:network" />
        Editor
      </v-tab>

      <v-tab
        :to="{
          name: 'nestActivityExplorer',
          params: { projectId: projectStore.state.projectId },
        }"
        title="Activity Explorer"
        size="small"
        stacked
        value="explore"
      >
        <v-icon class="mdi-flip-v" icon="mdi:mdi-border-style" />
        Explorer
      </v-tab>

      <v-btn
        :disabled="!project.network.nodes.hasSomeSpatialNodes"
        height="100%"
        rounded="0"
        variant="plain"
        width="32"
        style="min-width: 32px"
      >
        <v-icon icon="mdi:mdi-menu-down" />

        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item
              @click="() => (projectStore.state.tab.activityView = 'abstract')"
            >
              <template #prepend>
                <v-icon class="mdi-flip-v" icon="mdi:mdi-border-style" />
              </template>
              abstract
            </v-list-item>
            <v-list-item
              @click="() => (projectStore.state.tab.activityView = 'spatial')"
              prepend-icon="mdi:mdi-axis-arrow"
            >
              spatial
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <v-divider vertical />

      <v-tab
        :to="{
          name: 'nestLabBook',
          params: { projectId: projectStore.state.projectId },
        }"
        title="Lab Book"
        size="small"
        stacked
        value="lab"
      >
        <v-icon icon="mdi:mdi-book-open-outline" />
        Lab Book
      </v-tab>
    </template>
  </ProjectBar>

  <ProjectController :projectStore>
    <template #activityController>
      <ActivityChartController
        :graph="project.activityGraph.activityChartGraph"
        v-if="projectStore.state.tab.activityView === 'abstract'"
      />
      <ActivityAnimationController
        :graph="project.activityGraph.activityAnimationGraph"
        v-else-if="projectStore.state.tab.activityView === 'spatial'"
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

const project = computed(() => projectStore.state.project as NESTProject);
</script>
