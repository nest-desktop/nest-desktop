<template>
  <card :color="state.color" class="node my-1">
    <v-card-title class="mt-2 ml-10">
      <v-select
        :items="nodeModels"
        hide-details
        label="Model"
        density="compact"
        v-model="state.model"
        variant="outlined"
      >
        <template #prepend>
          <v-btn class="position-absolute" flat icon size="large" style="left:8px; top:8px">
            <node-avatar
              size="48px"
              v-bind="{
                color: state.color,
                label: state.label,
                type: state.type,
                weight: state.weight,
              }"
            />
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
                  :color="state.color"
                  density="compact"
                  hide-details
                  label="Population"
                  v-model="state.paramsVisible"
                  value="size"
                >
                  <template #append> n: {{ state.size }} </template>
                </v-checkbox>
                <template v-if="state.params && state.params.length > 0">
                  <template :key="index" v-for="(param, index) in state.params">
                    <v-checkbox
                      :color="state.color"
                      :label="param.label"
                      :value="param.id"
                      density="compact"
                      hide-details
                      v-model="state.paramsVisible"
                    >
                      <template #append>
                        {{ param.inputLabel || param.id }}: {{ param.value }}
                        {{ param.unit }}
                      </template>
                    </v-checkbox>
                  </template>
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
          :color="state.color"
          :options="{ id: 'n', label: 'Population' }"
          v-model="state.size"
          v-if="state.paramsVisible.includes('size')"
        />

        <template v-if="state.params && state.params.length > 0">
          <template :key="index" v-for="(param, index) in state.params">
            <node-param
              :color="state.color"
              :options="param"
              v-model="param.value"
              v-if="state.paramsVisible.includes(param.id)"
            />
          </template>
        </template>
      </v-list>
    </v-card-text>

    <v-card-actions
      class="pa-0"
      v-if="state.connections && state.connections.length > 0"
      style="min-height: 40px"
    >
      <v-expansion-panels variant="accordion">
        <node-connection
          :key="index"
          :sourceNode="{
            color: state.color,
            label: state.label,
            type: state.type,
            weight: state.weight,
          }"
          v-bind="connection"
          v-for="(connection, index) in state.connections"
        />
      </v-expansion-panels>
    </v-card-actions>
  </card>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

import Card from "@/components/common/Card.vue";
import List from "@/components/common/List.vue";
import NodeAvatar from "@/components/nest/avatar/NodeAvatar.vue";
import NodeConnection from "@/components/nest/NodeConnection.vue";
import NodeParam from "@/components/nest/NodeParam.vue";

const props = defineProps({
  color: { default: "primary", required: false, type: String },
  connections: { default: [], required: false, type: Array<Object> },
  model: { type: String },
  label: { default: "", required: false, type: String },
  params: { default: [], required: false, type: Array<Object> },
  paramsVisible: { default: [], required: false, type: Array<String> },
  size: { default: 1, required: false, type: Number },
  type: { type: String },
  weight: { default: "default", type: String}
});

const state = reactive({
  color: "primary",
  connections: [],
  model: "",
  label: "",
  params: [],
  paramsVisible: [],
  size: 1,
  type: "",
  weight: "default"
});

const nodeModels = [
  { value: "dc_generator", title: "DC generator" },
  { value: "ac_generator", title: "AC generator" },
  { value: "gauss_generator", title: "Noise generator" },
  { value: "poisson_generator", title: "Poisson generator" },
  { value: "iaf_psc_alpha", title: "IAF PSC alpha" },
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
  state.color = props.color;
  state.label = props.label;
  state.params = props.params;
  state.paramsVisible = props.paramsVisible;
  state.connections = props.connections;
  state.model = props.model;
  state.type = props.type;
  state.weight = props.weight;
};

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

  .v-input__prepend,
  .v-input__append {
    padding-top: 0 !important;
  }
}
</style>
