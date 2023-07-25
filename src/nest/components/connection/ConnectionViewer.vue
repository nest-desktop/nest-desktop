<template>
  <v-expansion-panel class="node-connection" elevation="0" rounded="0">
    <v-expansion-panel-title style="min-height: 52px; height: 52px">
      <v-row no-gutters>
        <div style="pointer-events: none">
          <v-btn icon size="small">
            <node-avatar
              :color="connection.source.view.color"
              :elementType="connection.source.model.elementType"
              :label="connection.source.view.label"
              :weight="connection.source.view.weight"
              size="32px"
            />
          </v-btn>
          <v-btn
            :color="connection.synapse.weight > 0 ? 'blue' : 'red'"
            :icon="`nest:synapse-${
              connection.synapse.weight > 0 ? 'excitatory' : 'inhibitory'
            }`"
            size="small"
            variant="text"
          />
          <v-btn icon size="small">
            <node-avatar
              :color="connection.target.view.color"
              :elementType="connection.target.model.elementType"
              :label="connection.target.view.label"
              :weight="connection.target.view.weight"
              size="32px"
            />
          </v-btn>
        </div>
        <v-spacer />
        <div class="d-flex justify-center align-center text-grey">
          {{ connection.rule.value }}
          <span v-if="connection.view.connectOnlyNeurons()">
            {{ connection.synapse.modelId }}
          </span>
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

            <node-param-viewer
              :color="connection.source.color"
              :options="param.options"
              v-model="param.value"
              :key="index"
              v-for="(param, index) in connection.synapse.params"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Connection } from "@nest/core/connection/connection";
import NodeAvatar from "@nest/components/node/avatar/NodeAvatar.vue";
import NodeParamViewer from "@nest/components/node/NodeParamViewer.vue";

const props = defineProps({
  connection: Connection,
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
