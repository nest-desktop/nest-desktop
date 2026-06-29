<template>
  <ModelNav color="rosa" />

  <template v-if="modelStore.state.modelId">
    <ModelBar color="rosa">
      <template #modelExplorer>
        <v-tab
          :disabled="!modelStore.model.isNeuron"
          :to="{
            name: 'norseModelExplorer',
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
          @update:model-value="(projectId: string) => modelStore.selectProject(projectId)"
        />

        <v-divider vertical />
      </template>
    </ModelBar>

    <ModelController />

    <router-view :key="modelStore.state.modelId" name="model" />
  </template>
</template>

<script setup lang="ts">
import { nextTick, onMounted, watch } from "vue";

import { ModelBar, ModelController, ModelNav, ModelSelectProjectMenu } from "@/model/components";
import { mountModelLayout } from "@/model";

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useNorseModelStore } from "../model";
const modelStore = useNorseModelStore();

const projects: { id: string; name: string; icon: string }[] = [
  {
    id: "model-step-current-input",
    name: "step current input",
    icon: "mdi-chart-line",
  },
  {
    id: "model-noise-current-input",
    name: "noise current input",
    icon: "mdi-chart-line",
  },
  {
    id: "model-spike-inputs",
    name: "spike inputs",
    icon: "mdi-chart-line",
  },
  {
    id: "model-spike-activity",
    name: "spike activity",
    icon: "mdi-chart-scatter-plot",
  },
];

onMounted(() => {
  mountModelLayout({ route, router });
  nextTick(() => modelStore.selectProject(projects[0].id));
});

watch(() => modelStore.state.modelId, modelStore.updateProject);
</script>
