<template>
  <v-btn-group class="pt-2 mt-1" style="width: 100%" variant="text">
    <v-select
      v-model="connection.rule.value"
      :disabled="connection.sourceNode.size === 1 && connection.targetNode.size === 1"
      :items="rules"
      class="mx-1"
      density="compact"
      hide-details
      label="Connection rule"
    />

    <v-menu :close-on-content-click="false">
      <template #activator="{ props: btnProps }">
        <v-btn
          :disabled="Object.keys(connection.params).length === 0"
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
            v-for="(param, index) in connection.paramsAll"
            :key="index"
            v-model="connection.paramsVisible"
            :color="connection.sourceNode.view.color"
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

    <Menu :items class="rounded-circle" />
  </v-btn-group>

  <v-list v-if="connection.paramsVisible.length > 0" density="compact">
    <ParamListItem
      v-for="(param, index) in connection.filteredParams"
      :key="index"
      :color="connection.sourceNode.view.color"
      :param="(param as ConnectionParameter)"
    />
  </v-list>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Menu from "../common/Menu.vue";
import ParamListItem from "../parameter/ParamListItem.vue";
import { ConnectionParameter } from "@/helpers/connection/connectionParameter";
import { TConnection } from "@/types";

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
    onClick: () => {
      connection.value.reset();
    },
    prependIcon: "mdi:mdi-restart",
    title: "Reset connection",
  },
  {
    id: "connectionReverse",
    onClick: () => {
      connection.value.reverse();
    },
    prependIcon: "mdi:mdi-rotate-3d-variant",
    title: "Reverse connection",
  },
];
</script>
