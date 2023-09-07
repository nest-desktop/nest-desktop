<template>
  <model-nav :store="modelDBStore" />

  <model-bar :model="model" color="rosa" />

  <model-controller :store="modelStore" />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";

import { useNorseModelStore } from "@norse/store/model/norseModelStore";
const modelStore = useNorseModelStore();

import { useNorseModelDBStore } from "@norse/store/model/norseModelDBStore";
const modelDBStore = useNorseModelDBStore();

const model = computed(() => modelStore.model);
</script>
