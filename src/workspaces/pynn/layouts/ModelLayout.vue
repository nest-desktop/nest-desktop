<template>
  <ModelNav color="brown" />

  <template v-if="modelStore.state.modelId">
    <ModelBar color="brown" />

    <ModelController />

    <router-view :key="modelStore.state.modelId" name="model" />
  </template>
</template>

<script setup lang="ts">
import { ModelBar, ModelController, ModelNav } from "@/model/components";

import { usePyNNModelStore } from "../model";
const modelStore = usePyNNModelStore();
</script>
