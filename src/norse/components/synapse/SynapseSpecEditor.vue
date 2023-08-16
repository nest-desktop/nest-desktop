<template>
  <v-row
    class="syn-spec mx-1"
    no-gutters
    v-if="!synapse.connection.view.connectRecorder()"
  >
    <v-select
      :disabled="synapse.models.length < 2"
      :items="synapse.models"
      class="pa-1"
      density="compact"
      hide-details
      item-title="label"
      item-value="id"
      label="Synapse model"
      v-model="synapse.modelId"
      variant="outlined"
    />
    <div class="d-print-none menu align-center justify-center my-auto mx-1">
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
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
              :color="synapse.connection.source.view.color"
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
  </v-row>

  <v-list density="compact" v-if="synapse.paramsVisible.length > 0">
    <synapse-param-editor
      :key="index"
      :param="synapse.params[paramId]"
      v-for="(paramId, index) in synapse.paramsVisible"
    />
  </v-list>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SynapseParamEditor from "@norse/components/synapse/SynapseParamEditor.vue";
import { Synapse } from "@norse/core/synapse/synapse";

const props = defineProps({
  synapse: Synapse,
});

const synapse = computed(() => props.synapse as Synapse);

const items = [
  {
    id: "paramsReset",
    icon: "mdi-restart",
    title: "Reset synapse params",
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
    }
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
