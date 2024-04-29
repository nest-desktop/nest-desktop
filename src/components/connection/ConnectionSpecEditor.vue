<template>
  <v-row class="conn-spec mx-1" no-gutters>
    <v-select
      :disabled="
        connection.sourceNode.size === 1 && connection.targetNode.size === 1
      "
      :items="rules"
      class="pa-1"
      density="compact"
      hide-details
      label="Connection rule"
      v-model="connection.rule.value"
      variant="outlined"
    />

    <div class="d-print-none menu align-center justify-center my-auto mx-1">
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            :disabled="Object.keys(connection.params).length === 0"
            color="primary"
            icon="mdi:mdi-order-bool-ascending-variant"
            size="small"
            v-bind="props"
            variant="text"
          />
        </template>

        <v-card>
          <v-card-text>
            <v-checkbox
              :color="connection.sourceNode.view.color"
              :key="index"
              :label="param.label"
              :value="param.id"
              density="compact"
              hide-details
              v-for="(param, index) in Object.values(connection.params)"
              v-model="connection.paramsVisible"
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
            icon="mdi:mdi-dots-vertical"
            size="small"
            variant="text"
            v-bind="props"
          />
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            :icon="item.icon"
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

  <v-list density="compact" v-if="connection.paramsVisible.length > 0">
    <ConnectionParamEditor
      :key="index"
      :param="param"
      v-for="(param, index) in connection.filteredParams"
    />
  </v-list>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ConnectionParamEditor from "./ConnectionParamEditor.vue";
import { TConnection } from "@/types/connectionTypes";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);

const rules = [
  { title: "all to all", value: "all_to_all" },
  { title: "one to one", value: "one_to_one" },
  { title: "fixed indegree", value: "fixed_indegree" },
  { title: "fixed outdegree", value: "fixed_outdegree" },
  { title: "pairwise Bernoulli", value: "pairwise_bernoulli" },
];

const items = [
  {
    id: "connectionReset",
    icon: "mdi:mdi-restart",
    title: "Reset connection",
    onClick: () => {
      connection.value.reset();
    },
  },
  {
    id: "connectionReverse",
    icon: "mdi:mdi-rotate-3d-variant",
    title: "Reverse connection",
    onClick: () => {
      connection.value.reverse();
    },
  },
];
</script>

<style lang="scss">
.conn-spec {
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
