<template>
  <ModelNav color="yellow" />

  <template v-if="modelStore.state.modelId">
    <ModelBar color="yellow" />

    <ModelController />

    <router-view :key="modelStore.state.modelId" name="model" />
  </template>
</template>

<script setup lang="ts">
import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";

import { useElephantModelStore } from "../stores/model/modelStore";
const modelStore = useElephantModelStore();
</script>
