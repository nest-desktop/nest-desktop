<template>
  <v-card>
    <v-list density="compact">
      <v-list-item @click="exportEvents('json')">
        <template #prepend>
          <v-icon icon="mdi:mdi-code-json" />
        </template>
        <v-list-item-title> Export events to JSON file </v-list-item-title>
      </v-list-item>

      <v-list-item @click="exportEvents('csv')">
        <template #prepend>
          <v-icon icon="mdi:mdi-file-delimited-outline" />
        </template>
        <v-list-item-title>Export events to CSV file</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-btn
        text="close"
        @click="closeDialog()"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TNode } from "@/types";

const props = defineProps<{ node?: TNode }>();
const node = computed(() => props.node as TNode);

const emit = defineEmits(["closeDialog"]);
const closeDialog = (value?: string | boolean) => emit("closeDialog", value);

/**
 * Export events.
 */
const exportEvents = (format: string = "json") => {
  if (format === "json") {
    node.value?.activity?.exportEvents();
  } else if (format === "csv") {
    node.value?.activity?.exportEventsCSV();
  }
  closeDialog();
};
</script>
