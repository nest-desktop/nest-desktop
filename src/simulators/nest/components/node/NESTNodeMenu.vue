<template>
  <NodeMenu :contextMenu :node>
    <template #prependItem="{ node }">
      <v-list-item v-if="!node.model?.isRecorder">
        <!-- <template #prepend>
            <v-icon icon="mdi:mdi-contrast" />
          </template> -->

        <v-checkbox
          :class="{
            'text-blue': node.view.state.synWeights === 'excitatory',
            'text-red': node.view.state.synWeights === 'inhibitory',
          }"
          :indeterminate="!node.view.state.synWeights"
          :model-value="node.view.state.synWeights"
          @update:model-value="(value) => updateSynWeights(node as NESTNode, value)"
          density="compact"
          false-icon="mdi:mdi-minus"
          false-value="inhibitory"
          hide-details
          indeterminate-icon="mdi:mdi-plus-minus-variant"
          true-icon="mdi:mdi-plus"
          true-value="excitatory"
        >
          <template #label>
            <span class="ml-7">Set all synaptic weights</span>
          </template>
        </v-checkbox>
      </v-list-item>
    </template>
  </NodeMenu>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import NodeMenu from "@/components/node/NodeMenu.vue";

import { NESTNode } from "../../helpers/node/node";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();
const graph = computed(() => networkGraphStore.state.graph);

const props = defineProps({
  contextMenu: { default: false, type: Boolean },
  node: NESTNode,
});
const node = computed(() => props.node as NESTNode);
const contextMenu = computed(() => (props.contextMenu ? true : false));

const state = reactive({
  spatialNode: false,
});

const items = [
  // {
  //   icon: "mdi:mdi-pencil",
  //   id: "paramEdit",
  //   onClick: () => {
  //     state.content = "nodeParamEdit";
  //     window.dispatchEvent(new Event("resize"));
  //   },
  //   append: true,
  //   show: () => true,
  //   title: "Edit parameters",
  // },
  {
    icon: {
      class: "mdi-flip-h",
      icon: "mdi:mdi-reload",
    },
    id: "resetParams",
    onClick: () => {
      node.value.resetParams();
      closeMenu();
    },
    append: false,
    show: () => true,
    title: "Reset all parameters",
  },
  {
    prependIcon: "mdi:mdi-axis-arrow",
    id: "nodeSpatial",
    input: "switch",
    onClick: () => {
      node.value.toggleSpatial();
    },
    show: () => !node.value.model?.isRecorder,
    title: "Toggle spatial mode",
    value: "spatialNode",
  },
  {
    prependIcon: "mdi:mdi-format-color-fill",
    id: "nodeColor",
    onClick: () => {
      state.content = "nodeColor";
      window.dispatchEvent(new Event("resize"));
    },
    append: true,
    show: () => true,
    title: "Colorize node",
  },
  {
    prependIcon: "mdi:mdi-information-outline",
    id: "modelDoc",
    onClick: () => {
      state.dialog = true;
    },
    show: () => node.value.modelId !== "voltmeter",
    title: "Model documentation",
  },
  {
    prependIcon: "mdi:mdi-content-copy",
    id: "nodeClone",
    onClick: () => {
      node.value.clone();
      node.value.changes();
      closeMenu();
    },
    show: () => true,
    title: "Clone node",
  },
  // {
  //   icon: "network:synapse-excitatory",
  //   id: "setSynWeights",
  //   onClick: () => {
  //     state.content = "synWeights";
  //   },
  //   append: true,
  //   show: () => true,
  //   title: "Set synaptic weights",
  // },
  {
    prependIcon: "mdi:mdi-download",
    id: "eventsExport",
    onClick: () => {
      state.content = "eventsExport";
    },
    show: () =>
      node.value.model?.isRecorder &&
      node.value.activity &&
      node.value.activity.hasEvents,
    title: "Export events",
    append: true,
  },
  {
    prependIcon: "mdi:mdi-trash-can-outline",
    id: "nodeDelete",
    onClick: () => {
      createDialog({
        buttons: [
          { title: "no", key: "no" },
          { title: "yes", key: "yes" },
        ],
        text: "Are you sure to delete node?",
        title: "Delete node?",
      }).then((answer: string) => {
        if (answer === "yes") {
          node.value.remove();
        }
      });
    },
    show: () => true,
    title: "Delete node",
  },
];

/**
 * Update states.
 */
const updateStates = () => {
  if (!node.value) return;

  state.spatialNode = node.value.spatial.hasPositions;
};

/**
 * Update synaptic weights.
 *
 * @param value string
 */
const updateSynWeights = (node: NESTNode, value: string | null) => {
  if (value == null) return;

  node.view.synWeights = value;

  node.changes();
  graph.value?.render();
};
</script>
