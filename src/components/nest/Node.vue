<template>
  <card :color="state.node.color" class="my-1" v-if="state.node">
    <v-card-title class="py-0">
      <v-select
        :items="nodeModels"
        hide-details
        single-line
        density="compact"
        v-model="state.node.model"
        variant="underlined"
      >
        <template #prepend>
          <v-btn :color="node.color" variant="text" icon size="small">
            {{ node.label }}
          </v-btn>
        </template>

        <template #append>
          <v-menu :close-on-content-click="false" density="compact">
            <template #activator="{ props }">
              <v-btn
                icon="mdi-order-bool-ascending-variant"
                size="small"
                v-bind="props"
                variant="text"
              />
            </template>

            <v-card>
              <v-card-text>
                <v-checkbox
                  :color="state.node.color"
                  density="compact"
                  hide-details
                  label="Population"
                  v-model="state.node.paramsVisible"
                  value="size"
                >
                  <template #append> n: {{ state.node.size }} </template>
                </v-checkbox>
                <template
                  :key="index"
                  v-for="(param, index) in state.node.params"
                >
                  <v-checkbox
                    :color="state.node.color"
                    :label="param.label"
                    :value="param.id"
                    density="compact"
                    hide-details
                    v-model="state.node.paramsVisible"
                  >
                    <template #append>
                      {{ param.inputLabel || param.id }}: {{ param.value }}
                      {{ param.unit }}
                    </template>
                  </v-checkbox>
                </template>
              </v-card-text>
            </v-card>
          </v-menu>

          <v-menu :close-on-content-click="false" density="compact">
            <template #activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                size="small"
                v-bind="props"
                variant="text"
              />
            </template>

            <list :items="items" />
          </v-menu>
        </template>
      </v-select>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list>
        <node-param
          :color="state.node.color"
          :options="{ id: 'n', label: 'Population' }"
          :model-value="state.node.size"
          v-if="state.node.paramsVisible.includes('size')"
        />

        <template v-if="'params' in state.node && state.node.params.length > 0">
          <template :key="index" v-for="(param, index) in state.node.params">
            <node-param
              :color="state.node.color"
              :options="param"
              :model-value="param.value"
              v-if="state.node.paramsVisible.includes(param.id)"
            />
          </template>
        </template>
      </v-list>
    </v-card-text>

    <v-card-actions
      class="pa-0"
      v-if="'connections' in node && node.connections.length > 0"
      style="min-height: 40px"
    >
      <v-expansion-panels variant="accordion" multiple>
        <node-connection
          :connSpec="connection.connSpec"
          :key="index"
          :synSpec="connection.synSpec"
          :targetNode="connection.post"
          :sourceNode="node"
          v-for="(connection, index) in node.connections"
        />
      </v-expansion-panels>
    </v-card-actions>
  </card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";

import Card from "@/components/common/Card.vue";
import List from "@/components/common/List.vue";
import NodeParam from "@/components/nest/NodeParam.vue";
import NodeConnection from "@/components/nest/NodeConnection.vue";

const props = defineProps(["node"]);

const state = reactive({
  node: null,
});

const nodeModels = [
  { value: "dc_generator", title: "DC generator" },
  { value: "ac_generator", title: "AC generator" },
  { value: "gauss_generator", title: "Noise generator" },
  { value: "poisson_generator", title: "Poisson generator" },
];

const admins = [
  {
    title: "Management",
    icon: "mdi-account-multiple-outline",
    value: "management",
  },
  { title: "Settings", icon: "mdi-cog-outline", value: "settings" },
];

const cruds = [
  { title: "Create", icon: "mdi-plus-outline", value: "create" },
  { title: "Read", icon: "mdi-file-outline", value: "read" },
  { title: "Update", icon: "mdi-update", value: "update" },
  { title: "Delete", icon: "mdi-delete", value: "delete" },
];

const clickMe = [
  { value: "1", title: "Click Me", icon: "mdi-numeric-1" },
  { value: "2", title: "Click Me", icon: "mdi-numeric-2" },
  { value: "3", title: "Click Me", icon: "mdi-numeric-3" },
  { value: "4", title: "Click Me", icon: "mdi-numeric-4" },
];

const items = [
  {
    value: "parameter",
    title: "parameter",
    icon: "mdi-account-circle",
    items: admins,
  },
  {
    value: "actions",
    title: "actions",
    icon: "mdi-database-cog-outline",
    items: cruds,
  },
  {
    value: "clickMe",
    title: "clickMe",
    icon: "mdi-information",
    items: clickMe,
  },
];

const update = () => {
  state.node = props.node;
};

watch(() => props.node, update);
onMounted(update);
</script>

<style lang="scss">
.node {
  .v-list {
    overflow: visible;

    .v-list-item__content {
      overflow: visible;
    }
  }
}
</style>
