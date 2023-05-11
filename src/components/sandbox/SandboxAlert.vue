<template>
  <v-card class="playground-alert">
    <v-card-title> Alerts </v-card-title>
    <v-card-text>
      <v-alert class="my-1" color="success" icon="$success" variant="flat">
        The simulation was sucessfully finished.
      </v-alert>
      <v-alert class="my-1" color="info" icon="$info" variant="outlined">
        The updates are available.
      </v-alert>
      <v-alert class="my-1" color="warning" icon="$warning" variant="text">
        The simulation might impact the performance.
      </v-alert>
      <v-alert class="my-1" color="error" icon="$error" variant="tonal">
        The backend was not found.
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
//
</script>
