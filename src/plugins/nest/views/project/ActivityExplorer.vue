<template>
  <v-container>
    <v-card>
      <v-card-title> Activity explorer </v-card-title>
      <v-card-subtitle>{{ projectStore.project.name }} </v-card-subtitle>

      <v-card-text>

      </v-card-text>

      <v-card-actions>
        <v-btn> Action </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useProjectStore } from "../../store/projectStore";
const projectStore = useProjectStore();
</script>
