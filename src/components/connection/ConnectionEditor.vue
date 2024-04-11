<template>
  <v-expansion-panel
    :style="{
      opacity: connection.view.opacity ? 1 : 0.3,
    }"
    @mouseenter="connection.state.focus()"
    @mouseleave="connection.connections.unfocusConnection()"
    class="node-connection"
    elevation="0"
    rounded="0"
  >
    <v-expansion-panel-title
      class="panel-title"
      style="min-height: 52px; height: 52px"
    >
      <v-row no-gutters>
        <ConnectionAvatar :connection />

        <v-spacer />

        <div class="d-flex flex-column justify-center align-center text-grey">
          <div>{{ connection.rule.value }}</div>
        </div>

        <v-spacer />

        <v-menu>
          <template #activator="{ props }">
            <v-btn
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

import ConnectionAvatar from "./ConnectionAvatar.vue";
import ConnectionSpecEditor from "@/components/connection/ConnectionSpecEditor.vue";
import SynapseSpecEditor from "@/components/synapse/SynapseSpecEditor.vue";
import { ConnectionComponentProps, TConnection } from "@/types/connectionTypes";
import { TSynapse } from "@/types/synapseTypes";

const props = defineProps({ connection: ConnectionComponentProps });

const connection = computed(() => props.connection as TConnection);
const synapse = computed(() => connection.value.synapse as TSynapse);

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

<style lang="scss">
.node-connection {
  .panel-title {
    .menu {
      opacity: 0;
    }

    &:hover {
      .menu {
        opacity: 1;
      }
    }
  }

  .v-expansion-panel-text__wrapper {
    padding: 0;
  }
}
</style>
