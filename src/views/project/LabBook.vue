<template>
    <v-container>
      <v-card>
        <v-card-title> Lab book </v-card-title>
        <v-card-subtitle>{{ props.projectId }} </v-card-subtitle>

        <v-card-text> Text </v-card-text>

        <v-card-actions>
          <v-btn> Action </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>


  <script lang="ts" setup>
  import { onMounted, watch } from "vue";

  const props = defineProps({
    projectId: String,
  });

  onMounted(() => {
    console.log('onMounted', props.projectId);
  });

  watch(
    () => [props.projectId],
    () => {
      console.log('watch', props.projectId);
    }
  );

  </script>