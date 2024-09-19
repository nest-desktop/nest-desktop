<template>
  <v-app-bar class="d-print-none" height="48" flat>
    <v-tabs stacked>
      <slot name="tabs">
        <template v-for="(tabItem, index) in tabItems">
          <slot :name="tabItem.id">
            <v-tab
              :key="index"
              :to="{
                name: appStore.state.simulator + tabItem.to.name,
                params: { projectId: projectStore.state.projectId },
              }"
              :title="tabItem.title"
              size="small"
            >
              <v-icon v-bind="tabItem.icon" />
              <span class="text-no-wrap">{{ tabItem.label }}</span>
            </v-tab>
          </slot>
        </template>
      </slot>
    </v-tabs>

    <v-spacer />

    <v-app-bar-title>
      {{ projectStore.state.project.name }}
    </v-app-bar-title>

    <v-spacer />

    <NetworkHistory />

    <slot name="prependBtn" />

    <SimulationButton
      :simulation="projectStore.state.project.simulation"
      @click:simulate="projectStore.startSimulation()"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import NetworkHistory from "../network/NetworkHistory.vue";
import SimulationButton from "../simulation/SimulationButton.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const projectStore = computed(
  () => appStore.currentSimulator.stores.projectStore
);

const tabItems = [
  {
    icon: {
      icon: "network:network",
    },
    id: "networkEditor",
    label: "Editor",
    title: "Network editor",
    to: {
      name: "NetworkEditor",
    },
  },
  {
    icon: {
      class: "mdi-flip-v",
      icon: "mdi:mdi-border-style",
    },
    id: "activityExplorer",
    label: "Explorer",
    title: "Activity explorer",
    to: {
      name: "ActivityExplorer",
    },
  },
  {
    icon: { icon: "mdi:mdi-book-open-outline" },
    id: "labBook",
    label: "Lab book",
    title: "Lab book",
    to: {
      name: "LabBook",
    },
  },
];
</script>
