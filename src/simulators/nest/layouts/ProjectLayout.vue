<template>
  <ProjectNav color="nest-project" />

  <template
    v-if="
      projectStore.state.projectId && projectStore.props.simulator === 'nest'
    "
  >
    <ProjectBar color="nest-project">
      <template #activityExplorer>
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
                @click="
                  () => (projectStore.state.tab.activityView = 'abstract')
                "
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
      </template>

      <template #prependBtn>
        <v-btn
          @click="openNESTModuleDialog()"
          prepend-icon="mdi:mdi-memory"
          text="module"
          title="Generate module"
        />
      </template>
    </ProjectBar>

    <ProjectController>
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
          >
            <template #append>
              <v-btn
                :disabled="model.length === 0"
                @click="copyModel(model)"
                text="copy"
              />
            </template>
          </v-select>
        </span>

        <span v-if="[0, 5].includes(project.network.state.elementTypeIdx)">
          <CopyModelEditor
            :key="index"
            :model="model"
            v-for="(model, index) of project.network.modelsCopied.all"
          />
        </span>
      </template>

      <template #nodes>
        <div :key="project.network.nodes.length">
          <div :key="index" v-for="(node, index) in project.network.nodes.all">
            <NodeEditor :node="node" v-if="node.isNode">
              <template #nodeMenu>
                <NodeMenu :node />
              </template>

              <template #nodeModelSelect="{ selectState }">
                <NodeModelSelect
                  :node
                  @openMenu="() => (selectState.menu = true)"
                />
              </template>

              <template #popItem>
                <v-list-item class="param pl-0 pr-1">
                  <NodePositionPopover
                    :nodeSpatial="node.spatial"
                    v-if="node.spatial.hasPositions"
                  />

                  <ValueSlider
                    :thumb-color="node.view.color"
                    @update:model-value="node.changes()"
                    id="n"
                    input-label="n"
                    label="population size"
                    v-else
                    v-model="node.size"
                  />

                  <template #append>
                    <Menu :items="getPopItems(node)" size="x-small" />
                  </template>
                </v-list-item>
              </template>

              <template #connectionEditor>
                <ConnectionEditor
                  :connection
                  :key="index"
                  v-for="(connection, index) in node.connections"
                >
                  <template #panelTitle>
                    <div
                      class="d-flex flex-column justify-center align-center text-grey"
                    >
                      {{ connection.rule.value }}
                      <div v-if="connection.view.connectOnlyNeurons()">
                        {{ connection.synapse.modelId }}
                      </div>
                    </div>
                  </template>

                  <template #synapseSpecEditor>
                    <SynapseSpecEditor :synapse="connection.synapse" />
                  </template>
                </ConnectionEditor>
              </template>
            </NodeEditor>

            <NodeGroup :nodeGroup="node" v-else-if="node.isGroup" />
          </div>
        </div>
      </template>

      <template #simulationKernel>
        <SimulationKernelEditor :simulation="project.simulation" />
      </template>
    </ProjectController>

    <router-view :key="projectStore.state.projectId" name="project" />
  </template>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import ActivityChartController from "@/components/activityChart/ActivityChartController.vue";
import ConnectionEditor from "@/components/connection/ConnectionEditor.vue";
import Menu from "@/components/common/Menu.vue";
import NodeEditor from "@/components/node/NodeEditor.vue";
import NodeGroup from "@/components/node/NodeGroup.vue";
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import ActivityAnimationController from "../components/activityAnimation/ActivityAnimationController.vue";
import ActivityAnimationControllerLayer from "../components/activityAnimation/ActivityAnimationControllerLayer.vue";
import CopyModelEditor from "../components/model/CopyModelEditor.vue";
import NodeMenu from "../components/node/NodeMenu.vue";
import NodeModelSelect from "../components/node/NodeModelSelect.vue";
import NodePositionPopover from "../components/node/NodePositionPopover.vue";
import SimulationKernelEditor from "../components/simulation/SimulationKernelEditor.vue";
import SynapseSpecEditor from "../components/synapse/SynapseSpecEditor.vue";
import { NESTNode } from "../helpers/node/node";
import { openNESTModuleDialog } from "../stores/moduleStore";

import { copyModel, useNESTProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNESTProjectStore();

const project = computed(() => projectStore.state.project);

const model = ref("");

const getPopItems = (node: NESTNode) => [
  {
    icon: {
      icon: "mdi:mdi-reload",
      class: "mdi-flip-h",
    },
    onClick: () => (node.size = 1),
    title: "Set default size",
  },
  {
    onClick: () => node.toggleSpatial(),
    prependIcon: "mdi:mdi-axis-arrow",
    title: "Toggle spatial mode",
  },
];
</script>
