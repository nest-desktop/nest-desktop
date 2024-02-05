<template>
  <v-container>
    <v-card>
      <v-card-title> Explorer </v-card-title>
      <v-card-subtitle>{{ model.id }} </v-card-subtitle>

      <v-card-text> Text </v-card-text>

      <v-card-actions>
        <v-btn> Action </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PyNNModel } from "../helpers/model/model";

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore = usePyNNModelStore();

const model = computed(() => modelStore.model as PyNNModel);
</script>
