<template>
  <ModelNav />

  <template v-if="modelStore.model">
    <ModelBar color="nest-model">
      <template #modelExplorer>
        <v-tab
          :disabled="!modelStore.model.isNeuron"
          :to="{
            name: 'nestModelExplorer',
            params: { modelId: modelStore.state.modelId },
          }"
          size="small"
          title="Model Explorer"
          value="explore"
        >
          <v-icon icon="mdi:mdi-chart-scatter-plot" />
          <span class="text-no-wrap">Explorer</span>
        </v-tab>

        <v-btn
          :disabled="!modelStore.model.isNeuron"
          height="100%"
          rounded="0"
          style="min-width: 32px"
          variant="plain"
          width="32"
        >
          <v-icon icon="mdi:mdi-menu-down" />

          <v-menu activator="parent">
            <v-list density="compact">
              <v-list-item
                :key="index"
                :prepend-icon="project.icon"
                :title="project.name"
                @click="selectProject(project.id)"
                v-for="(project, index) in projects"
              />
            </v-list>
          </v-menu>
        </v-btn>

        <v-divider vertical />
      </template>

      <template #prependBtn>
        <v-btn
          @click="openNESTModuleDialog()"
          prepend-icon="mdi:mdi-memory"
          text="Module"
          title="Generate module"
          variant="outlined"
        />
      </template>

      <template #prependTabs>
        <v-tab
          :to="{
            name: 'nestModelDoc',
            params: { modelId: modelStore.state.modelId },
          }"
          size="small"
          title="Read documentation"
        >
          <v-icon icon="mdi:mdi-text-box-outline" />
          <span class="text-no-wrap">Doc</span>
        </v-tab>
      </template>
    </ModelBar>

    <ModelController />

    <router-view :key="modelStore.state.modelId" name="model" />
  </template>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { TModelStore } from "@/stores/model/defineModelStore";
import { loadJSON } from "@/utils/fetch";

import { INESTProjectProps, NESTProject } from "../helpers/project/project";
import { NESTNode } from "../helpers/node/node";
import { openNESTModuleDialog } from "../stores/moduleStore";

import {
  updateSimulationModules,
  useNESTModelStore,
} from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

const loadProjectfromAssets = (): void => {
  if (modelStore.state.projectId) {
    loadJSON(
      `assets/simulators/nest/projects/${modelStore.state.projectId}.json`
    ).then((projectProps: INESTProjectProps) => {
      projectProps.filename = modelStore.state.projectId;
      modelStore.model.project = new NESTProject(projectProps);
      update();
    });
  }
};

const selectProject = (projectId: string): void => {
  modelStore.state.projectId = projectId;
  update();
};

const update = () => {
  if (!modelStore.model || !modelStore.model.isNeuron) {
    modelStore.state.project = undefined;
    return;
  }

  if (
    modelStore.model?.project &&
    modelStore.model.project?.filename === modelStore.state.projectId
  ) {
    modelStore.state.project = modelStore.model.project;
    const project = modelStore.state.project;

    if (project) {
      updateSimulationModules();

      project.network.nodes.neurons.forEach((neuron: NESTNode) => {
        neuron.modelId = modelStore.state.modelId;
        neuron.showAllParams();
      });

      project.network.changes();
      project.activityGraph.init();
    }
  } else {
    loadProjectfromAssets();
  }
};

const projects: { id: string; name: string; icon: string }[] = [
  {
    id: "model-step-current-up-down",
    name: "step current (up/down)",
    icon: "mdi-chart-line",
  },
  {
    id: "model-current-steps",
    name: "current steps",
    icon: "mdi-chart-line",
  },
  {
    id: "model-spikes-up-down",
    name: "spikes (up/down)",
    icon: "mdi-chart-line",
  },
  {
    id: "model-regular-spikes-steps",
    name: "regular spikes steps",
    icon: "mdi-chart-line",
  },
  {
    id: "model-poisson-spikes-steps",
    name: "Poisson spikes steps",
    icon: "mdi-chart-line",
  },
  {
    id: "model-f-i-curve",
    name: "F-I curve",
    icon: "mdi-chart-line",
  },
  {
    id: "spike-activity",
    name: "spike activity",
    icon: "mdi-chart-scatter-plot",
  },
];

onMounted(() => {
  selectProject("model-step-current-up-down");
});

watch(() => modelStore.state.modelId, update);
</script>
