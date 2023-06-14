<template>
  <v-card class="playground-import-json">
    <v-card-title> Import JSON </v-card-title>
    <v-card-text>
      {{ data }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import data from "./data.json";

</script>
