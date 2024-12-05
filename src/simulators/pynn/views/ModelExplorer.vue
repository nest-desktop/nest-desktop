<template>
  <v-card :subtitle="model.id" title="Explorer">
    <v-card-text>Text</v-card-text>

    <v-card-actions>
      <v-btn text="action" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PyNNModel } from "../helpers/model/model";

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore = usePyNNModelStore();

const model = computed(() => modelStore.model as PyNNModel);
</script>
