<template>
  <v-card class="playground-button-toggle">
    <v-card-title> Button toggle </v-card-title>
    <v-card-text>
      <v-btn-toggle divided v-model="state.buttonToggle">
        <v-btn icon="mdi-format-align-left"></v-btn>
        <v-btn icon="mdi-format-align-center"></v-btn>
        <v-btn icon="mdi-format-align-right"></v-btn>
        <v-btn icon="mdi-format-align-justify"></v-btn>
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
