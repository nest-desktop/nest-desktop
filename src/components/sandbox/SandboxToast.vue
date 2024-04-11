<template>
  <v-card class="playground-toast">
    <v-card-title>Toast</v-card-title>
    <v-card-text>
      <v-btn
        v-for="(type, index) in types"
        :key="index"
        :color="type"
        class="mx-1"
        variant="tonal"
        @click="openToast(`${type} message`, { type })"
      >
        {{ type }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { openToast } from "@/helpers/common/toast";

const types = ["success", "error", "warning", "info", "default"];
</script>
