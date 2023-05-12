<template>
  <v-expansion-panel class="node-connection" elevation="0" rounded="0">
    <v-expansion-panel-title style="min-height: 52px; height: 52px">
      <v-row no-gutters>
        <div>
          <v-btn icon size="small">
            <node-avatar v-bind="state.sourceNode" />
          </v-btn>
          <v-btn
            :color="state.synSpec.weight > 0 ? 'blue' : 'red'"
            :icon="`nest:synapse-${
              state.synSpec.weight > 0 ? 'excitatory' : 'inhibitory'
            }`"
            size="small"
            variant="text"
          />
          <v-btn icon size="small">
          <node-avatar v-bind="state.targetNode" />
          </v-btn>
        </div>
        <v-spacer />
        <div class="d-flex justify-center align-center text-grey">
          {{ state.connSpec.rule }}
          {{ state.synSpec.model }}
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
            v-model="state.connSpec.rule"
          />
        </v-card-title>
        <v-card-text>
          <v-list>
            <node-param
              :color="state.targetNode.color"
              :options="pOptions"
              v-if="'p' in state.connSpec"
              v-model="state.connSpec.p"
            />
            <node-param
              :color="state.targetNode.color"
              :options="weightOptions"
              v-model="state.synSpec.weight"
            />
            <node-param
              :color="state.targetNode.color"
              :options="delayOptions"
              v-model="state.synSpec.delay"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

import NodeAvatar from "@/components/nest/avatar/NodeAvatar.vue";
import NodeParam from "@/components/nest/NodeParam.vue";

const props = defineProps(["sourceNode", "targetNode", "connSpec", "synSpec"]);

const state = reactive({
  sourceNode: { label: "", color: "", type: "", weight: "" },
  targetNode: { label: "", color: "", type: "" },
  connSpec: { rule: "all_to_all" },
  synSpec: { model: "static_synapse", weight: 1, delay: 1 },
});

const pOptions = {
  label: "connection probability",
  max: 1,
  min: 0,
  step: 0.1,
};

const weightOptions = {
  label: "synaptic weight",
  max: 10,
  min: -10,
  step: 0.1,
};

const delayOptions = {
  label: "synaptic delay",
  max: 10,
  min: 0,
  step: 0.1,
};

const rules = [
  { title: "all to all", value: "all_to_all" },
  { title: "one to one", value: "one_to_one" },
  { title: "fixed indegree", value: "fixed_indegree" },
  { title: "fixed outdegree", value: "fixed_outdegree" },
  { title: "pairwise Bernoulli", value: "pairwise_bernoulli" },
];

const update = () => {
  state.sourceNode = props.sourceNode || state.sourceNode;
  state.targetNode = props.targetNode || state.targetNode;
  state.connSpec = props.connSpec || state.connSpec;
  state.synSpec = props.synSpec || state.synSpec;
};

watch(() => [props.targetNode], update);
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
