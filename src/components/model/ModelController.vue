<template>
  <v-navigation-drawer location="right" permanent rail>
    <v-tabs
      :modelValue="modelStore.state.controller.view"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        v-for="(item, index) in items"
        :key="index"
        :ripple="false"
        :value="modelStore.state.controller.open ? item.id : null"
        class="justify-center"
        height="72"
        min-width="0"
        @click.stop="modelStore.toggle(item)"
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>
  </v-navigation-drawer>

  <v-navigation-drawer
    :modelValue="modelStore.state.controller.open"
    :width="modelStore.state.controller.width"
    @transitionend="dispatchWindowResize()"
    location="right"
    permanent
  >
    <div @mousedown="resizeRightNav()" class="resize-handle left" />

    <template v-if="modelStore.state.controller.view === 'defaults'">
      <v-toolbar
        color="transparent"
        density="compact"
        title="Model parameter defaults"
      />

      <v-list>
        <ModelParamViewer
          :key="index"
          :param="param as TModelParameter"
          v-for="(param, index) in modelParams"
        />
      </v-list>
    </template>

    <template v-if="modelStore.state.controller.view === 'params'">
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
          <NodeParamEditor
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

    <template v-if="modelStore.state.controller.view === 'code'">
      <slot name="simulationCodeEditor">
        <SimulationCodeEditor
          :simulation="(modelStore.state.project.simulation as BaseSimulation)"
          v-if="modelStore.state.project"
        />
      </slot>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, nextTick } from "vue";

import ModelParamViewer from "./ModelParamViewer.vue";
import NodeParamEditor from "../node/NodeParamEditor.vue";
import SimulationCodeEditor from "../simulation/SimulationCodeEditor.vue";
import { BaseSimulation } from "@/helpers/simulation/simulation";
import { TModelParameter } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const modelStore = computed(() => appStore.currentSimulator.stores.modelStore);

const modelParams = computed(() =>
  Object.values(modelStore.value.model.params)
);

const items = [
  {
    id: "defaults",
    icon: "mdi:mdi-format-list-numbered-rtl",
    title: "View defaults",
  },
  { id: "params", icon: "mdi:mdi-tune-variant", title: "Edit params" },
  { id: "code", icon: "mdi:mdi-xml" },
];

const setDefaults = () => {
  const neurons = modelStore.value.state.project.network.nodes.neurons;
  const neuron = neurons[0];
  const modelParams = modelStore.value.model.params;
  neuron.paramsVisible.forEach((paramKey: string) => {
    modelParams[paramKey].value = neuron.params[paramKey].value;
  });
};

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
