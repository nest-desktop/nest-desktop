<template>
  <ModelNav :store="modelDBStore" />

  <ModelBar :model color="brown" />

  <ModelController :store="modelStore" />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { PyNNModel } from "../helpers/model/model";

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore = usePyNNModelStore();

import { usePyNNModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore = usePyNNModelDBStore();

const model = computed(() => modelStore.model as PyNNModel);
</script>
