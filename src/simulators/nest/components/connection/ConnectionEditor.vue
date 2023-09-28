<template>
  <v-expansion-panel
    :readonly="
      connection.paramsVisible.length === 0 &&
      connection.synapse.paramsVisible.length === 0
    "
    class="node-connection"
    elevation="0"
    rounded="0"
  >
    <v-expansion-panel-title
      class="panel-title"
      style="min-height: 52px; height: 52px"
    >
      <v-row no-gutters>
        <div style="pointer-events: none">
          <v-btn icon size="small">
            <node-avatar :node="connection.source" size="32px" />
          </v-btn>
          <v-btn
            :color="connection.source.view.color"
            :icon="connection.synapse.icon"
            size="small"
            variant="text"
          />
          <v-btn icon size="small">
            <node-avatar :node="connection.target" size="32px" />
          </v-btn>
        </div>

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
              color="primary"
              icon="mdi-dots-vertical"
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
      <connection-spec-editor :connection="(connection as NESTConnection)" />
      <synapse-spec-editor :synapse="(connection.synapse as NESTSynapse)" />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";

import { NESTSynapse } from "@nest/helpers/synapse/nestSynapse";
import { NESTConnection } from "@nest/helpers/connection/nestConnection";

import SynapseSpecEditor from "../synapse/SynapseSpecEditor.vue";
import ConnectionSpecEditor from "./ConnectionSpecEditor.vue";

const props = defineProps({
  connection: NESTConnection,
});

const connection = computed(() => props.connection as NESTConnection);

const items = [
  {
    id: "connectionReset",
    icon: "mdi-restart",
    title: "Reset connection",
    onClick: () => {
      connection.value.reset();
      connection.value.synapse.reset();
      connection.value.synapse.hideAllParams();
    },
  },
  // {
  //   id: "sourceSlice",
  //   icon: "mdi-code-brackets",
  //   title: "Toggle source slicing",
  //   onClick: () => {
  //     connection.value.sourceSlice.toggleVisible();
  //     connection.value.changes();
  //   },
  //   // show: () => state.connection.source.size > 1,
  // },
  // {
  //   id: "targetSlice",
  //   icon: "mdi-code-brackets",
  //   title: "Toggle target slicing",
  //   onClick: () => {
  //     connection.value.targetSlice.toggleVisible();
  //     connection.value.changes();
  //   },
  //   // show: () => state.connection.target.size > 1,
  // },
  {
    id: "connectionReverse",
    icon: "mdi-rotate-3d-variant",
    title: "Reverse connection",
    onClick: () => {
      connection.value.reverse();
      connection.value.changes();
    },
  },
  {
    id: "weightInverse",
    icon: "mdi-contrast",
    title: "Inverse synaptic weight",
    onClick: () => {
      connection.value.synapse.inverseWeight();
    },
  },
  {
    id: "connectionDelete",
    icon: "mdi-trash-can-outline",
    title: "Delete connection",
    onClick: () => {
      connection.value.remove()
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
  }

  .panel-title:hover {
    .menu {
      opacity: 1;
    }
  }

  .v-expansion-panel-text__wrapper {
    padding: 0;
  }
}
</style>
