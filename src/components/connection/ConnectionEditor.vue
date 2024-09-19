<template>
  <v-expansion-panel
    :style="{
      opacity: connection.view.opacity ? 1 : 0.3,
    }"
    @mouseenter="connection.state.focus()"
    @mouseleave="connection.connections.unfocusConnection()"
    elevation="0"
    rounded="0"
  >
    <v-expansion-panel-title class="ma-0 pa-0 pr-3 pt-1 expansion-panel-title">
      <v-btn-group class="py-1 pr-2" style="width: 100%" variant="text">
        <ConnectionAvatar :connection class="my-auto ml-4" />

        <v-spacer />

        <slot name="panelTitle">
          <div class="d-flex flex-column justify-center align-center text-grey">
            {{ connection.rule.value }}
          </div>
        </slot>

        <v-spacer />

        <Menu :items class="rounded-circle" />
      </v-btn-group>
    </v-expansion-panel-title>

    <v-expansion-panel-text class="ma-1">
      <slot name="connectionSpecEditor">
        <ConnectionSpecEditor :connection />
      </slot>
      <slot name="synapseSpecEditor">
        <SynapseSpecEditor :synapse />
      </slot>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ConnectionAvatar from "./ConnectionAvatar.vue";
import ConnectionSpecEditor from "./ConnectionSpecEditor.vue";
import Menu from "../common/Menu.vue";
import SynapseSpecEditor from "../synapse/SynapseSpecEditor.vue";
import { TConnection } from "@/types";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);
const synapse = computed(() => connection.value.synapse);

const items = [
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
      connection.value.remove();
      // state.content = "connectionDelete";
    },
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete connection",
    append: true,
  },
];
</script>
