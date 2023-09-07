<template>
  <v-navigation-drawer
    :model-value="navStore.open"
    :style="{ transition: navStore.resizing ? 'initial' : '' }"
    :width="navStore.width"
    @update:model-value="dispatchWindowResize"
    class="d-print-none"
    permanent
  >
    <div @mousedown="resizeSideNav" class="resize-handle right" />

    <project-nav />
  </v-navigation-drawer>

  <v-app-bar class="d-print-none" color="norse" height="48" flat>
    <project-bar :project="project" />
  </v-app-bar>

  <v-navigation-drawer
    class="d-print-none full-height"
    location="right"
    permanent
    rail
    rail-width="64"
  >
    <v-tabs
      :mandatory="false"
      :model-value="projectStore.controllerView"
      color="primary"
      direction="vertical"
      stacked
      width="64"
    >
      <v-tab
        :key="index"
        :value="item.id"
        @click.stop="projectStore.toggleController(item)"
        class="justify-center"
        height="72"
        minWidth="0"
        v-for="(item, index) in controllerItems"
        v-show="
          item.show !== 'dev' || (item.show === 'dev' && appStore.devMode)
        "
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px"> {{ item.id }}</span>
      </v-tab>
    </v-tabs>

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          @click.stop="projectStore.bottomOpen = !projectStore.bottomOpen"
          icon="mdi-xml"
          size="small"
          value="code"
          variant="plain"
        />
      </v-row>
    </template>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="projectStore.controllerOpen"
    :style="{ transition: navStore.resizing ? 'initial' : '' }"
    :width="projectStore.controllerWidth"
    @update:model-value="dispatchWindowResize"
    class="d-print-none"
    location="right"
    permanent
  >
    <div @mousedown="resizeSideController" class="resize-handle left" />
    <div :key="projectStore.projectId">
      <network-param-editor v-if="projectStore.controllerView === 'network'" />

      <simulation-kernel-editor
        :simulation="(project.simulation as NorseSimulation)"
        v-else-if="projectStore.controllerView === 'kernel'"
      />

      <codemirror
        :extensions="extensions"
        :model-value="projectJSON"
        disabled
        style="font-size: 0.75rem; width: 100%"
        v-else-if="appStore.devMode && projectStore.controllerView === 'raw'"
      />

      <simulation-code-editor
        :simulation="(project.simulation as NorseSimulation)"
        v-else-if="projectStore.controllerView === 'code'"
      />

      <activity-chart-controller
        :graph="(project.activityGraph.activityChartGraph as ActivityChartGraph)"
        v-else-if="projectStore.controllerView === 'activity'"
      />

      <activity-stats
        :activities="(project.activities as Activities)"
        v-else-if="projectStore.controllerView === 'stats'"
      />
    </div>
  </v-navigation-drawer>

  <router-view :key="projectStore.projectId" name="project" />

  <v-bottom-navigation
    :active="projectStore.bottomOpen"
    :height="projectStore.bottomNavHeight"
    :style="{ transition: navStore.resizing ? 'initial' : '' }"
    class="d-print-none"
  >
    <div @mousedown="resizeBottomNav" class="resize-handle bottom" />
    <simulation-code-mirror
      :simulation="(project.simulation as NorseSimulation)"
    />
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";

import ActivityChartController from "@/components/activity/activityChartGraph/ActivityChartController.vue";
import ActivityStats from "@/components/activity/activityStats/ActivityStats.vue";
import SimulationCodeEditor from "@/components/simulation/SimulationCodeEditor.vue";
import SimulationCodeMirror from "@/components/simulation/SimulationCodeMirror.vue";
import { Activities } from "@/helpers/activity/activities";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";

import NetworkParamEditor from "@norse/components/network/NetworkParamEditor.vue";
import SimulationKernelEditor from "@norse/components/simulation/SimulationKernelEditor.vue";
import { NorseProject } from "@norse/helpers/project/norseProject";
import { NorseSimulation } from "@norse/helpers/simulation/norseSimulation";

import ProjectBar from "./ProjectBar.vue";
import ProjectNav from "./ProjectNav.vue";

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/store/navStore";
const navStore = useNavStore();

import { useNorseProjectStore } from "@norse/store/project/norseProjectStore";
const projectStore = useNorseProjectStore();

const project = computed(() => projectStore.project as NorseProject);

const projectJSON = computed(() =>
  JSON.stringify(project.value.toJSON(), null, 2)
);
const extensions = [json()];

const controllerItems = [
  { id: "network", icon: "nest:network", title: "Edit network" },
  { id: "kernel", icon: "mdi-engine-outline", title: "Edit kernel" },
  { id: "raw", icon: "mdi-code-json", show: "dev" },
  { id: "code", icon: "mdi-xml" },
  { id: "activity", icon: "mdi-border-style" },
  { id: "stats", icon: "mdi-table-large" },
];

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x possition is taken
 */
const handleSideNavMouseMove = (e: MouseEvent) => {
  navStore.width = e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleSideNavMouseUp = () => {
  navStore.resizing = false;
  window.removeEventListener("mousemove", handleSideNavMouseMove);
  window.removeEventListener("mouseup", handleSideNavMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize side nav.
 */
const resizeSideNav = () => {
  navStore.resizing = true;
  window.addEventListener("mousemove", handleSideNavMouseMove);
  window.addEventListener("mouseup", handleSideNavMouseUp);
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleSideControllerMouseMove = (e: MouseEvent) => {
  projectStore.controllerWidth = window.innerWidth - e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleSideControllerMouseUp = () => {
  navStore.resizing = false;
  window.removeEventListener("mousemove", handleSideControllerMouseMove);
  window.removeEventListener("mouseup", handleSideControllerMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize bottom nav.
 */
const resizeBottomNav = () => {
  navStore.resizing = true;
  window.addEventListener("mousemove", handleBottomNavMouseMove);
  window.addEventListener("mouseup", handleBottomNavMouseUp);
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleBottomNavMouseMove = (e: MouseEvent) => {
  projectStore.bottomNavHeight = window.innerHeight - e.clientY;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleBottomNavMouseUp = () => {
  navStore.resizing = false;
  window.removeEventListener("mousemove", handleBottomNavMouseMove);
  window.removeEventListener("mouseup", handleBottomNavMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize side controller.
 */
const resizeSideController = () => {
  navStore.resizing = true;
  window.addEventListener("mousemove", handleSideControllerMouseMove);
  window.addEventListener("mouseup", handleSideControllerMouseUp);
};

const dispatchWindowResize = () => {
  window.dispatchEvent(new Event("resize"));
};
</script>

<style scoped>
.resize-handle {
  position: fixed;
  z-index: 10;
}

.right {
  cursor: ew-resize;
  height: 100%;
  width: 4px;
  right: 0;
}

.left {
  cursor: ew-resize;
  height: 100%;
  width: 4px;
  left: 0;
}

.bottom {
  cursor: ns-resize;
  height: 4px;
  width: 100%;
  top: 0;
}
</style>
