<template>
  <ModelNav color="nest-model">
    <template #newModel>
      <v-fab
        @click="dialogNewModel()"
        class="ms-4"
        color="primary"
        icon="mdi:mdi-plus"
        location="bottom left"
        size="40"
        absolute
        offset
        title="Create a new model"
        v-show="appStore.currentSimulator.backends.nestml.state.enabled"
      />
    </template>
  </ModelNav>

  <template
    v-if="modelStore.model && modelStore.model.id === modelStore.state.modelId"
  >
    <ModelBar color="nest-model">
      <template #modelExplorer>
        <v-tab
          :disabled="!modelStore.model.isNeuron"
          :to="{
            name: 'nestModelExplorer',
            params: { modelId: modelStore.state.modelId },
          }"
          class="tab-model-explorer"
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

          <v-menu activator="parent" target=".tab-model-explorer">
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
          text="module"
          title="Generate module"
          v-if="appStore.currentSimulator.backends.nestml.state.enabled"
        />
      </template>

      <v-btn
        @click="openNESTModuleDialog()"
        prepend-icon="mdi:mdi-memory"
        text="module"
        title="Generate module"
      />

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
import { computed, nextTick, onMounted, watch } from "vue";
import { createDialog } from "vuetify3-dialog";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { TModelStore } from "@/stores/model/defineModelStore";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { mountModelLayout } from "@/helpers/routes";

import NewModelDialog from "../components/dialog/NewModelDialog.vue";
import { INESTProjectProps, NESTProject } from "../helpers/project/project";
import { NESTModel } from "../helpers/model/model";
import { NESTNode } from "../helpers/node/node";
import { openNESTModuleDialog } from "../stores/moduleStore";

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import {
  updateSimulationModules,
  useNESTModelStore,
} from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

import { useNESTModuleStore } from "../stores/moduleStore";
const moduleStore = useNESTModuleStore();

const modelDBStore = computed(
  () => appStore.currentSimulator.stores.modelDBStore
);

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "model layout",
});

const dialogNewModel = () => {
  createDialog({
    customComponent: {
      component: NewModelDialog,
      props: {
        title: "Create NEST model",
        modelValue: "new model " + modelDBStore.value.state.models.length,
      },
    },
    text: "",
    title: "",
    // @ts-ignore - Dialog only returns string.
  }).then((model: NESTModel | undefined) => {
    if (model) {
      modelDBStore.value.state.models.unshift(model);
      modelStore.state.modelId = model.id;

      // Add model to first module.
      if (
        moduleStore.state.modules.length > 0 &&
        !moduleStore.state.modules[0].models.includes(model.id)
      ) {
        moduleStore.state.modules[0].models.push(model.id);
      }

      router.push({
        name: appStore.state.simulator + "ModelEditor",
        params: {
          modelId: model.id,
        },
      });
    }
  });
};

const loadProjectfromAssets = (): void => {
  logger.trace("load project from assets:", modelStore.state.projectId);

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
  logger.trace("select project", projectId);

  modelStore.state.projectId = projectId;
  update();
};

const update = () => {
  logger.trace("update");

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
      updateSimulationModules(false);

      project.network.nodes.neurons.forEach((neuron: NESTNode) => {
        neuron._modelId = modelStore.state.modelId;
        neuron.loadModel();
      });

      nextTick(() => {
        project.network.nodes.neurons.forEach((neuron: NESTNode) => {
          neuron.showAllParams(false);
        });

        project.network.nodes.updateRecords();
        project.simulation.init();
        project.activities.init();
        project.activityGraph.init();
      });
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
    id: "model-step-current-response",
    name: "step current response",
    icon: "mdi-chart-line",
  },
  {
    id: "model-current-steps",
    name: "current steps",
    icon: "mdi-chart-line",
  },
  {
    id: "model-rate-response",
    name: "rate response",
    icon: "mdi-chart-line",
  },
  {
    id: "model-spike-response",
    name: "spike response",
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
  mountModelLayout({ route, router });
});

watch(() => modelStore.state.modelId, update);
</script>
