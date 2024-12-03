<template>
  <v-card
    class="playground-import-json"
    title="Config"
  >
    <v-card-text>{{ data }}</v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import data from "./data.json";
</script>
