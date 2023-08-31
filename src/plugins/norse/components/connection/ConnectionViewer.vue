<template>
  <v-expansion-panel class="node-connection" elevation="0" rounded="0">
    <v-expansion-panel-title style="min-height: 52px; height: 52px">
      <v-row no-gutters>
        <div style="pointer-events: none">
          <v-btn icon size="small">
            <node-avatar :node="connection.source" size="32px" />
          </v-btn>
          <v-btn
            :color="connection.source.view.color"
            icon="nest:synapse-excitatory"
            size="small"
            variant="text"
          />
          <v-btn icon size="small">
            <node-avatar :node="connection.target" size="32px" />
          </v-btn>
        </div>
        <v-spacer />
        <div class="d-flex justify-center align-center text-grey">
          {{ connection.rule.value }}
        </div>
        <v-spacer />
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="pa-0">
      <v-card variant="flat" class="ma-0">
        <v-card-text>
          <v-list>
            <v-list-item
              :key="index"
              v-for="(param, index) in connection.params"
            >
              {{ param.id }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import { Connection, ConnectionPropTypes } from "@/types/connectionTypes";

const props = defineProps({
  connection: ConnectionPropTypes,
});

const connection = computed(() => props.connection as Connection);
</script>

<style lang="scss">
.node-connection {
  .v-expansion-panel-text__wrapper {
    padding: 0;
  }

  .icon-size-1x {
    --v-icon-size-multiplier: 1;
  }

  .icon-size-1-8x {
    --v-icon-size-multiplier: 1.8;
  }

  .icon-size-2x {
    --v-icon-size-multiplier: 2;
  }

  .icon-size-3x {
    --v-icon-size-multiplier: 3;
  }
}
</style>
