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
    <v-expansion-panel-title class="expansion-panel-title">
      <v-row no-gutters>
        <ConnectionAvatar :connection />

        <v-spacer />

        <div
          :text="connection.rule.value"
          class="d-flex flex-column justify-center align-center text-grey"
        />

        <v-spacer />

        <v-btn
          color="primary"
          icon="mdi:mdi-dots-vertical"
          size="small"
          variant="text"
          class="menu"
        />

        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item
              :icon="item.icon"
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in items"
            >
              <template #prepend>
                <v-icon :icon="item.icon" />
              </template>

              {{ item.title }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-expansion-panel-title>

    <v-expansion-panel-text class="ma-1">
      <ConnectionSpecEditor :connection />
      <SynapseSpecEditor :synapse />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ConnectionAvatar from "./ConnectionAvatar.vue";
import ConnectionSpecEditor from "./ConnectionSpecEditor.vue";
import SynapseSpecEditor from "../synapse/SynapseSpecEditor.vue";
import { TConnection } from "@/types";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);
const synapse = computed(() => connection.value.synapse);

const items = [
  {
    id: "connectionReset",
    icon: "mdi:mdi-restart",
    title: "Reset connection",
    onClick: () => {
      connection.value.reset();
      connection.value.synapse.reset();
    },
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
    icon: "mdi:mdi-rotate-3d-variant",
    title: "Reverse connection",
    onClick: () => {
      connection.value.reverse();
      connection.value.changes();
    },
  },
  {
    id: "weightInverse",
    icon: "mdi:mdi-contrast",
    title: "Inverse synaptic weight",
    onClick: () => {
      connection.value.synapse.inverseWeight();
    },
  },
  {
    id: "connectionDelete",
    icon: "mdi:mdi-trash-can-outline",
    title: "Delete connection",
    onClick: () => {
      connection.value.remove();
      // state.content = "connectionDelete";
    },
    append: true,
  },
];
</script>
