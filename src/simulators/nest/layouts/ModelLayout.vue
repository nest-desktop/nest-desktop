<template>
  <ModelNav />

  <template v-if="modelStore.model">
    <ModelBar color="nest-model">
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
import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

// const projects = [
//   {
//     id: "model-step-current-up-down",
//     name: "step current (up/down)",
//     icon: "mdi-chart-line",
//   },
//   {
//     id: "model-current-steps",
//     name: "current steps",
//     icon: "mdi-chart-line",
//   },
//   {
//     id: "model-spikes-up-down",
//     name: "spikes (up/down)",
//     icon: "mdi-chart-line",
//   },
//   {
//     id: "model-regular-spikes-steps",
//     name: "regular spikes steps",
//     icon: "mdi-chart-line",
//   },
//   {
//     id: "model-poisson-spikes-steps",
//     name: "Poisson spikes steps",
//     icon: "mdi-chart-line",
//   },
//   {
//     id: "model-f-i-curve",
//     name: "F-I curve",
//     icon: "mdi-chart-line",
//   },
//   {
//     id: "spike-activity",
//     name: "spike activity",
//     icon: "mdi-chart-scatter-plot",
//   },
// ];
</script>
