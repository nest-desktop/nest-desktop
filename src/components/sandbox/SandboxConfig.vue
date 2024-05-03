<template>
  <v-card class="playground-import-json">
    <v-card-title>Config</v-card-title>
    <v-card-text>
      <!-- {{ config.configItemName }} -->
      {{ data }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import data from "./data.json";
</script>
