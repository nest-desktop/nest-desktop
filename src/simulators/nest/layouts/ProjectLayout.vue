<template>
  <ProjectNav :modelDBStore :projectDBStore />

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
      <template v-else-if="projectStore.state.tab.activityView === 'spatial'">
        <ActivityAnimationController
          :graph="project.activityGraph.activityAnimationGraph"
        />

        <v-expansion-panels>
          <ActivityAnimationControllerLayer
            :key="index"
            :layer
            v-for="(layer, index) in project.activityGraph
              .activityAnimationGraph.layers"
          />
        </v-expansion-panels>
      </template>
    </template>

    <template #model>
      <span v-if="project.network.state.elementTypeIdx === 5">
        <v-select
          :items="project.modelDBStore.state.models"
          class="ma-1"
          density="compact"
          flat
          hide-details
          item-title="label"
          item-value="id"
          label="Existing model"
          prepend-icon="mdi:mdi-plus"
          v-model="model"
          variant="outlined"
        >
          <template #append>
            <v-btn
              :disabled="model.length === 0"
              @click="copyModel()"
              text="copy"
              variant="outlined"
            />
          </template>
        </v-select>
      </span>

      <span v-if="[0, 5].includes(project.network.state.elementTypeIdx)">
        <CopyModelEditor
          :key="index"
          :model="(model as NESTCopyModel)"
          v-for="(model, index) of project.network.modelsCopied.all"
        />
      </span>
    </template>

    <template #nodes>
      <div :key="project.network.nodes.length">
        <div :key="index" v-for="(node, index) in project.network.nodes.all">
          <NodeEditor :node="(node as NESTNode)" v-if="node.isNode" />
          <NodeGroup
            :nodeGroup="(node as TNodeGroup)"
            v-else-if="node.isGroup"
          />
        </div>
      </div>
    </template>

    <template #simulationKernel>
      <SimulationKernelEditor :simulation="project.simulation" />
    </template>
  </ProjectController>

  <router-view :key="projectStore.state.projectId" name="project" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import ActivityChartController from "@/components/activityChart/ActivityChartController.vue";
import NodeGroup from "@/components/node/NodeGroup.vue";
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { NodeGroup as TNodeGroup } from "@/helpers/node/nodeGroup";

import ActivityAnimationController from "../components/activityAnimation/ActivityAnimationController.vue";
import ActivityAnimationControllerLayer from "../components/activityAnimation/ActivityAnimationControllerLayer.vue";
import CopyModelEditor from "../components/model/CopyModelEditor.vue";
import NodeEditor from "../components/node/NodeEditor.vue";
import SimulationKernelEditor from "../components/simulation/SimulationKernelEditor.vue";
import { NESTCopyModel } from "../helpers/model/copyModel";
import { NESTNode } from "../helpers/node/node";
import { NESTProject } from "../helpers/project/project";

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore = useNESTModelDBStore();

import { useNESTProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = useNESTProjectDBStore();

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore = useNESTProjectStore();

const project = computed(() => projectStore.state.project as NESTProject);

const model = ref("");

/**
 * Copy model.
 */
const copyModel = () => {
  project.value.network.modelsCopied.copy(model.value);
  project.value.network.changes();
};
</script>
