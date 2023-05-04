<template>
  <v-container>
    <v-card>
      <v-card-title> Explorer </v-card-title>
      <v-card-subtitle>{{ modelStore.modelId }} </v-card-subtitle>

      <v-card-text> Text </v-card-text>

      <v-card-actions>
        <v-btn> Action </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";

import { useModelStore } from "@/store/modelStore";
const modelStore = useModelStore();

const props = defineProps({
  modelId: String,
});

onMounted(() => {
  console.log('onMounted', props.modelId);
});

watch(
  () => [props.modelId],
  () => {
    console.log('watch', props.modelId);
  }
);
</script>