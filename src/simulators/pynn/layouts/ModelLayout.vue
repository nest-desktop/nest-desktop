<template>
  <ModelNav />

  <ModelBar color="brown" />

  <ModelController />

  <router-view :key="modelStore.state.modelId" name="model" />
</template>

<script lang="ts" setup>
import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { TModelStore } from "@/stores/model/defineModelStore";

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = usePyNNModelStore();
</script>
