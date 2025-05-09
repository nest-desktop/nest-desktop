<template>
  <v-navigation-drawer class="d-print-none full-height" location="right" permanent rail>
    <v-tabs
      :mandatory="false"
      :model-value="projectViewStore.state.views.controller"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        v-for="(item, index) in controllerItems"
        v-show="item.show !== 'dev' || (item.show === 'dev' && appStore.state.devMode)"
        :key="index"
        :ripple="false"
        :value="item.id"
        class="justify-center"
        height="76"
        min-width="0"
        @click.stop="projectViewStore.toggleController(item)"
      >
        <v-icon class="ma-1" size="large" v-bind="item.icon" />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :icon="projectViewStore.state.bottomNav.active ? 'mdi:mdi-arrow-expand-down' : 'mdi:mdi-arrow-expand-up'"
          value="code"
          variant="plain"
          @click.stop="projectViewStore.toggleBottomNav()"
        />
      </v-row>
    </template>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="projectViewStore.state.controller.open"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="projectViewStore.state.controller.width"
    class="d-print-none"
    location="right"
    permanent
    @transitionend="projectViewStore.dispatchWindowResize()"
  >
    <div class="resize-handle left" @mousedown="projectViewStore.resizeRightNav()" />

    <div :key="projectStore.state.projectId">
      <template v-if="projectViewStore.state.views.controller === 'network'">
        <slot name="network">
          <NetworkSpecEditor :network="(project.network as BaseNetwork)">
            <template #model>
              <slot name="model" />
            </template>
            <template #nodes>
              <slot name="nodes" />
            </template>
          </NetworkSpecEditor>
        </slot>
      </template>

      <template v-else-if="projectViewStore.state.views.controller === 'kernel'">
        <slot name="simulationKernel">
          <SimulationKernelEditor :simulation="(project.simulation as BaseSimulation)" />
        </slot>
      </template>

      <template v-else-if="appStore.state.devMode && projectViewStore.state.views.controller === 'data'">
        <v-tabs v-model="tab" density="compact">
          <v-tab value="doc"> DB doc </v-tab>
          <v-tab value="json"> json </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item reverse-transition="no-transition" transition="no-transition" value="doc">
            <codemirror
              :extensions="extensions"
              :model-value="projectDoc"
              disabled
              style="font-size: 0.75rem; width: 100%"
            />
          </v-window-item>

          <v-window-item reverse-transition="no-transition" transition="no-transition" value="json">
            <codemirror
              :extensions="extensions"
              :model-value="projectJSON"
              disabled
              style="font-size: 0.75rem; width: 100%"
            />
          </v-window-item>
        </v-window>
      </template>

      <template v-else-if="projectViewStore.state.views.controller === 'code'">
        <slot name="codeEditor">
          <CodeEditor :code="project.code" />
        </slot>
      </template>

      <template v-else-if="projectViewStore.state.views.controller === 'activity'">
        <slot name="activityController">
          <ActivityChartController :graph="(project.activityGraph.activityChartGraph as ActivityChartGraph)" />
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
    class="no-print"
    location="bottom"
    @transitionend="projectViewStore.dispatchWindowResize()"
  >
    <div class="resize-handle bottom" @mousedown="projectViewStore.resizeBottomNav()" />

    <slot name="bottomCodeMirror">
      <CodeMirror :code="project.code" />
    </slot>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror";
import { Extension } from "@codemirror/state";
import { computed, ref } from "vue";

import ActivityChartController from "../activityChart/ActivityChartController.vue";
import ActivityStats from "../activityStats/ActivityStats.vue";
import CodeEditor from "../code/CodeEditor.vue";
import CodeMirror from "../code/CodeMirror.vue";
import NetworkSpecEditor from "../network/NetworkSpecEditor.vue";
import SimulationKernelEditor from "../simulation/SimulationKernelEditor.vue";
import { Activities } from "@/helpers/activity/activities";
import { ActivityChartGraph } from "@/helpers/activityGraph/activityChartGraph/activityChartGraph";
import { BaseNetwork } from "@/helpers/network/network";
import { BaseSimulation } from "@/helpers/simulation/simulation";
import { basicSetup, languageJSON, oneDark } from "@/plugins/codemirror";
import { darkMode } from "@/helpers/common/theme";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const projectStore = computed(() => appStore.currentWorkspace.stores.projectStore);
const project = computed(() => projectStore.value.state.project);
const projectViewStore = computed(() => appStore.currentWorkspace.views.project);

const projectDoc = computed(() => JSON.stringify(project.value.doc, null, 2));

const projectJSON = computed(() => JSON.stringify(project.value.toJSON(), null, 2));

const tab = ref("doc");

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
    id: "data",
    icon: {
      icon: "mdi:mdi-code-json",
    },
    show: "dev",
    title: "View data",
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
