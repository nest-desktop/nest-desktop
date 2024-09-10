<template>
  <v-card class="playground-import-json">
    <v-card-title text="Import JSON" />
    <v-card-text :text="data" />
  </v-card>
</template>

<script lang="ts" setup>
import data from "./data.json";
</script>
