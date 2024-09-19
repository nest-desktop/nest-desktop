<template>
  <v-navigation-drawer location="right" permanent rail>
    <v-tabs
      :model-value="modelStore.state.controller.view"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        :disabled="!modelStore.model.isNeuron && item.id === 'code'"
        :key="index"
        :ripple="false"
        :value="modelStore.state.controller.open ? item.id : null"
        @click.stop="modelStore.toggleController(item)"
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
      :model-value="modelStore.state.controller.view"
      class="px-0 text-center"
      color="primary"
      density="compact"
    >
      <v-list-item
        :disabled="!modelStore.model.isNeuron && item.id === 'code'"
        :key="index"
        :value="item.id"
        @click.stop="modelStore.toggleController(item)"
        class="py-3 my-0 justify-center"
        v-for="(item, index) in controllerItems"
      >
        <v-icon :icon="item.icon" size="large" />
        <span class="text-button" style="font-size: 9px !important">
          {{ item.id }}
        </span>
      </v-list-item>
    </v-list> -->
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="modelStore.state.controller.open"
    :width="modelStore.state.controller.width"
    @transitionend="dispatchWindowResize()"
    location="right"
    permanent
  >
    <div @mousedown="resizeRightNav()" class="resize-handle left" />

    <template v-if="modelStore.state.controller.view === 'specs'">
      <v-toolbar
        color="transparent"
        density="compact"
        title="Model specifications"
      />

      <v-list>
        <v-list-subheader>Parameters</v-list-subheader>
        <ParamViewer
          :key="index"
          :param="(param as TModelParameter)"
          v-for="(param, index) in modelParams"
        />
      </v-list>

      <v-list>
        <v-list-subheader>Recordables / States</v-list-subheader>
        <ParamViewer
          :key="index"
          :param="(recordable as TModelParameter)"
          v-for="(recordable, index) in modelStore.model.recordables"
        />
      </v-list>
    </template>

    <template v-if="modelStore.state.controller.view === 'params'">
      <template v-if="modelStore.model.isNeuron">
        <v-toolbar
          color="transparent"
          density="compact"
          title="Model parameter for simulation"
        />

        <v-card
          :key="index"
          flat
          v-for="(neuron, index) in modelStore.state.project.network.nodes
            .neurons"
        >
          <v-list :key="neuron.modelId" v-if="neuron.paramsVisible.length > 0">
            <ParamEditor
              :key="index"
              :param="neuron.params[paramId]"
              v-for="(paramId, index) in neuron.paramsVisible"
            />
          </v-list>

          <v-card-actions>
            <v-btn @click="setDefaults()">set param values as defaults</v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <template v-else>
        <v-toolbar
          color="transparent"
          density="compact"
          title="Default values of model parameters"
        />

        <v-list>
          <ParamEditor
            :key="index"
            :param="(param as TModelParameter)"
            v-for="(param, index) in modelParams"
          />
        </v-list>
      </template>
    </template>

    <template
      v-else-if="
        appStore.state.devMode && modelStore.state.controller.view === 'raw'
      "
    >
      <codemirror
        :extensions="extensions"
        :model-value="modelJSON"
        disabled
        style="font-size: 0.75rem; width: 100%"
      />
    </template>

    <template v-if="modelStore.state.controller.view === 'code'">
      <slot name="simulationCodeEditor">
        <SimulationCodeEditor
          :simulation="(modelStore.state.project.simulation as BaseSimulation)"
          v-if="modelStore.state.project"
        />
      </slot>
    </template>

    <template v-else-if="modelStore.state.controller.view === 'activity'">
      <slot name="activityController">
        <ActivityChartController
          :graph="(modelStore.state.project.activityGraph.activityChartGraph as ActivityChartGraph)"
        />
      </slot>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { Codemirror } from "vue-codemirror";
import { computed, nextTick } from "vue";
import { LanguageSupport } from "@codemirror/language";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

import ActivityChartController from "../activityChart/ActivityChartController.vue";
import ParamEditor from "../parameter/ParamEditor.vue";
import ParamViewer from "../parameter/ParamViewer.vue";
import SimulationCodeEditor from "../simulation/SimulationCodeEditor.vue";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";
import { BaseSimulation } from "@/helpers/simulation/simulation";
import { TModelParameter } from "@/types";
import { darkMode } from "@/helpers/common/theme";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const modelStore = computed(() => appStore.currentSimulator.stores.modelStore);

const modelParams = computed(() =>
  Object.values(modelStore.value.model.params)
);

const modelJSON = computed(() =>
  JSON.stringify(modelStore.value.model.toJSON(), null, 2)
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
    id: "specs",
    icon: {
      icon: "mdi:mdi-format-list-numbered-rtl",
    },
    title: "View model specifications",
  },
  {
    id: "params",
    icon: { icon: "mdi:mdi-tune-variant" },
    title: "Edit params",
  },
  {
    id: "raw",
    icon: {
      class: "",
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
];

const setDefaults = () => {
  const neurons = modelStore.value.state.project.network.nodes.neurons;
  const neuron = neurons[0];
  const modelParams = modelStore.value.model.params;
  neuron.paramsVisible.forEach((paramKey: string) => {
    modelParams[paramKey].value = neuron.params[paramKey].value;
  });
};

const extensions = [json()];

if (darkMode()) {
  extensions.push(oneDark as LanguageSupport);
}

const dispatchWindowResize = () => {
  nextTick(() => window.dispatchEvent(new Event("resize")));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleRightNavMouseMove = (e: MouseEvent) => {
  modelStore.value.state.controller.width = window.innerWidth - e.clientX - 64;
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
 * Resize side controller.
 */
const resizeRightNav = () => {
  navStore.state.resizing = true;
  window.addEventListener("mousemove", handleRightNavMouseMove);
  window.addEventListener("mouseup", handleRightNavMouseUp);
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
</style>
