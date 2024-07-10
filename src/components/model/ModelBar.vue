<template>
  <v-app-bar class="d-print-none" flat height="48">
    <v-tabs stacked>
      <slot name="prependTabs"></slot>

      <template v-for="(tabItem, index) in tabItems">
        <slot :name="tabItem.id">
          <v-tab
            :key="index"
            :title="tabItem.title"
            :to="{
              name: appStore.state.simulator + tabItem.to.name,
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

      <slot name="appendTabs"></slot>
    </v-tabs>

    <v-spacer />

    <v-app-bar-title>{{ modelStore.state.modelId }}</v-app-bar-title>

    <v-spacer />

    <SimulationButton
      :disabled="!modelStore.model.isNeuron"
      :simulation="modelStore.state.project.simulation"
      @click:simulate="modelStore.startSimulation()"
      v-if="modelStore.state.project"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SimulationButton from "../simulation/SimulationButton.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const modelStore = computed(() => appStore.currentSimulator.stores.modelStore);

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
