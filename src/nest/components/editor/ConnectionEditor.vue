<template>
  <v-expansion-panel class="node-connection" elevation="0" rounded="0">
    <v-expansion-panel-title style="min-height: 52px; height: 52px">
      <v-row no-gutters>
        <div style="pointer-events:none">
          <v-btn icon size="small">
            <node-avatar
              :color="state.connection.source.view.color"
              :elementType="state.connection.source.model.elementType"
              :label="state.connection.source.view.label"
              :weight="state.connection.source.view.weight"
              size="32px"
            />
          </v-btn>
          <v-btn
            :color="state.connection.synapse.weight > 0 ? 'blue' : 'red'"
            :icon="`nest:synapse-${
              state.connection.synapse.weight > 0 ? 'excitatory' : 'inhibitory'
            }`"
            size="small"
            variant="text"
          />
          <v-btn icon size="small">
            <node-avatar
              :color="state.connection.target.view.color"
              :elementType="state.connection.target.model.elementType"
              :label="state.connection.target.view.label"
              :weight="state.connection.target.view.weight"
              size="32px"
            />
          </v-btn>
        </div>
        <v-spacer />
        <div class="d-flex justify-center align-center text-grey">
          {{ state.connection.params.rule }}
          {{ state.connection.synapse.modelId }}
        </div>
        <v-spacer />
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="pa-0">
      <v-card variant="flat" class="ma-0">
        <v-card-title>
          <v-select
            :items="rules"
            hide-details
            density="compact"
            label="Connection rule"
            variant="outlined"
            v-model="state.connection.rule"
          />
        </v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item
              :key="index"
              v-for="(param, index) in state.connection.params"
            >
              {{ param.id }}
            </v-list-item>
            <node-param-editor
              :color="state.connection.source.color"
              :options="param.options"
              v-model="param.value"
              :key="index"
              v-for="(param, index) in state.connection.synapse.params"
            />
            <!-- <node-param-editor
              :color="state.target.color"
              :options="weightOptions"
              v-model="state.synSpec.weight"
            />
            <node-param-editor
              :color="state.target.color"
              :options="delayOptions"
              v-model="state.synSpec.delay"
            /> -->
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

import NodeAvatar from "../avatar/NodeAvatar.vue";
import NodeParamEditor from "./NodeParamEditor.vue";
import { Connection } from "@/nest/core/connection/connection";

const props = defineProps({
  connection: { type: Connection, required: true },
});

const state = reactive({
  connection: props.connection as Connection,
});

const rules = [
  { title: "all to all", value: "all_to_all" },
  { title: "one to one", value: "one_to_one" },
  { title: "fixed indegree", value: "fixed_indegree" },
  { title: "fixed outdegree", value: "fixed_outdegree" },
  { title: "pairwise Bernoulli", value: "pairwise_bernoulli" },
];

const update = () => {
  state.connection = props.connection as Connection;
};

watch(() => [props.connection], update);
onMounted(update);
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
