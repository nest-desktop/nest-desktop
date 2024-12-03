<template>
  <Card
    :color="connection.sourceNode.view.color"
    style="border-width: 0 0 0 4px !important"
  >
    <v-list density="compact">
      <slot
        name="prependItem"
        :connection
      />

      <v-list-item
        v-for="(item, index) in items"
        v-show="item.show ? item.show() : true"
        :key="index"
        v-bind="item"
      >
        <template
          v-if="item.icon"
          #prepend
        >
          <v-icon v-bind="item.icon" />
        </template>
      </v-list-item>

      <slot
        name="appendItem"
        :connection
      />
    </v-list>
  </Card>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Card from "../common/Card.vue";
import { TConnection } from "@/types";
import { confirmDialog } from "@/helpers/common/confirmDialog";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);

const items: {
  icon?: { icon: string; class: string };
  id: string;
  onClick: () => void;
  prependIcon?: string;
  title: string;
  show?: () => boolean | undefined;
}[] = [
  {
    id: "connectionReset",
    onClick: () => {
      connection.value.reset();
      connection.value.synapse.reset();
    },
    prependIcon: "mdi:mdi-restart",
    title: "Reset connection",
  },
  // {
  //   id: "sourceSlice",
  //   icon: "mdi:mdi-code-brackets",
  //   title: "Toggle source slicing",
  //   onClick: () => {
  //     connection.value.sourceSlice.toggleVisible();
  //     connection.value.changes();
  //   },
  //   // show: () => state.connection.source.size > 1,
  // },
  // {
  //   id: "targetSlice",
  //   icon: "mdi:mdi-code-brackets",
  //   title: "Toggle target slicing",
  //   onClick: () => {
  //     connection.value.targetSlice.toggleVisible();
  //     connection.value.changes();
  //   },
  //   // show: () => state.connection.target.size > 1,
  // },
  {
    id: "connectionReverse",
    onClick: () => {
      connection.value.reverse();
      connection.value.changes();
    },
    prependIcon: "mdi:mdi-rotate-3d-variant",
    title: "Reverse connection",
  },
  {
    id: "weightInverse",
    onClick: () => {
      connection.value.synapse.inverseWeight();
    },
    prependIcon: "mdi:mdi-contrast",
    title: "Inverse synaptic weight",
  },
  {
    id: "connectionDelete",
    onClick: () => {
      confirmDialog({
        text: "Are you sure to delete connection?",
        title: "Delete connection?",
      }).then((answer: boolean) => {
        if (answer) connection.value.remove();
      });
    },
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete connection",
  },
];
</script>
