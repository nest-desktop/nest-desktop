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

        <div class="d-flex flex-column justify-center align-center text-grey">
          <div>{{ connection.rule.value }}</div>
          <div v-if="connection.view.connectOnlyNeurons()">
            {{ connection.synapse.modelId }}
          </div>
        </div>

        <v-spacer />

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              class="menu"
              color="primary"
              icon="mdi:mdi-dots-vertical"
              size="small"
              variant="text"
              v-bind="props"
            />
          </template>

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

import ConnectionAvatar from "@/components/connection/ConnectionAvatar.vue";
import ConnectionSpecEditor from "@/components/connection/ConnectionSpecEditor.vue";

import SynapseSpecEditor from "../synapse/SynapseSpecEditor.vue";
import { NESTConnection } from "../../helpers/connection/connection";

const props = defineProps<{ connection: NESTConnection }>();
const connection = computed(() => props.connection);
const synapse = computed(() => connection.value.synapse);

const items = [
  {
    id: "connectionReset",
    icon: "mdi:mdi-restart",
    title: "Reset connection",
    onClick: () => {
      connection.value.reset();
      synapse.value.reset();
      synapse.value.hideAllParams();
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
      synapse.value.inverseWeight();
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
