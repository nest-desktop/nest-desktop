<template>
  <v-row v-if="!synapse.connection.view.connectRecorder()" class="syn-spec mx-1" no-gutters>
    <v-list density="compact" width="100%">
      <v-list-item class="param pl-0 pr-1">
        <ValueSlider
          :model-value="(synapse.params.weight.state.value as number)"
          :thumb-color="synapse.connection.sourceNode.view.color"
          v-bind="weightOptions"
          @update:model-value="update"
        />

        <template #append>
          <Menu :items />
        </template>
      </v-list-item>
    </v-list>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Menu from "../common/Menu.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { TSynapse } from "@/types";

const props = defineProps<{ synapse: TSynapse }>();
const synapse = computed(() => props.synapse);

const update = (value: number) => {
  synapse.value.params.weight.state.value = value;
  synapse.value.changes();
};

const weightOptions = {
  id: "weight",
  component: "valueSlider",
  label: "synaptic weight",
  max: 10,
  min: -10,
  step: 0.01,
  unit: "pA",
  value: 1,
};

const items = [
  {
    id: "paramsReset",
    onClick: () => {
      synapse.value.reset();
      synapse.value.changes({ preventSimulation: true });
    },
    prependIcon: "mdi:mdi-restart",
    title: "Reset synaptic weight",
    show: () => true,
  },
  {
    id: "weightInverse",
    onClick: () => {
      synapse.value.inverseWeight();
    },
    prependIcon: "mdi:mdi-contrast",
    title: "Inverse synaptic weight",
  },
];
</script>

<style lang="scss">
.syn-spec {
  .menu {
    opacity: 0;
  }

  &:hover {
    .menu {
      opacity: 1;
    }
  }
}
</style>
