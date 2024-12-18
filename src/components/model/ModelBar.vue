<template>
  <v-app-bar class="d-print-none" elevation="0" height="48">
    <v-tabs stacked>
      <slot name="prependTabs" />

      <template v-for="(tabItem, index) in tabItems">
        <slot :name="tabItem.id">
          <v-tab
            :key="index"
            :title="tabItem.title"
            :to="{
              name: appStore.state.workspace + tabItem.to.name,
              params: {
                modelId: modelStore.state.modelId,
              },
            }"
            size="small"
          >
            <v-icon :icon="tabItem.icon" />
            <span class="text-no-wrap">{{ tabItem.label }}</span>
          </v-tab>
        </slot>
      </template>

      <slot name="appendTabs" />
    </v-tabs>

    <v-spacer />
    <v-app-bar-title :text="modelStore.state.modelId" />
    <v-spacer />

    <v-card v-if="appStore.state.devMode && !appStore.state.loading" class="mx-1" variant="outlined">
      <v-list class="py-1" density="compact" style="font-size: 10px; line-height: 1em">
        <v-list-item class="auto-min-height">Build time: {{ modelStore.state.stopwatch.build / 1000 }}s</v-list-item>
        <v-list-item v-if="modelStore.state.project" class="auto-min-height">
          Simulation: {{ modelStore.state.project.state.state.stopwatch.simulation / 1000 }}s
        </v-list-item>
      </v-list>
    </v-card>

    <slot name="prependBtn" />

    <SimulationButton
      v-if="modelStore.state.project"
      :disabled="!modelStore.model.isNeuron"
      :simulation="modelStore.state.project.simulation"
      @click:simulate="modelStore.startSimulation()"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SimulationButton from "../simulation/SimulationButton.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const modelStore = computed(() => appStore.currentWorkspace.stores.modelStore);

const tabItems = [
  {
    icon: "mdi:mdi-chart-scatter-plot",
    id: "modelExplorer",
    label: "Explore",
    title: "Explore activity",
    to: {
      name: "ModelExplorer",
    },
  },
  {
    icon: "mdi:mdi-pencil",
    id: "modelEditor",
    label: "Edit",
    title: "Edit activity",
    to: {
      name: "ModelEditor",
    },
  },
];
</script>

<style lang="scss" scoped>
.auto-min-height {
  padding: 2px;
  min-height: 1em;
}
</style>
