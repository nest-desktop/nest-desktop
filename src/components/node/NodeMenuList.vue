<template>
  <Card :color="node.view.color">
    <v-list density="compact">
      <slot name="prependItem" :node />

      <v-list-item
        :key="index"
        v-bind="item"
        v-for="(item, index) in items"
        v-show="item.show ? item.show() : true"
      >
        <template #prepend v-if="item.icon">
          <v-icon v-bind="item.icon" />
        </template>
      </v-list-item>

      <slot name="appendItem" :node />
    </v-list>
  </Card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { createDialog } from "vuetify3-dialog";

import Card from "../common/Card.vue";
import ExportEventsDialog from "../dialog/ExportEventsDialog.vue";
import NodeColorDialog from "../dialog/NodeColorDialog.vue";
import { TNode } from "@/types";
import { confirmDialog } from "@/helpers/common/confirmDialog";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();
const graph = computed(() => networkGraphStore.state.graph);

const props = defineProps<{ node?: TNode }>();
const node = computed(
  () => (props.node || graph.value?.state.contextMenu.node) as TNode
);

const items: {
  icon?: { icon: string; class: string };
  id: string;
  onClick: () => void;
  prependIcon?: string;
  title: string;
  show?: () => boolean | undefined;
}[] = [
  {
    icon: { icon: "mdi:mdi-reload", class: "mdi-flip-h" },
    id: "paramsReset",
    onClick: () => {
      node.value?.resetParams();
    },
    title: "Reset all parameters",
  },
  {
    id: "nodeColor",
    onClick: () => {
      createDialog({
        customComponent: {
          component: NodeColorDialog,
          props: { node: node.value },
        },
        dialogOptions: {
          width: "300px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-format-color-fill",
    title: "Colorize node",
  },
  {
    id: "nodeClone",
    onClick: () => {
      node.value?.clone();
      node.value?.changes();
    },
    prependIcon: "mdi:mdi-content-copy",
    title: "Clone node",
  },
  {
    id: "eventsExport",
    onClick: () => {
      createDialog({
        customComponent: {
          component: ExportEventsDialog,
          props: { node: node.value },
        },
        dialogOptions: {
          width: "300px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-download",
    show: () =>
      node.value?.model.isRecorder &&
      node.value?.activity &&
      node.value?.activity.hasEvents,
    title: "Export events",
  },
  {
    id: "nodeDelete",
    onClick: () => {
      confirmDialog({
        text: "Are you sure to delete node?",
        title: "Delete node?",
      }).then((answer: boolean) => {
        if (answer) node.value?.remove();
      });
    },
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete node",
  },
];
</script>
