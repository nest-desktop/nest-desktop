<template>
  <v-btn-group v-if="!synapse.connection.view.connectRecorder()" class="pt-2 mt-1" style="width: 100%" variant="text">
    <SynapseModelSelect :synapse @open-menu="() => (state.menu = true)" />

    <v-menu v-model="state.menu" :close-on-content-click="false">
      <template #activator="{ props: btnProps }">
        <v-btn
          :disabled="synapse.params.keys.length === 0"
          class="rounded-circle"
          color="primary"
          icon="mdi:mdi-order-bool-ascending-variant"
          size="small"
          v-bind="btnProps"
        />
      </template>

      <v-card>
        <v-card-text>
          <v-checkbox
            v-for="(param, index) in synapse.model.params.values"
            :key="index"
            v-model="synapse.params.paramsVisible"
            :color="synapse.connection.sourceNode.view.color"
            :label="param.label"
            :value="param.id"
            density="compact"
            hide-details
          >
            <template #append>
              {{ param.id }}: {{ param.value }}
              {{ param.unit }}
            </template>
          </v-checkbox>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-menu>
      <template #activator="{ props: btnProps }">
        <v-btn class="rounded-circle" color="primary" icon="mdi:mdi-dots-vertical" size="small" v-bind="btnProps" />
      </template>

      <v-list density="compact">
        <v-list-item v-for="(item, index) in items" :key="index" @click="item.onClick">
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn-group>

  <v-list v-if="synapse.params.hasSomeVisibleParams" density="compact">
    <ParamListItem
      v-for="(param, index) in synapse.params.filteredParams"
      :key="index"
      v-model="param.value"
      :color="synapse.connection.sourceNode.view.color"
      :param="param as NESTSynapseParameter"
    />
  </v-list>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import ParamListItem from "@/components/parameter/ParamListItem.vue";
import type { TModel } from "@/types";

import SynapseModelSelect from "./SynapseModelSelect.vue";
import type { NESTSynapse, NESTSynapseParameter } from "../../../types";

const props = defineProps<{ synapse: NESTSynapse }>();
const synapse = computed(() => props.synapse);

const state = reactive<{
  elementType: string;
  items: TModel[];
  menu: boolean;
}>({
  elementType: "",
  items: [],
  menu: false,
});

const items = [
  {
    id: "paramsReset",
    icon: "mdi:mdi-restart",
    title: "Reset synapse params",
    onClick: () => {
      synapse.value.reset();
      synapse.value.changes({ preventSimulation: true });
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
