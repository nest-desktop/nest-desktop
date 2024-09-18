<template>
  <v-row
    class="syn-spec mx-1"
    no-gutters
    v-if="!synapse.connection.view.connectRecorder()"
  >
    <v-list density="compact" width="100%">
      <v-list-item class="param pl-0 pr-1">
        <ValueSlider
          :model-value="(synapse.params.weight.state.value as number)"
          :thumbColor="synapse.connection.sourceNode.view.color"
          @update:model-value="update"
          v-bind="weightOptions"
        />

        <template #append>
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                class="rounded-circle"
                color="primary"
                icon="mdi:mdi-dots-vertical"
                size="small"
                variant="text"
                v-bind="props"
              />
            </template>

            <v-list density="compact">
              <v-list-item
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
        </template>
      </v-list-item>
    </v-list>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from "vue";

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
    icon: "mdi:mdi-restart",
    title: "Reset synaptic weight",
    onClick: () => {
      synapse.value.reset();
    },
    show: () => true,
  },
  {
    id: "weightInverse",
    icon: "mdi:mdi-contrast",
    title: "Inverse synaptic weight",
    onClick: () => {
      synapse.value.inverseWeight();
    },
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
