<template>
  <v-navigation-drawer
    class="d-print-none full-height"
    location="right"
    permanent
    rail
  >
    <v-tabs
      :mandatory="false"
      :model-value="projectStore.state.controller.view"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        :key="index"
        :ripple="false"
        :value="item.id"
        @click.stop="projectStore.toggleController(item)"
        class="justify-center"
        height="76"
        min-width="0"
        v-for="(item, index) in controllerItems"
        v-show="
          item.show !== 'dev' || (item.show === 'dev' && appStore.state.devMode)
        "
      >
        <v-icon class="ma-1" size="large" v-bind="item.icon" />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>

    <!-- <v-list
      :model-value="projectStore.state.controller.view"
      class="px-0 text-center"
      color="primary"
      density="compact"
    >
      <v-list-item
        :key="index"
        :value="item.id"
        @click.stop="projectStore.toggleController(item)"
        class="py-3 my-0 justify-center"
        v-for="(item, index) in controllerItems"
        v-show="
          item.show !== 'dev' || (item.show === 'dev' && appStore.state.devMode)
        "
      >
        <v-icon :class="item.icon.class" :icon="item.icon.icon" size="large" />
        <span class="text-button" style="font-size: 9px !important">
          {{ item.id }}
        </span>
      </v-list-item>
    </v-list> -->

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :icon="
            projectStore.state.bottomNav.active
              ? 'mdi:mdi-arrow-expand-down'
              : 'mdi:mdi-arrow-expand-up'
          "
          @click.stop="toggleBottomNav()"
          value="code"
          variant="plain"
        />
      </v-row>
    </template>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="projectStore.state.controller.open"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="projectStore.state.controller.width"
    @transitionend="dispatchWindowResize()"
    class="d-print-none"
    location="right"
    permanent
  >
    <div @mousedown="resizeRightNav()" class="resize-handle left" />

    <div :key="projectStore.state.projectId">
      <template v-if="projectStore.state.controller.view === 'network'">
        <slot name="network">
          <NetworkSpecEditor :network="(project.network as BaseNetwork)">
            <template #model><slot name="model" /></template>
            <template #nodes><slot name="nodes" /></template>
          </NetworkSpecEditor>
        </slot>
      </template>

      <template v-else-if="projectStore.state.controller.view === 'kernel'">
        <slot name="simulationKernel">
          <SimulationKernelEditor
            :simulation="(project.simulation as BaseSimulation)"
          />
        </slot>
      </template>

      <template
        v-else-if="
          appStore.state.devMode && projectStore.state.controller.view === 'raw'
        "
      >
        <codemirror
          :extensions="extensions"
          :model-value="projectJSON"
          disabled
          style="font-size: 0.75rem; width: 100%"
        />
      </template>

      <template v-else-if="projectStore.state.controller.view === 'code'">
        <slot name="simulationCodeEditor">
          <SimulationCodeEditor
            :simulation="(project.simulation as BaseSimulation)"
          />
        </slot>
      </template>

      <template v-else-if="projectStore.state.controller.view === 'activity'">
        <slot name="activityController">
          <ActivityChartController
            :graph="(project.activityGraph.activityChartGraph as ActivityChartGraph)"
          />
        </slot>
      </template>

      <template v-else-if="projectStore.state.controller.view === 'stats'">
        <ActivityStats :activities="(project.activities as Activities)" />
      </template>
    </div>
  </v-navigation-drawer>

  <v-bottom-navigation
    :active="projectStore.state.bottomNav.active"
    :height="projectStore.state.bottomNav.height"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    @transitionend="dispatchWindowResize()"
    class="no-print"
    location="bottom"
  >
    <div @mousedown="resizeBottomNav()" class="resize-handle bottom" />

    <slot name="simulationCodeMirror">
      <SimulationCodeMirror
        :simulation="(project.simulation as BaseSimulation)"
      />
    </slot>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { Codemirror } from "vue-codemirror";
import { LanguageSupport } from "@codemirror/language";
import { computed, nextTick } from "vue";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

import ActivityChartController from "../activityChart/ActivityChartController.vue";
import ActivityStats from "../activityStats/ActivityStats.vue";
import NetworkSpecEditor from "../network/NetworkSpecEditor.vue";
import SimulationCodeEditor from "../simulation/SimulationCodeEditor.vue";
import SimulationCodeMirror from "../simulation/SimulationCodeMirror.vue";
import SimulationKernelEditor from "../simulation/SimulationKernelEditor.vue";
import { Activities } from "@/helpers/activity/activities";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";
import { BaseNetwork } from "@/helpers/network/network";
import { BaseSimulation } from "@/helpers/simulation/simulation";
import { darkMode } from "@/helpers/common/theme";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const projectStore = computed(
  () => appStore.currentSimulator.stores.projectStore
);
const project = computed(() => projectStore.value.state.project);

const projectJSON = computed(() =>
  JSON.stringify(project.value.toJSON(), null, 2)
);

interface IControllerItem {
  id: string;
  icon: {
    class?: string;
    icon: string;
  };
  show?: string;
  title: string;
}

const controllerItems: IControllerItem[] = [
  {
    id: "network",
    icon: {
      icon: "network:network",
    },
    title: "Edit network",
  },
  {
    id: "kernel",
    icon: {
      icon: "mdi:mdi-engine-outline",
    },
    title: "Edit kernel",
  },
  {
    id: "raw",
    icon: {
      icon: "mdi:mdi-code-json",
    },
    show: "dev",
    title: "View raw data",
  },
  { id: "code", icon: { icon: "mdi:mdi-xml" }, title: "Edit code" },
  {
    id: "activity",
    icon: {
      class: "mdi-flip-v",
      icon: "mdi:mdi-border-style",
    },
    title: "Configure activity",
  },
  {
    id: "stats",
    icon: {
      icon: "mdi:mdi-table-large",
    },
    title: "View statistics",
  },
];

const extensions = [json()];

if (darkMode()) {
  extensions.push(oneDark as LanguageSupport);
}

const dispatchWindowResize = () => {
  nextTick(() => window.dispatchEvent(new Event("resize")));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the y position is taken
 */
const handleBottomNavMouseMove = (e: MouseEvent) => {
  projectStore.value.state.bottomNav.height = window.innerHeight - e.clientY;
};

/**
 * Handle mouse up on resizing.
 */
const handleBottomNavMouseUp = () => {
  navStore.state.resizing = false;
  window.removeEventListener("mousemove", handleBottomNavMouseMove);
  window.removeEventListener("mouseup", handleBottomNavMouseUp);
  dispatchWindowResize();
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleRightNavMouseMove = (e: MouseEvent) => {
  projectStore.value.state.controller.width =
    window.innerWidth - e.clientX - 64;
};

/**
 * Handle mouse up on resizing.
 */
const handleRightNavMouseUp = () => {
  navStore.state.resizing = false;
  window.removeEventListener("mousemove", handleRightNavMouseMove);
  window.removeEventListener("mouseup", handleRightNavMouseUp);
  dispatchWindowResize();
};

/**
 * Resize bottom nav.
 */
const resizeBottomNav = () => {
  navStore.state.resizing = true;
  window.addEventListener("mousemove", handleBottomNavMouseMove);
  window.addEventListener("mouseup", handleBottomNavMouseUp);
};

/**
 * Resize side controller.
 */
const resizeRightNav = () => {
  navStore.state.resizing = true;
  window.addEventListener("mousemove", handleRightNavMouseMove);
  window.addEventListener("mouseup", handleRightNavMouseUp);
};

/**
 * Toggle bottom navigation.
 */
const toggleBottomNav = () => {
  projectStore.value.state.bottomNav.active =
    !projectStore.value.state.bottomNav.active;
};
</script>

<style scoped>
.resize-handle {
  position: fixed;
  z-index: 10;
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
