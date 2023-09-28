<template>
  <model-nav :store="modelDBStore" />

  <model-bar :model="(model as NorseModel)" color="rosa" />

  <model-controller :store="modelStore" />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { NorseModel } from "../helpers/model/model";

import { useNorseModelStore } from "../store/model/modelStore";
const modelStore = useNorseModelStore();

import { useNorseModelDBStore } from "../store/model/modelDBStore";
const modelDBStore = useNorseModelDBStore();

const model = computed(() => modelStore.model as NorseModel);
</script>
