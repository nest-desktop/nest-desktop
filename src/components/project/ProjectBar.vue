<template>
  <v-app-bar class="d-print-none" height="48" flat>
    <v-tabs stacked>
      <slot name="tabs">
        <template v-for="(tabItem, index) in tabItems">
          <slot :name="tabItem.id">
            <v-tab
              :key="index"
              :to="{
                name: appStore.state.currentWorkspace + tabItem.to.name,
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

    <v-app-bar-title
      :text="projectStore.state.project.name || 'undefined project ' + truncate(projectStore.state.project.id)"
      style="min-width: auto"
    />
    <!-- <v-btn
      @click="() => (projectStore.state.project.state.state.editMode = true)"
      icon="mdi:mdi-pencil"
      size="x-small"
    /> -->
    <v-spacer />

    <slot name="stopwatch">
      <v-card
        v-if="projectStore.state.project && appStore.state.devMode && !appStore.state.loading"
        class="mx-1"
        variant="outlined"
      >
        <v-list class="py-1" density="compact" style="font-size: 10px; line-height: 1em">
          <v-list-item class="auto-min-height">
            Simulation: {{ projectStore.state.project.state.state.stopwatch.simulation / 1000 }}s
          </v-list-item>
          <v-list-item class="auto-min-height">
            Visualization: {{ projectStore.state.project.state.state.stopwatch.visualization / 1000 }}s
          </v-list-item>
        </v-list>
      </v-card>
    </slot>

    <NetworkHistory v-if="projectStore.state.project" />

    <slot name="prependBtn" />

    <slot name="execBtn">
      <SimulationButton
        :simulation="projectStore.state.project.simulation"
        @click:simulate="projectStore.startSimulation()"
      />
    </slot>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";

import NetworkHistory from "../network/NetworkHistory.vue";
import SimulationButton from "../simulation/SimulationButton.vue";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const projectStore = computed(() => appStore.currentWorkspace.stores.projectStore);

const tabItems = [
  {
    icon: {
      icon: "graph:flowchart",
    },
    id: "graphEditor",
    label: "Editor",
    title: "Graph editor",
    to: {
      name: "GraphEditor",
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

<style lang="scss" scoped>
.auto-min-height {
  padding: 2px;
  min-height: 1em;
}
</style>
