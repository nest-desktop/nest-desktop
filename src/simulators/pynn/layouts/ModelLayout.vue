<template>
  <ModelNav :modelDBStore />

  <ModelBar :model="modelStore.model" color="brown" />

  <ModelController :modelStore />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModelStore } from "@/stores/model/defineModelStore";

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = usePyNNModelStore();

import { usePyNNModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore: TModelDBStore = usePyNNModelDBStore();
</script>
