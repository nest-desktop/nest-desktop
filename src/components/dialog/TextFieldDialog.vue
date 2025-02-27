<template>
  <v-card>
    <v-card-text>
      <v-text-field v-model="modelValue" density="compact" hide-details />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn text="cancel" title="Cancel" @click="closeDialog()" />
      <v-btn text="submit" title="Submit" @click="closeDialog(modelValue)" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ modelValue: string }>();
const modelValue = ref(props.modelValue);

const emit = defineEmits(["closeDialog"]);
const closeDialog = (value?: string) => emit("closeDialog", value);
</script>
