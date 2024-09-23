<template>
  <v-card>
    <v-card-text>
      <v-text-field density="compact" hide-details v-model="modelValue" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="closeDialog()" text="cancel" title="Cancel" />
      <v-btn @click="closeDialog(modelValue)" text="submit" title="Submit" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{ modelValue: string }>();
const modelValue = ref(props.modelValue);

const emit = defineEmits(["closeDialog"]);
function closeDialog(value?: string) {
  emit("closeDialog", value);
}
</script>
