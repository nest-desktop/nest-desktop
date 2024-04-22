<template>
  <ModelNav :modelDBStore />

  <ModelBar :model color="rosa" />

  <ModelController :modelStore />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { NorseModel } from "../helpers/model/model";

import { useNorseModelStore } from "../stores/model/modelStore";
const modelStore = useNorseModelStore();

import { useNorseModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore = useNorseModelDBStore();

const model = computed(() => modelStore.model as NorseModel);
</script>
