<template>
  <v-card class="playground-color-picker" title="Color picker">
    <v-card-text>
      <v-select
        v-model="state.colorScheme"
        :items="colorSchemes"
        density="compact"
        label="Select a color scheme"
        persistent-hint
      />

      <ColorPicker :color-scheme="state.colorScheme" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from "vue";

import ColorPicker from "../common/ColorPicker.vue";

const state = reactive<{
  colorScheme: string;
}>({
  colorScheme: "category10",
});

const colorSchemes = [
  { value: "default", title: "default" },
  { value: "category10", title: "category 10" },
  { value: "category20", title: "category 20" },
  { value: "paired", title: "paired" },
  { value: "set1", title: "set 1" },
  { value: "set2", title: "set 2" },
  { value: "set3", title: "set 3" },
  { value: "tableau10", title: "tableau 10" },
  { value: "google10c", title: "google 10c" },
  { value: "google20c", title: "google 20c" },
];
</script>
