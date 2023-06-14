<template>
  <v-card class="playground-toast">
    <v-card-title> Toast </v-card-title>
    <v-card-text>
      <v-btn
        :color="type"
        :key="index"
        @click="openToast(`${type} message`, { type })"
        class="mx-1"
        variant="tonal"
        v-for="(type, index) in types"
      >
        {{ type }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { openToast } from "@/helpers/toast";

const types = ["success", "error", "warning", "info", "default"];
</script>
