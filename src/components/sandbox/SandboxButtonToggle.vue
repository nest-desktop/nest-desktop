<template>
  <v-card class="playground-button-toggle">
    <v-card-title> Button toggle </v-card-title>
    <v-card-text>
      <v-btn-toggle
        v-model="state.buttonToggle"
        divided
      >
        <v-btn icon="mdi:mdi-format-align-left" />
        <v-btn icon="mdi:mdi-format-align-center" />
        <v-btn icon="mdi:mdi-format-align-right" />
        <v-btn icon="mdi:mdi-format-align-justify" />
      </v-btn-toggle>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive({
  buttonToggle: null,
});
</script>
