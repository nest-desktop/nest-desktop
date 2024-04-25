<template>
  <v-app-bar class="d-print-none" height="48" flat>
    <v-tabs stacked>
      <slot name="tabs">
        <v-tab
          v-for="(tab, index) in tabItems"
          :key="index"
          :to="{
            name: appStore.state.simulator + tab.to.name,
            params: { projectId: projectStore.state.projectId },
          }"
          :title="tab.title"
          size="small"
        >
          <v-icon :class="tab.iconClass" :icon="tab.icon" />
          <span class="text-no-wrap">{{ tab.label }}</span>
        </v-tab>
      </slot>
    </v-tabs>

    <v-spacer />

    <v-app-bar-title>
      {{ projectStore.state.project.name }}
    </v-app-bar-title>

    <v-spacer />

    <NetworkHistory :project="projectStore.state.project" />

    <SimulationButton
      v-if="projectStore.state.project"
      class="mx-2"
      :project-store
      :simulation="projectStore.state.project.simulation"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { Store } from "pinia";

import NetworkHistory from "../network/NetworkHistory.vue";
import SimulationButton from "../simulation/SimulationButton.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

defineProps<{ projectStore: Store<any, any> }>();

const tabItems = [
  {
    icon: "network:network",
    iconClass: "",
    id: "networkEditor",
    label: "Editor",
    title: "Network editor",
    to: {
      name: "NetworkEditor",
    },
  },
  {
    icon: "mdi:mdi-border-style",
    iconClass: "mdi-flip-v",
    id: "activityExplorer",
    label: "Explorer",
    title: "Activity explorer",
    to: {
      name: "ActivityExplorer",
    },
  },
  {
    icon: "mdi:mdi-book-open-outline",
    iconClass: "",
    id: "labBook",
    label: "Lab book",
    title: "Lab book",
    to: {
      name: "LabBook",
    },
  },
];
</script>
