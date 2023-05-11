<template>
  <v-expansion-panel elevation="0" rounded="0">
    <v-expansion-panel-title
      style="height: 40px; min-height: 40px"
      v-slot="{ expanded }"
    >
      <v-row no-gutters>
        <div>
          <v-btn
            icon="mdi-ray-start-arrow"
            size="small"
            variant="text"
            v-if="state.synSpec.weight > 0"
          />
          <v-btn icon="mdi-ray-end" size="small" variant="text" v-else />
          <v-btn
            :color="state.targetNode.color"
            icon
            size="small"
            variant="text"
          >
            {{ state.targetNode.label }}
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
      <v-select
        :items="rules"
        hide-details
        density="compact"
        label="Connection rule"
        variant="outlined"
        v-model="state.connSpec.rule"
      />
      <slider v-model="state.connSpec.p" :options="pOptions" :color="state.targetNode.color" v-if="'p' in state.connSpec"/>
      <slider v-model="state.synSpec.weight" :options="weightOptions" :color="state.targetNode.color" />
      <slider v-model="state.synSpec.delay" :options="delayOptions" :color="state.targetNode.color" />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

import Slider from "@/components/common/Slider.vue";

const props = defineProps(["sourceNode", "targetNode", "connSpec", "synSpec"]);

const state = reactive({
  sourceNode: { label: "", color: "" },
  targetNode: { label: "", color: "" },
  connSpec: { rule: "all_to_all" },
  synSpec: { model: "static_synapse", weight: 1, delay: 1},
});

const pOptions = {
  label: 'connection probability',
  max: 1,
  min: 0,
  step: 0.1,
}


const weightOptions = {
  label: 'synaptic weight',
  max: 10,
  min: -10,
  step: 0.1,
}

const delayOptions = {
  label: 'synaptic delay',
  max: 10,
  min: 0,
  step: 0.1,
}

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
