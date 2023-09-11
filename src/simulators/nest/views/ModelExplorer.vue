<template>
  <v-container>
    <v-card>
      <v-card-title> Explorer </v-card-title>
      <v-card-subtitle>{{ model.label }} </v-card-subtitle>

      <v-card-text> Text </v-card-text>

      <v-card-actions>
        <v-btn> Action </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NESTModel } from "../helpers/model/model";
import { useNESTModelStore } from "../store/model/modelStore";
const modelStore = useNESTModelStore();

const model = computed(() => modelStore.model as NESTModel)
</script>