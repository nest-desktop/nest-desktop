<template>
  <v-navigation-drawer location="right" permanent rail>
    <v-tabs
      :model-value="modelViewStore.state.views.controller"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        v-for="(item, index) in controllerItems"
        v-show="item.show !== 'dev' || (item.show === 'dev' && appStore.state.devMode)"
        :key="index"
        :disabled="!modelStore.model.isNeuron && item.id === 'code'"
        :ripple="false"
        :value="modelViewStore.state.controller.open ? item.id : null"
        class="justify-center"
        height="76"
        min-width="0"
        @click.stop="modelViewStore.toggleController(item)"
      >
        <v-icon class="ma-1" size="large" v-bind="item.icon" />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :icon="modelViewStore.state.bottomNav.active ? 'mdi:mdi-arrow-expand-down' : 'mdi:mdi-arrow-expand-up'"
          value="code"
          variant="plain"
          @click.stop="modelViewStore.toggleBottomNav()"
        />
      </v-row>
    </template>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="modelViewStore.state.controller.open"
    :width="modelViewStore.state.controller.width"
    location="right"
    permanent
    @transitionend="modelViewStore.dispatchWindowResize()"
  >
    <div class="resize-handle left" @mousedown="modelViewStore.resizeRightNav()" />

    <template v-if="modelViewStore.state.views.controller === 'specs'">
      <v-toolbar color="transparent" density="compact" title="Model specifications" />

      <v-list>
        <v-list-subheader>States</v-list-subheader>
        <ParamViewer
          v-for="(state, index) in modelStore.model.states"
          :key="index"
          :param="(state as TModelParameter)"
        />
      </v-list>

      <v-list>
        <v-list-subheader>Parameters</v-list-subheader>
        <ParamViewer v-for="(param, index) in modelParams" :key="index" :param="(param as TModelParameter)" />
      </v-list>
    </template>

    <template v-if="modelViewStore.state.views.controller === 'params'">
      <!-- <template v-if="modelStore.model.isNeuron">
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
            <ParamListItem
              :key="index"
              :param="neuron.params[paramId]"
              v-for="(paramId, index) in neuron.paramsVisible"
            >
              <template #append>
                <Menu :items="paramMenuItems(param)" size="x-small" />
              </template>
            </ParamListItem>
          </v-list>
        </v-card>
      </template> -->

      <v-toolbar color="transparent" density="compact" title="Default parameter values">
        <template #append>
          <v-btn icon size="small" title="reset all param values" @click="resetAllParamValues()">
            <v-icon class="mdi-flip-h" icon="mdi:mdi-reload" />
          </v-btn>
        </template>
      </v-toolbar>

      <v-list>
        <ParamListItem
          v-for="(param, index) in modelParams"
          :key="index"
          :param="(param as TModelParameter)"
          @update:param-value="updateCode()"
        >
          <template #append>
            <Menu :items="paramMenuItems(param as TModelParameter)" size="x-small" />
          </template>
        </ParamListItem>
      </v-list>

      <v-card-actions>
        <v-btn text="apply params for simulation" @click="updateCode()" />
      </v-card-actions>
    </template>

    <template v-else-if="appStore.state.devMode && modelViewStore.state.views.controller === 'raw'">
      <codemirror :extensions="extensions" :model-value="modelJSON" disabled style="font-size: 0.75rem; width: 100%" />
    </template>

    <template v-if="modelViewStore.state.views.controller === 'code'">
      <slot name="codeEditor">
        <CodeEditor v-if="modelStore.state.project" :code="modelStore.state.project.code" />
      </slot>
    </template>

    <template v-else-if="modelViewStore.state.views.controller === 'activity'">
      <slot name="activityController">
        <ActivityChartController
          :graph="(modelStore.state.project.activityGraph.activityChartGraph as ActivityChartGraph)"
        />
      </slot>
    </template>
  </v-navigation-drawer>

  <v-bottom-navigation
    :active="modelViewStore.state.bottomNav.active"
    :height="modelViewStore.state.bottomNav.height"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    class="no-print"
    location="bottom"
    @transitionend="modelViewStore.dispatchWindowResize()"
  >
    <div class="resize-handle bottom" @mousedown="modelViewStore.resizeBottomNav()" />

    <slot name="bottomCodeMirror">
      <CodeMirror v-if="modelStore.state.project" :code="modelStore.state.project.code" />
    </slot>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror";
import { Extension } from "@codemirror/state";
import { computed } from "vue";

import ActivityChartController from "../activityChart/ActivityChartController.vue";
import CodeEditor from "../code/CodeEditor.vue";
import CodeMirror from "../code/CodeMirror.vue";
import Menu from "../common/Menu.vue";
import ParamListItem from "../parameter/ParamListItem.vue";
import ParamViewer from "../parameter/ParamViewer.vue";
import { ActivityChartGraph } from "@/helpers/activityGraph/activityChartGraph/activityChartGraph";
import { TModelParameter, TNode } from "@/types";
import { TParamValue } from "@/helpers/common/parameter";
import { basicSetup, languageJSON, oneDark } from "@/plugins/codemirror";
import { darkMode } from "@/helpers/common/theme";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const modelStore = computed(() => appStore.currentWorkspace.stores.modelStore);
const modelViewStore = computed(() => appStore.currentWorkspace.views.model);

const modelParams = computed(() => modelStore.value.model.paramsAll);

const modelJSON = computed(() => JSON.stringify(modelStore.value.model.toJSON(), null, 2));

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

const paramMenuItems = (param: TModelParameter) => [
  {
    icon: { class: "mdi-flip-h", icon: "mdi:mdi-reload" },
    onClick: () => {
      param.value = param.props.value as TParamValue;
      param.changes();
    },
    title: "Reset value",
  },
];

const resetAllParamValues = () => {
  modelParams.value.forEach((param: TModelParameter) => {
    param.value = param.props.value as TParamValue;
  });
  modelStore.value.model.changes();
};

const updateCode = () => {
  const neurons = modelStore.value.state.project.network.nodes.neurons;
  neurons.forEach((neuron: TNode) => {
    const modelParams = modelStore.value.model.params;
    neuron.paramsVisible.forEach((paramKey: string) => {
      neuron.params[paramKey].state.value = modelParams[paramKey].value;
    });
  });
  modelStore.value.state.project.changes();
};

//
// CodeMirror
//

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
</style>
