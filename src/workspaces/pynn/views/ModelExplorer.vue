<template>
  <v-card :subtitle="currentModel.id" title="Explorer">
    <v-card-text>Text</v-card-text>

    <v-card-actions>
      <v-btn text="action" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { currentModel } from "../stores/model/modelStore";
</script>
