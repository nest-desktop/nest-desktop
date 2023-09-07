<template>
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
    @update:modelValue="dispatchWindowResize"
    class="d-print-none"
    location="right"
    permanent
  >
    <div @mousedown="resizeSideController" class="resize-handle left" />

    <div :key="projectStore.projectId">
      <template v-if="projectStore.controllerView === 'network'">
        <slot name="networkParamEditor">
          <!-- <network-param-editor /> -->
        </slot>
      </template>

      <template v-else-if="projectStore.controllerView === 'kernel'">
        <slot name="simulationKernelEditor">
          <!-- <simulation-kernel-editor /> -->
        </slot>
      </template>

      <template
        v-else-if="appStore.devMode && projectStore.controllerView === 'raw'"
      >
        <codemirror
          :extensions="extensions"
          :model-value="projectJSON"
          disabled
          style="font-size: 0.75rem; width: 100%"
        />
      </template>

      <template v-else-if="projectStore.controllerView === 'code'">
        <slot name="simulationCodeEditor">
          <simulation-code-editor
            :simulation="(project.simulation as Simulation)"
          />
        </slot>
      </template>

      <template v-else-if="projectStore.controllerView === 'activity'">
        <activity-chart-controller
          :graph="(project.activityGraph.activityChartGraph as ActivityChartGraph)"
        />
      </template>

      <template v-else-if="projectStore.controllerView === 'stats'">
        <activity-stats :activities="(project.activities as Activities)" />
      </template>
    </div>
  </v-navigation-drawer>

  <v-bottom-navigation
    :active="projectStore.bottomOpen"
    :height="projectStore.bottomNavHeight"
    :style="{ transition: navStore.resizing ? 'initial' : '' }"
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
import SimulationCodeEditor from "@/components/simulation/SimulationCodeEditor.vue";
import SimulationCodeMirror from "@/components/simulation/SimulationCodeMirror.vue";
import { Activities } from "@/helpers/activity/activities";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";
import { Project } from "@/types/projectTypes";
import { Simulation } from "@/types/simulationTypes";

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/store/navStore";
const navStore = useNavStore();

const props = defineProps({
  store: { required: true, type: Object },
});

const projectStore = computed(() => props.store);
const project = computed(() => projectStore.value?.project as Project);

const projectJSON = computed(() =>
  JSON.stringify(project.value.toJSON(), null, 2)
);

const controllerItems = [
  { id: "network", icon: "nest:network", title: "Edit network" },
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
  navStore.resizing = true;
  window.addEventListener("mousemove", handleBottomNavMouseMove);
  window.addEventListener("mouseup", handleBottomNavMouseUp);
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleBottomNavMouseMove = (e: MouseEvent) => {
  projectStore.value.bottomNavHeight = window.innerHeight - e.clientY;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleSideControllerMouseMove = (e: MouseEvent) => {
  projectStore.value.controllerWidth = window.innerWidth - e.clientX - 64;
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
