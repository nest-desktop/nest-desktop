<template>
  <v-navigation-drawer
    class="d-print-none full-height"
    location="right"
    permanent
    rail
  >
    <v-tabs
      :mandatory="false"
      :model-value="projectViewStore.state.views.controller"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        :key="index"
        :ripple="false"
        :value="item.id"
        @click.stop="projectViewStore.toggleController(item)"
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

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :icon="
            projectViewStore.state.bottomNav.active
              ? 'mdi:mdi-arrow-expand-down'
              : 'mdi:mdi-arrow-expand-up'
          "
          @click.stop="projectViewStore.toggleBottomNav()"
          value="code"
          variant="plain"
        />
      </v-row>
    </template>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="projectViewStore.state.controller.open"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="projectViewStore.state.controller.width"
    @transitionend="projectViewStore.dispatchWindowResize()"
    class="d-print-none"
    location="right"
    permanent
  >
    <div
      @mousedown="projectViewStore.resizeRightNav()"
      class="resize-handle left"
    />

    <div :key="projectStore.state.projectId">
      <template v-if="projectViewStore.state.views.controller === 'network'">
        <slot name="network">
          <NetworkSpecEditor :network="(project.network as BaseNetwork)">
            <template #model><slot name="model" /></template>
            <template #nodes><slot name="nodes" /></template>
          </NetworkSpecEditor>
        </slot>
      </template>

      <template
        v-else-if="projectViewStore.state.views.controller === 'kernel'"
      >
        <slot name="simulationKernel">
          <SimulationKernelEditor
            :simulation="(project.simulation as BaseSimulation)"
          />
        </slot>
      </template>

      <template
        v-else-if="
          appStore.state.devMode &&
          projectViewStore.state.views.controller === 'raw'
        "
      >
        <codemirror
          :extensions="extensions"
          :model-value="projectJSON"
          disabled
          style="font-size: 0.75rem; width: 100%"
        />
      </template>

      <template v-else-if="projectViewStore.state.views.controller === 'code'">
        <slot name="simulationCodeEditor">
          <SimulationCodeEditor
            :simulation="(project.simulation as BaseSimulation)"
          />
        </slot>
      </template>

      <template
        v-else-if="projectViewStore.state.views.controller === 'activity'"
      >
        <slot name="activityController">
          <ActivityChartController
            :graph="(project.activityGraph.activityChartGraph as ActivityChartGraph)"
          />
        </slot>
      </template>

      <template v-else-if="projectViewStore.state.views.controller === 'stats'">
        <ActivityStats :activities="(project.activities as Activities)" />
      </template>
    </div>
  </v-navigation-drawer>

  <v-bottom-navigation
    :active="projectViewStore.state.bottomNav.active"
    :height="projectViewStore.state.bottomNav.height"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    @transitionend="projectViewStore.dispatchWindowResize()"
    class="no-print"
    location="bottom"
  >
    <div
      @mousedown="projectViewStore.resizeBottomNav()"
      class="resize-handle bottom"
    />

    <slot name="simulationCodeMirror">
      <SimulationCodeMirror
        :simulation="(project.simulation as BaseSimulation)"
      />
    </slot>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { Codemirror } from "vue-codemirror";
import { Extension } from "@codemirror/state";
import { computed } from "vue";

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
import { basicSetup, languageJSON, oneDark } from "@/plugins/codemirror";
import { darkMode } from "@/helpers/common/theme";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const projectStore = computed(
  () => appStore.currentSimulator.stores.projectStore
);
const project = computed(() => projectStore.value.state.project);
const projectViewStore = computed(
  () => appStore.currentSimulator.views.project
);

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

const extensions: Extension[] = [basicSetup, languageJSON()];

if (darkMode()) {
  extensions.push(oneDark);
}
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
