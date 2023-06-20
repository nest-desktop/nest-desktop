<template>
  <v-expansion-panel class="node-connection" elevation="0" rounded="0">
    <v-expansion-panel-title style="min-height: 52px; height: 52px">
      <v-row no-gutters>
        <div>
          <v-btn icon size="small">
            <node-avatar v-bind="state.source" />
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
            <node-avatar v-bind="state.target" />
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
        <v-card-text>
          <v-list>
            <node-param-viewer
              :options="pOptions"
              :value="state.connSpec.p"
              v-if="'p' in state.connSpec"
            />
            <node-param-viewer
              :options="weightOptions"
              :value="state.synSpec.weight"
            />
            <node-param-viewer
              :options="delayOptions"
              :value="state.synSpec.delay"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

import NodeAvatar from "../avatar/NodeAvatar.vue";
import NodeParamViewer from "./NodeParamViewer.vue";

const props = defineProps(["source", "target", "connSpec", "synSpec"]);

const state = reactive({
  source: { label: "", color: "", elementType: "", weight: "" },
  target: { label: "", color: "", elementType: "" },
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
  unit: "pA"
};

const delayOptions = {
  label: "synaptic delay",
  max: 10,
  min: 0,
  step: 0.1,
  unit: "ms",
};

const update = () => {
  state.source = props.source || state.source;
  state.target = props.target || state.target;
  state.connSpec = props.connSpec || state.connSpec;
  state.synSpec = props.synSpec || state.synSpec;
};

watch(() => [props.target], update);
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
