<template>
  <v-expansion-panel
    :style="{
      opacity: connection.view.opacity ? 1 : 0.3,
    }"
    elevation="0"
    rounded="0"
    @mouseenter="connection.state.focus()"
    @mouseleave="connection.connections.unfocusConnection()"
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

        <Menu>
          <ConnectionMenuList :connection />
        </Menu>
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

<script setup lang="ts">
import { computed } from "vue";

import ConnectionAvatar from "./ConnectionAvatar.vue";
import ConnectionMenuList from "./ConnectionMenuList.vue";
import ConnectionSpecEditor from "./ConnectionSpecEditor.vue";
import Menu from "../common/Menu.vue";
import SynapseSpecEditor from "../synapse/SynapseSpecEditor.vue";
import { TConnection } from "@/types";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);
const synapse = computed(() => connection.value.synapse);
</script>
