<template>
  <Card :color="nodeGroup.view.color" style="border-width: 0 0 0 4px !important">
    <v-list density="compact">
      <v-list-item v-for="(item, index) in items" v-show="item.show ? item.show() : true" :key="index" v-bind="item">
        <template v-if="item.icon" #prepend>
          <v-icon v-bind="item.icon" />
        </template>
      </v-list-item>

      <slot name="appendItem" :node-group />
    </v-list>
  </Card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { createDialog } from "vuetify3-dialog";

import Card from "../common/Card.vue";
import NodeColorDialog from "../dialog/NodeColorDialog.vue";
import { TNodeGroup } from "@/types";
import { confirmDialog } from "@/helpers/common/confirmDialog";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();

const props = defineProps<{ nodeGroup: TNodeGroup }>();
const nodeGroup = computed(() => props.nodeGroup);

const items: {
  icon?: { icon: string; class: string };
  id: string;
  onClick: () => void;
  prependIcon?: string;
  title: string;
  show?: () => boolean | undefined;
}[] = [
  {
    id: "nodeGroupColor",
    onClick: () => {
      createDialog({
        customComponent: {
          component: NodeColorDialog,
          props: { node: nodeGroup.value },
        },
        dialogOptions: {
          width: "300px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-format-color-fill",
    title: "Colorize node group",
  },
  {
    id: "nodeGroupClone",
    onClick: () => {
      const clonedNodeGroup = nodeGroup.value.clone();
      clonedNodeGroup.changes();
      networkGraphStore.state.graph.closeContextMenu();
    },
    prependIcon: "mdi:mdi-content-copy",
    title: "Clone node group",
  },
  {
    id: "nodeGroupDelete",
    onClick: () => {
      confirmDialog({
        text: "Are you sure to delete node group?",
        title: "Delete node group?",
      }).then((answer: boolean) => {
        if (answer) nodeGroup.value.remove();
      });
      // state.content = "nodeDelete";
    },
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete node group",
  },
];
</script>
