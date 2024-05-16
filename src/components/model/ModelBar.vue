<template>
  <v-app-bar class="d-print-none" flat height="48">
    <v-tabs stacked>
      <slot name="prependTabs"></slot>

      <v-tab
        :key="index"
        :title="tab.title"
        :to="tab.to"
        size="small"
        v-for="(tab, index) in tabItems"
      >
        <v-icon :icon="tab.icon" />
        <span class="text-no-wrap">{{ tab.label }}</span>
      </v-tab>

      <slot name="appendTabs"></slot>
    </v-tabs>

    <v-spacer />

    <v-app-bar-title>{{ model.id }}</v-app-bar-title>

    <v-spacer />

    <v-btn variant="outlined">Simulate</v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TModel } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{ model: TModel }>();
const model = computed(() => props.model);

const tabItems = computed(() => [
  {
    icon: "mdi:mdi-chart-scatter-plot",
    id: "modelExplorer",
    label: "Explore",
    title: "Explore activity",
    to: {
      name: appStore.state.simulator + "ModelExplorer",
      params: { modelId: model.value.id },
    },
  },
  {
    icon: "mdi:mdi-pencil",
    id: "modelEditor",
    label: "Edit",
    title: "Edit activity",
    to: {
      name: appStore.state.simulator + "ModelEditor",
      params: { modelId: model.value.id },
    },
  },
]);
</script>
