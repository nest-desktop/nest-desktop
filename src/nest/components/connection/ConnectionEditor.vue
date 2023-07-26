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

        <div class="d-flex flex-column justify-center align-center text-grey">
          <div>{{ connection.rule.value }}</div>
          <div v-if="connection.view.connectOnlyNeurons()">
            {{ connection.synapse.modelId }}
          </div>
        </div>

        <v-spacer />

        <v-btn
          icon="mdi-dots-vertical"
          size="small"
          @click.stop="() => console.log('bing')"
        />
      </v-row>
    </v-expansion-panel-title>

    <v-expansion-panel-text class="ma-1">
      <v-row no-gutters class="mx-1">
        <v-select
          :disabled="
            connection.source.size === 1 && connection.target.size === 1
          "
          :items="rules"
          class="pa-1"
          density="compact"
          hide-details
          label="Connection rule"
          v-model="connection.rule.value"
          variant="outlined"
        />

        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              :disabled="Object.keys(connection.params).length === 0"
              class="ma-auto"
              color="primary"
              icon="mdi-order-bool-ascending-variant"
              size="small"
              v-bind="props"
              variant="text"
            />
          </template>

          <v-card>
            <v-card-text>
              <v-checkbox
                :color="connection.source.color"
                :key="index"
                :label="param.label"
                :value="param.id"
                density="compact"
                hide-details
                v-for="(param, index) in Object.values(connection.params)"
                v-model="connection.paramsVisible"
              >
                <template #append>
                  {{ param.id }}: {{ param.value }}
                  {{ param.unit }}
                </template>
              </v-checkbox>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-btn
          class="menu ma-auto"
          color="primary"
          icon="mdi-dots-vertical"
          size="small"
          variant="text"
        />
      </v-row>

      <v-list density="compact" v-if="connection.paramsVisible.length > 0">
        <connection-param-editor
          :key="index"
          :param="connection.params[paramId]"
          v-for="(paramId, index) in connection.paramsVisible"
        />
      </v-list>

      <v-row no-gutters class="mx-1" v-if="!connection.view.connectRecorder()">
        <v-select
          :disabled="connection.synapse.models.length < 2"
          :items="connection.synapse.models"
          class="pa-1"
          density="compact"
          hide-details
          item-title="label"
          item-value="id"
          label="Synapse model"
          v-model="connection.synapse.modelId"
          variant="outlined"
        />

        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              class="ma-auto"
              color="primary"
              icon="mdi-order-bool-ascending-variant"
              size="small"
              v-bind="props"
              variant="text"
            />
          </template>

          <v-card>
            <v-card-text>
              <v-checkbox
                :color="connection.source.color"
                :key="index"
                :label="param.label"
                :value="param.id"
                density="compact"
                hide-details
                v-for="(param, index) in Object.values(
                  connection.synapse.modelParams
                )"
                v-model="connection.synapse.paramsVisible"
              >
                <template #append>
                  {{ param.id }}: {{ param.value }}
                  {{ param.unit }}
                </template>
              </v-checkbox>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-btn
          class="ma-auto"
          color="primary"
          icon="mdi-dots-vertical"
          size="small"
          variant="text"
        />
      </v-row>

      <v-list
        density="compact"
        v-if="connection.synapse.paramsVisible.length > 0"
      >
        <synapse-param-editor
          :key="index"
          :param="connection.synapse.params[paramId]"
          v-for="(paramId, index) in connection.synapse.paramsVisible"
        />
      </v-list>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ConnectionParamEditor from "@nest/components/connection/ConnectionParamEditor.vue";
import NodeAvatar from "@nest/components/node/avatar/NodeAvatar.vue";
import SynapseParamEditor from "@nest/components/connection/SynapseParamEditor.vue";
import { Connection } from "@nest/core/connection/connection";

const props = defineProps({
  connection: Connection,
});

const connection = computed(() => props.connection as Connection);

const rules = [
  { title: "all to all", value: "all_to_all" },
  { title: "one to one", value: "one_to_one" },
  { title: "fixed indegree", value: "fixed_indegree" },
  { title: "fixed outdegree", value: "fixed_outdegree" },
  { title: "pairwise Bernoulli", value: "pairwise_bernoulli" },
];
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
