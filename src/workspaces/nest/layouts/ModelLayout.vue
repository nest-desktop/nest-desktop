<template>
  <ModelNav color="nest-model">
    <template #newModel>
      <v-fab
        v-show="appStore.currentWorkspace.backends.nestml.state.enabled"
        class="ms-4"
        color="primary"
        icon="mdi:mdi-plus"
        location="bottom left"
        size="40"
        absolute
        offset
        title="Create a new model"
        @click="dialogNewModel()"
      />
    </template>
  </ModelNav>

  <template v-if="modelStore.model && modelStore.model.id === modelStore.state.modelId">
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

        <ModelSelectProjectMenu
          :disabled="!modelStore.model.isNeuron"
          :projects
          :model-value="modelStore.state.projectId"
          @update:model-value="(projectId: string) => modelStore.selectProject(projectId, updateProject)"
        />

        <v-divider vertical />
      </template>

      <template #prependBtn>
        <v-btn
          v-if="appStore.currentWorkspace.backends.nestml.state.enabled"
          prepend-icon="mdi:mdi-memory"
          text="module"
          title="Generate module"
          @click="openNESTModuleDialog()"
        />
      </template>

      <v-btn prepend-icon="mdi:mdi-memory" text="module" title="Generate module" @click="openNESTModuleDialog()" />

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
import ModelSelectProjectMenu from "@/components/model/ModelSelectProjectMenu.vue";
import { mountModelLayout } from "@/helpers/routes";

import NewModelDialog from "../components/dialog/NewModelDialog.vue";
import { NESTModel } from "../types";
import { openNESTModuleDialog } from "../stores/moduleStore";

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { updateProject, useNESTModelStore } from "../stores/model/modelStore";
const modelStore = useNESTModelStore();

import { useNESTModuleStore } from "../stores/moduleStore";
const moduleStore = useNESTModuleStore();

const modelDBStore = computed(() => appStore.currentWorkspace.stores.modelDBStore);

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
    // @ts-expect-error Vuetify3 Dialog only returns string.
  }).then((model: NESTModel | undefined) => {
    if (model) {
      modelDBStore.value.state.models.unshift(model);
      modelStore.state.modelId = model.id;

      // Add model to first module.
      if (moduleStore.state.modules.length > 0 && !moduleStore.state.modules[0].models.includes(model.id)) {
        moduleStore.state.modules[0].models.push(model.id);
      }

      router.push({
        name: appStore.state.workspace + "ModelEditor",
        params: {
          modelId: model.id,
        },
      });
    }
  });
};

onMounted(() => {
  mountModelLayout({ route, router });
  nextTick(() => modelStore.selectProject(projects[0].id));
});

watch(() => modelStore.state.modelId, updateProject);
</script>
