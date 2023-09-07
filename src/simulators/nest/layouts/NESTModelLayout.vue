<template>
  <model-nav :store="modelDBStore" />

  <model-bar :model="model" :tab-items="tabItems" color="orange" />

  <model-controller :store="modelStore" />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";

import { NESTModel } from "@nest/helpers/model/nestModel";

import { useNESTModelStore } from "@nest/store/model/nestModelStore";
const modelStore = useNESTModelStore();

import { useNESTModelDBStore } from "@nest/store/model/nestModelDBStore";
const modelDBStore = useNESTModelDBStore();

const model = computed(() => modelStore.model as NESTModel);

const tabItems = [
  {
    icon: "mdi-text-box-outline",
    id: "modelDoc",
    label: "Doc",
    title: "Read documentation",
    to: {
      name: "nestModelDoc",
      params: { modelId: model.value.id },
    },
  },
  {
    icon: "mdi-chart-scatter-plot",
    id: "modelExplorer",
    label: "Explore",
    title: "Explore activity",
    to: {
      name: "nestModelExplorer",
      params: { modelId: model.value.id },
    },
  },
  {
    icon: "mdi-pencil",
    id: "modelEditor",
    label: "Edit",
    title: "Edit activity",
    to: {
      name: "nestModelEditor",
      params: { modelId: model.value.id },
    },
  },
];
</script>
