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
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :icon="
            projectStore.state.bottomOpen
              ? 'mdi-arrow-expand-down'
              : 'mdi-arrow-expand-up'
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
    class="d-print-none"
    location="right"
    permanent
  >
    <div @mousedown="resizeRightNav()" class="resize-handle left" />

    <div :key="projectStore.state.projectId">
      <template v-if="projectStore.state.controllerView === 'network'">
        <slot name="network">
          <NetworkParamEditor :network="(project.network as Network)">
            <template #nodes>
              <slot name="nodes" />
            </template>
          </NetworkParamEditor>
        </slot>
      </template>

      <template v-else-if="projectStore.state.controllerView === 'kernel'">
        <slot name="simulationKernel">
          <SimulationKernelEditor
            :simulation="(project.simulation as Simulation)"
          />
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
          <simulation-code-editor
            :simulation="(project.simulation as Simulation)"
          />
        </slot>
      </template>

      <template v-else-if="projectStore.state.controllerView === 'activity'">
        <activity-chart-controller
          :graph="(project.activityGraph.activityChartGraph as ActivityChartGraph)"
        />
      </template>

      <template v-else-if="projectStore.state.controllerView === 'stats'">
        <activity-stats :activities="(project.activities as Activities)" />
      </template>
    </div>
  </v-navigation-drawer>

  <v-navigation-drawer
    :height="projectStore.state.bottomNavHeight"
    :model-value="projectStore.state.bottomOpen"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    location="bottom"
  >
    <div @mousedown="resizeBottomNav()" class="resize-handle bottom" />

    <slot name="simulationCodeMirror">
      <simulation-code-mirror
        :simulation="(project.simulation as Simulation)"
      />
    </slot>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

import ActivityChartController from "@/components/activity/activityChartGraph/ActivityChartController.vue";
import ActivityStats from "@/components/activity/activityStats/ActivityStats.vue";
import NetworkParamEditor from "@/components/network/NetworkParamEditor.vue";
import SimulationCodeEditor from "@/components/simulation/SimulationCodeEditor.vue";
import SimulationCodeMirror from "@/components/simulation/SimulationCodeMirror.vue";
import SimulationKernelEditor from "../simulation/SimulationKernelEditor.vue";
import { Activities } from "@/helpers/activity/activities";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";
import { Network } from "@/types/networkTypes";
import { Project } from "@/types/projectTypes";
import { Simulation } from "@/types/simulationTypes";
import { darkMode } from "@/helpers/common/theme";

import { useAppSessionStore } from "@/stores/appSessionStore";
const appSessionStore = useAppSessionStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const props = defineProps({
  projectStore: { required: true, type: Object },
});

const projectStore = computed(() => props.projectStore);
const project = computed(() => projectStore.value.state.project as Project);

const projectJSON = computed(() =>
  JSON.stringify(project.value.toJSON(), null, 2)
);

const controllerItems = [
  { id: "network", icon: "network:network", title: "Edit network" },
  { id: "kernel", icon: "mdi-engine-outline", title: "Edit kernel" },
  { id: "raw", icon: "mdi-code-json", show: "dev" },
  { id: "code", icon: "mdi-xml" },
  { id: "activity", icon: "mdi-border-style" },
  { id: "stats", icon: "mdi-table-large" },
];

const extensions = [json()];

if (darkMode()) {
  extensions.push(oneDark);
}

const dispatchWindowResize = () => {
  // console.log("Dispatch windows resize");
  // nextTick(() => window.dispatchEvent(new Event("resize")));
  setTimeout(() => window.dispatchEvent(new Event("resize")), 400); // TODO: nextTick doesn't work.
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
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
  dispatchWindowResize();
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
