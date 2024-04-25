<template>
  <v-app-bar class="d-print-none" height="48" flat>
    <v-tabs stacked>
      <slot name="prependTabs" />

      <v-tab
        v-for="(tab, index) in tabItems"
        :key="index"
        :to="tab.to"
        :title="tab.title"
        size="small"
      >
        <v-icon :class="tab.iconClass" :icon="tab.icon" />
        <span class="text-no-wrap">{{ tab.label }}</span>
      </v-tab>

      <slot name="appendTabs" />
    </v-tabs>

    <v-spacer />

    <v-app-bar-title>
      {{ projectStore.project.name }}
    </v-app-bar-title>

    <v-spacer />

    <NetworkHistory :project="projectStore.project" />

    <SimulationButton
      v-if="projectStore.project"
      class="mx-2"
      :project-store
      :simulation="projectStore.project.simulation"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { Store } from "pinia";
import { computed } from "vue";

import NetworkHistory from "../network/NetworkHistory.vue";
import SimulationButton from "../simulation/SimulationButton.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{ projectStore: Store<any, any> }>();
const projectStore = computed(() => props.projectStore);

const tabItems = [
  {
    icon: "network:network",
    iconClass: "",
    id: "networkEditor",
    label: "Editor",
    title: "Network editor",
    to: {
      name: appStore.state.simulator + "NetworkEditor",
      params: { projectId: projectStore.value.projectId },
    },
  },
  {
    icon: "mdi:mdi-border-style",
    iconClass: "mdi-flip-v",
    id: "activityExplorer",
    label: "Explorer",
    title: "Activity explorer",
    to: {
      name: appStore.state.simulator + "ActivityExplorer",
      params: { projectId: projectStore.value.projectId },
    },
    menu: true,
  },
  {
    icon: "mdi:mdi-book-open-outline",
    iconClass: "",
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
