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
      {{ project.name }}
    </v-app-bar-title>

    <v-spacer />

    <simulation-button
      class="mx-2"
      :projectStore="projectStore"
      :simulation="project.simulation"
      v-if="project"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SimulationButton from "@/components/simulation/SimulationButton.vue";
import { Project, ProjectPropTypes } from "@/types/projectTypes";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps({
  project: ProjectPropTypes,
  projectStore: Object,
});

const project = computed(() => props.project as Project);
const projectStore = computed(() => props.projectStore);

const tabItems = computed(() => [
  {
    icon: "network:network",
    id: "networkEditor",
    label: "Editor",
    title: "Network editor",
    to: {
      name: appStore.state.simulator + "NetworkEditor",
      params: { projectId: project.value.id },
    },
  },
  {
    icon: "mdi-border-style",
    id: "activityExplorer",
    label: "Explorer",
    title: "Activity explorer",
    to: {
      name: appStore.state.simulator + "ActivityExplorer",
      params: { projectId: project.value.id },
    },
  },
  {
    icon: "mdi-book-open-outline",
    id: "labBook",
    label: "Lab book",
    title: "Lab book",
    to: {
      name: appStore.state.simulator + "LabBook",
      params: { projectId: project.value.id },
    },
  },
]);
</script>
