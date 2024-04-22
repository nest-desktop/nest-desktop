<template>
  <v-navigation-drawer
    class="d-print-none full-height"
    location="right"
    permanent
    rail
    railWidth="64"
  >
    <v-tabs
      :mandatory="false"
      :model-value="projectStore.state.controllerView"
      color="primary"
      direction="vertical"
      stacked
      width="64"
    >
      <v-tab
        :key="index"
        :ripple="false"
        :value="item.id"
        @click.stop="projectStore.toggleController(item)"
        class="justify-center"
        height="72"
        min-width="0"
        v-for="(item, index) in controllerItems"
        v-show="
          item.show !== 'dev' ||
          (item.show === 'dev' && appSessionStore.state.devMode)
        "
      >
        <v-icon
          :icon="item.icon"
          :class="item.iconClass"
          class="ma-1"
          size="large"
        />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :icon="
            projectStore.state.bottomOpen
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
    :model-value="projectStore.state.controllerOpen"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="projectStore.state.controllerWidth"
    @transitionend="dispatchWindowResize()"
    class="d-print-none"
    location="right"
    permanent
  >
    <div @mousedown="resizeRightNav()" class="resize-handle left" />

    <div :key="projectStore.state.projectId">
      <template v-if="projectStore.state.controllerView === 'network'">
        <slot name="network">
          <NetworkParamEditor :network="project.network">
            <template #nodes>
              <slot name="nodes" />
            </template>
          </NetworkParamEditor>
        </slot>
      </template>

      <template v-else-if="projectStore.state.controllerView === 'kernel'">
        <slot name="simulationKernel">
          <SimulationKernelEditor :simulation="project.simulation" />
        </slot>
      </template>

      <template
        v-else-if="
          appSessionStore.state.devMode &&
          projectStore.state.controllerView === 'raw'
        "
      >
        <codemirror
          :extensions="extensions"
          :model-value="projectJSON"
          disabled
          style="font-size: 0.75rem; width: 100%"
        />
      </template>

      <template v-else-if="projectStore.state.controllerView === 'code'">
        <slot name="simulationCodeEditor">
          <simulation-code-editor :simulation="project.simulation" />
        </slot>
      </template>

      <template v-else-if="projectStore.state.controllerView === 'activity'">
        <activity-chart-controller
          :graph="project.activityGraph.activityChartGraph"
        />
      </template>

      <template v-else-if="projectStore.state.controllerView === 'stats'">
        <activity-stats :activities="project.activities" />
      </template>
    </div>
  </v-navigation-drawer>

  <v-bottom-navigation
    :active="projectStore.state.bottomOpen"
    :height="projectStore.state.bottomNavHeight"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    @transitionend="dispatchWindowResize()"
    location="bottom"
  >
    <div @mousedown="resizeBottomNav()" class="resize-handle bottom" />

    <slot name="simulationCodeMirror">
      <simulation-code-mirror :simulation="project.simulation" />
    </slot>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { Codemirror } from "vue-codemirror";
import { LanguageSupport } from "@codemirror/language";
import { Store } from "pinia";
import { computed, nextTick } from "vue";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

import ActivityChartController from "@/components/activity/activityChartGraph/ActivityChartController.vue";
import ActivityStats from "@/components/activity/activityStats/ActivityStats.vue";
import NetworkParamEditor from "@/components/network/NetworkParamEditor.vue";
import SimulationCodeEditor from "@/components/simulation/SimulationCodeEditor.vue";
import SimulationCodeMirror from "@/components/simulation/SimulationCodeMirror.vue";
import SimulationKernelEditor from "../simulation/SimulationKernelEditor.vue";
import { darkMode } from "@/helpers/common/theme";

import { useAppSessionStore } from "@/stores/appSessionStore";
const appSessionStore = useAppSessionStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const props = defineProps<{ projectStore: Store<any, any> }>();
const projectStore = computed(() => props.projectStore);
const project = computed(() => projectStore.value.state.project);

const projectJSON = computed(() =>
  JSON.stringify(project.value.toJSON(), null, 2)
);

const controllerItems = [
  {
    id: "network",
    icon: "network:network",
    iconClass: "",
    title: "Edit network",
  },
  {
    id: "kernel",
    icon: "mdi:mdi-engine-outline",
    iconClass: "",
    title: "Edit kernel",
  },
  { id: "raw", icon: "mdi:mdi-code-json", iconClass: "", show: "dev" },
  { id: "code", icon: "mdi:mdi-xml", iconClass: "", title: "Edit code" },
  {
    id: "activity",
    icon: "mdi:mdi-border-style",
    iconClass: "mdi-flip-v",
    title: "Configure activity",
  },
  {
    id: "stats",
    icon: "mdi:mdi-table-large",
    iconClass: "",
    title: "View statistics",
  },
];

const extensions = [json()];

if (darkMode()) {
  extensions.push(oneDark as LanguageSupport);
}

const dispatchWindowResize = () => {
  // console.log("Dispatch windows resize");
  nextTick(() => window.dispatchEvent(new Event("resize")));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the y position is taken
 */
const handleBottomNavMouseMove = (e: MouseEvent) => {
  projectStore.value.state.bottomNavHeight = window.innerHeight - e.clientY;
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
  projectStore.value.state.controllerWidth = window.innerWidth - e.clientX - 64;
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
  projectStore.value.state.bottomOpen = !projectStore.value.state.bottomOpen;
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
