<template>
  <v-btn-group
    class="pt-2 mt-1"
    style="width: 100%"
    variant="text"
    v-if="!synapse.connection.view.connectRecorder()"
  >
    <v-select
      :disabled="synapse.models.length < 2"
      :items="synapse.models"
      class="mx-1"
      density="compact"
      hide-details
      item-title="label"
      item-value="id"
      label="Synapse model"
      v-model="synapse.modelId"
    />

    <v-menu :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn
          class="rounded-circle"
          color="primary"
          icon="mdi:mdi-order-bool-ascending-variant"
          size="small"
          v-bind="props"
        />
      </template>

      <v-card>
        <v-card-text>
          <v-checkbox
            :color="synapse.connection.sourceNode.view.color"
            :key="index"
            :label="param.label"
            :value="param.id"
            density="compact"
            hide-details
            v-for="(param, index) in Object.values(synapse.modelParams)"
            v-model="synapse.paramsVisible"
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
      <template #activator="{ props }">
        <v-btn
          class="rounded-circle"
          color="primary"
          icon="mdi:mdi-dots-vertical"
          size="small"
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
  </v-btn-group>

  <v-list density="compact" v-if="synapse.paramsVisible.length > 0">
    <SynapseParamEditor
      :key="index"
      :param
      v-for="(param, index) in synapse.filteredParams"
    />
  </v-list>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SynapseParamEditor from "./SynapseParamEditor.vue";
import { NESTSynapse } from "../../helpers/synapse/synapse";

const props = defineProps<{ synapse: NESTSynapse }>();
const synapse = computed(() => props.synapse);

const items = [
  {
    id: "paramsReset",
    icon: "mdi:mdi-restart",
    title: "Reset synapse params",
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
