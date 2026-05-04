<template>
  <template v-if="project?.viewModel && projectStore.props.workspace === 'nest'">
    <ProjectNav color="nest-project" />

    <ProjectBar color="nest-project">
      <template #graphEditor>
        <v-tab
          :to="{
            name: 'nestGraphEditor',
            params: { projectId: projectStore.state.projectId },
          }"
          class="tab-graph-editor"
          size="small"
          stacked
          title="Graph Editor"
          value="editor"
        >
          <v-icon
            :icon="projectViewStore.state.views.graph == 'network' ? 'graph:network' : 'mdi:mdi-sitemap-outline'"
          />
          Editor
        </v-tab>

        <v-btn height="100%" rounded="0" variant="plain" width="32" style="min-width: 32px">
          <v-icon icon="mdi:mdi-menu-down" />

          <v-menu activator="parent" target=".tab-graph-editor">
            <v-list density="compact">
              <v-list-item
                :active="projectViewStore.state.views.graph == 'code'"
                :to="{
                  name: 'nestGraphEditor',
                  params: { projectId: projectStore.state.projectId },
                  query: { graphView: 'code' },
                }"
                prepend-icon="graph:flowchart"
              >
                code (beta)
              </v-list-item>
              <v-list-item
                :active="projectViewStore.state.views.graph == 'network'"
                :to="{
                  name: 'nestGraphEditor',
                  params: { projectId: projectStore.state.projectId },
                  query: { graphView: 'network' },
                }"
                exact
              >
                <template #prepend>
                  <v-icon icon="graph:network" />
                </template>
                network
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <v-divider vertical />
      </template>

      <template #activityExplorer>
        <v-tab
          :to="{
            name: 'nestActivityExplorer',
            params: { projectId: projectStore.state.projectId },
          }"
          class="tab-activity-explorer"
          size="small"
          stacked
          title="Activity Explorer"
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

          <v-menu activator="parent" target=".tab-activity-explorer">
            <v-list density="compact">
              <v-list-item
                :active="projectViewStore.state.views.activity == 'abstract'"
                :to="{
                  name: 'nestActivityExplorer',
                  params: { projectId: projectStore.state.projectId },
                  query: { activityView: 'abstract' },
                }"
              >
                <template #prepend>
                  <v-icon class="mdi-flip-v" icon="mdi:mdi-border-style" />
                </template>
                abstract
              </v-list-item>
              <v-list-item
                :active="projectViewStore.state.views.activity == 'spatial'"
                :to="{
                  name: 'nestActivityExplorer',
                  params: { projectId: projectStore.state.projectId },
                  query: { activityView: 'spatial' },
                }"
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
          v-if="currentWorkspace?.backends.nestml.state.enabled"
          prepend-icon="mdi:mdi-memory"
          text="module"
          title="Generate module"
          @click="openNESTModuleDialog()"
        />
      </template>
    </ProjectBar>

    <ProjectController :key="project.id">
      <template #activityController>
        <ActivityChartController
          v-if="projectViewStore.state.views.activity === 'abstract'"
          :graph="project.activityGraph.activityChartGraph"
        />
        <template v-else-if="projectViewStore.state.views.activity === 'spatial'">
          <ActivityAnimationController :graph="project.activityGraph.activityAnimationGraph" />

          <v-expansion-panels>
            <ActivityAnimationControllerLayer
              v-for="(layer, index) in project.activityGraph.activityAnimationGraph.layers"
              :key="index"
              :layer
            />
          </v-expansion-panels>
        </template>
      </template>

      <template #model>
        <span v-if="project.network.state.elementTypeIdx === 5">
          <v-select
            v-model="model"
            :items="project.modelDBStore.state.models"
            class="ma-1"
            density="compact"
            flat
            hide-details
            item-title="label"
            item-value="id"
            label="Existing model"
            prepend-icon="mdi:mdi-plus"
          >
            <template #append>
              <v-btn :disabled="model.length === 0" text="copy" @click="doCopyModel(model)" />
            </template>
          </v-select>
        </span>

        <span v-if="[0, 5].includes(project.network.state.elementTypeIdx)">
          <CopyModelEditor
            v-for="(copyModel, modelIdx) of project.network.copyModels.all"
            :key="modelIdx"
            :model="copyModel"
          />
        </span>
      </template>

      <template #nodes>
        <div v-for="(node, index) in project.network.nodes.all" :key="index">
          <NodeEditor v-if="node.isNode" :node>
            <template #nodeMenuContent>
              <NESTNodeMenuList :node />
            </template>

            <template #nodeModelSelect="{ selectState }">
              <NodeModelSelect :element-types :node @open-menu="() => (selectState.menu = true)" />
            </template>

            <template #popItem>
              <v-list-item class="param pl-0 pr-1">
                <NodePosition v-if="node.isSpatial" :node-spatial="node.spatial" />

                <ValueSlider
                  v-else
                  id="n"
                  v-model="node.size"
                  :thumb-color="node.view.color"
                  input-label="n"
                  label="population size"
                />

                <template #append>
                  <Menu :items="getPopItems(node)" size="x-small" />
                </template>
              </v-list-item>
            </template>

            <template #connectionEditor>
              <ConnectionEditor
                v-for="(connection, connectionIdx) in node.connections"
                :key="connectionIdx"
                :connection
              >
                <template #panelTitle>
                  <div class="d-flex flex-column justify-center align-center text-grey">
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

          <NodeGroupEditor v-if="node.isGroup" :node-group="node" />
        </div>
      </template>

      <template #simulationKernel>
        <SimulationKernelEditor :simulation="project.simulation" />
      </template>
    </ProjectController>

    <router-view :key="projectStore.state.projectId" name="project" />

    <BottomNav v-if="project.code" :store="projectViewStore">
      <CodeEditor
        v-model="project.code.script"
        :locked="project.code.lockCode"
        :error="project.simulation.handler.error"
        @update:locked="(v: boolean) => (project.code.lockCode = v)"
      />
    </BottomNav>
  </template>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import { ActivityChartController } from "@/activityGraph/components";
import { BottomNav } from "@/nav/components";
import { CodeEditor } from "@/codeGraph/components";
import { ConnectionEditor, NodeEditor, NodeGroupEditor, NodeModelSelect } from "@/network/components";
import { Menu, ValueSlider } from "@/components";
import { ProjectBar, ProjectController, ProjectNav } from "@/project/components";
import { mountProjectLayout } from "@/project";
import { getCurrentViewStore, getCurrentWorkspace } from "@/app";

import type { NESTNode } from "../types";
import { ActivityAnimationController, ActivityAnimationControllerLayer } from "../activityGraph/components";
import { CopyModelEditor, NESTNodeMenuList, NodePosition, SynapseSpecEditor } from "../network/components";
import { SimulationKernelEditor } from "../simulation/components";
import { openNESTModuleDialog } from "../module";

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

import { doCopyModel, useNESTProjectStore } from "../project/stores/projectStore";
const projectStore = useNESTProjectStore();

const project = computed(() => projectStore.state.project);
const projectViewStore = getCurrentViewStore("project");

const currentWorkspace = getCurrentWorkspace();

const model = ref("");

const elementTypes = [
  { title: "copied model", value: "copied" },
  { title: "neuron", value: "neuron" },
  { title: "recorder", value: "recorder" },
  { title: "stimulator", value: "stimulator" },
];

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
    onClick: () => node.spatial.togglePositions(),
    prependIcon: "mdi:mdi-axis-arrow",
    title: "Toggle spatial mode",
  },
];

onMounted(() => {
  mountProjectLayout({ route, router });
  // if (!project.value || !project.value.viewModel) return;

  if (project.value.viewModel.subscribe) project.value.viewModel.subscribe();
  project.value.viewModel.engine?.start();
  // project.value.viewModel.engine?.runOnce({});
});

onBeforeUnmount(() => {
  // if (!project.value || !project.value.viewModel) return;

  if (project.value.viewModel.unsubscribe) project.value.viewModel.unsubscribe();
  project.value.viewModel.engine?.stop();
});

watch(
  () => project.value,
  (newValue, oldValue) => {
    oldValue.viewModel.unsubscribe();
    oldValue.viewModel.engine?.stop();

    newValue.viewModel.subscribe();
    newValue.viewModel.engine?.start();
    // setTimeout(() => newValue.viewModel.engine?.runOnce({}), 1);
  },
);

watch(
  () => route.query?.graphView,
  (graphView) => {
    if (!["code", "network"].includes(graphView as string)) return;
    projectViewStore.state.views.graph = graphView;
  },
);

watch(
  () => route.query?.activityView,
  (activityView) => {
    if (!["abstract", "spatial"].includes(activityView as string)) return;
    projectViewStore.state.views.activity = activityView;
  },
);
</script>
