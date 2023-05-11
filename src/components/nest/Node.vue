<template>
  <card :color="state.node.color" class="my-1" v-if="state.node">
    <v-card-title class="py-0 pl-0">
      <v-select
        :items="nodeModels"
        hide-details
        single-line
        density="compact"
        v-model="state.node.model"
        variant="underlined"
      >
        <template #prepend>
          <v-btn :color="node.color" variant="text"> n1 </v-btn>
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
                hide-details
                density="compact"
                v-model="state.node.paramsVisible"
                value="size"
                label="Population"
              >
                <template #append> n: {{ state.node.size }} </template>
              </v-checkbox>
              <template
                :key="index"
                v-for="(param, index) in state.node.params"
              >
                <v-checkbox
                  hide-details
                  density="compact"
                  v-model="state.node.paramsVisible"
                  :value="param.id"
                  :label="param.label"
                >
                  <template #append>
                    {{ param.id }}: {{ param.value }} {{ param.unit }}
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

            <v-card>
              <list :items="menuItems" />
            </v-card>
          </v-menu>
        </template>
      </v-select>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list>
        <v-list-item v-if="state.node.paramsVisible.includes('size')">
          <slider
            :color="state.node.color"
            :options="{ id: 'n', label: 'Population' }"
            v-model="state.node.size"
          />
        </v-list-item>

        <template :key="index" v-for="(param, index) in state.node.params">
          <v-list-item v-if="state.node.paramsVisible.includes(param.id)">
            <slider
              :color="state.node.color"
              :options="param"
              v-model="param.value"
            />
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>
  </card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";

import Card from "@/components/common/Card.vue";
import Slider from "@/components/common/Slider.vue";

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

const menuItems = [
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
