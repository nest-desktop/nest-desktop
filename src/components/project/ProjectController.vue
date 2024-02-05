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
      :modelValue="projectStore.state.controllerView"
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
          @click.stop="projectStore.state.bottomOpen = !projectStore.state.bottomOpen"
          icon="mdi-xml"
          size="small"
          value="code"
          variant="plain"
        />
      </v-row>
    </template>
  </v-navigation-drawer>

  <v-navigation-drawer
    :modelValue="projectStore.state.controllerOpen"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="projectStore.state.controllerWidth"
    @update:modelValue="dispatchWindowResize"
    class="d-print-none"
    location="right"
    permanent
  >
    <div @mousedown="resizeSideController" class="resize-handle left" />

    <div :key="projectStore.state.projectId">
      <template v-if="projectStore.state.controllerView === 'network'">
        <slot name="network">
          <network-param-editor :network="(project.network as Network)">
            <template #nodes>
              <slot name="nodes" />
            </template>
          </network-param-editor>
        </slot>
      </template>

      <template v-else-if="projectStore.state.controllerView === 'kernel'">
        <slot name="simulationKernel">
          <simulation-kernel-editor
            :simulation="(project.simulation as Simulation)"
          />
        </slot>
      </template>

      <template
        v-else-if="
          appSessionStore.state.devMode && projectStore.state.controllerView === 'raw'
        "
      >
        <codemirror
          :extensions="extensions"
          :modelValue="projectJSON"
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

  <v-bottom-navigation
    :active="projectStore.state.bottomOpen"
    :height="projectStore.state.bottomNavHeight"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    class="d-print-none"
  >
    <div @mousedown="resizeBottomNav" class="resize-handle bottom" />
    <slot name="simulationCodeMirror">
      <simulation-code-mirror
        :simulation="(project.simulation as Simulation)"
      />
    </slot>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";

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

import { useAppSessionStore } from "@/stores/appSessionStore";
const appSessionStore = useAppSessionStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const props = defineProps({
  store: { required: true, type: Object },
});

const projectStore = computed(() => props.store);
const project = computed(() => projectStore.value?.state.project as Project);

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

/**
 * Resize bottom nav.
 */
const resizeBottomNav = () => {
  navStore.state.resizing = true;
  window.addEventListener("mousemove", handleBottomNavMouseMove);
  window.addEventListener("mouseup", handleBottomNavMouseUp);
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleBottomNavMouseMove = (e: MouseEvent) => {
  projectStore.value.state.bottomNavHeight = window.innerHeight - e.clientY;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleSideControllerMouseMove = (e: MouseEvent) => {
  projectStore.value.state.controllerWidth = window.innerWidth - e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleSideControllerMouseUp = () => {
  navStore.state.resizing = false;
  window.removeEventListener("mousemove", handleSideControllerMouseMove);
  window.removeEventListener("mouseup", handleSideControllerMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleBottomNavMouseUp = () => {
  navStore.state.resizing = false;
  window.removeEventListener("mousemove", handleBottomNavMouseMove);
  window.removeEventListener("mouseup", handleBottomNavMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize side controller.
 */
const resizeSideController = () => {
  navStore.state.resizing = true;
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
