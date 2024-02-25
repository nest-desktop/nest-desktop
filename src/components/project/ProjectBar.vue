<template>
  <v-app-bar class="d-print-none" height="48" flat>
    <v-tabs stacked>
      <slot name="prependTabs"></slot>

      <v-tab
        :key="index"
        :to="tab.to"
        :title="tab.title"
        size="small"
        v-for="(tab, index) in tabItems"
      >
        <v-icon :icon="tab.icon" />
        <span class="text-no-wrap">{{ tab.label }}</span>
      </v-tab>

      <slot name="appendTabs"></slot>
    </v-tabs>

    <v-spacer />

    <v-app-bar-title>
      {{ projectStore.project.name }}
    </v-app-bar-title>

    <v-spacer />

    <simulation-button
      class="mx-2"
      :projectStore
      :simulation="(projectStore.project.simulation as Simulation)"
      v-if="projectStore.project"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SimulationButton from "@/components/simulation/SimulationButton.vue";
import { Simulation } from "@/types/simulationTypes";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps({
  projectStore: { required: true, type: Object },
});

const projectStore = computed(() => props.projectStore);

const tabItems = [
  {
    icon: "network:network",
    id: "networkEditor",
    label: "Editor",
    title: "Network editor",
    to: {
      name: appStore.state.simulator + "NetworkEditor",
      params: { projectId: projectStore.value.projectId },
    },
  },
  {
    icon: "mdi-border-style",
    id: "activityExplorer",
    label: "Explorer",
    title: "Activity explorer",
    to: {
      name: appStore.state.simulator + "ActivityExplorer",
      params: { projectId: projectStore.value.projectId },
    },
  },
  {
    icon: "mdi-book-open-outline",
    id: "labBook",
    label: "Lab book",
    title: "Lab book",
    to: {
      name: appStore.state.simulator + "LabBook",
      params: { projectId: projectStore.value.projectId },
    },
  },
];
</script>
