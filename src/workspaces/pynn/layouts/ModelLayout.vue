<template>
  <ModelNav color="brown" />

  <template v-if="modelStore.state.modelId">
    <ModelBar color="brown" />

    <ModelController />

    <router-view :key="modelStore.state.modelId" name="model" />
  </template>
</template>

<script lang="ts" setup>
import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore = usePyNNModelStore();
</script>
