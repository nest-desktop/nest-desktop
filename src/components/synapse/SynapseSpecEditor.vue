<template>
  <v-row
    class="syn-spec mx-1"
    no-gutters
    v-if="!synapse.connection.view.connectRecorder()"
  >
    <v-list density="compact" width="100%">
      <v-list-item class="param pl-0 pr-1">
        <value-slider
          :modelValue="(synapse.weight as number)"
          :thumbColor="synapse.connection.source.view.color"
          @update:modelValue="update"
          v-bind="weightOptions"
        />

        <template #append>
          <div
            class="d-print-none menu align-center justify-center my-auto mx-1"
          >
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  color="primary"
                  icon="mdi-dots-vertical"
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
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ValueSlider from "@/components/controls/ValueSlider.vue";
import { Synapse, SynapsePropTypes } from "@/types/synapseTypes";

const props = defineProps({
  synapse: SynapsePropTypes,
});

const synapse = computed(() => props.synapse as Synapse);

const update = (value: number) => {
  synapse.value.weight = value;
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
    icon: "mdi-restart",
    title: "Reset synaptic weight",
    onClick: () => {
      synapse.value.reset();
    },
    show: () => true,
  },
  {
    id: "weightInverse",
    icon: "mdi-contrast",
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
}

.syn-spec:hover {
  .menu {
    opacity: 1;
  }
}
</style>
