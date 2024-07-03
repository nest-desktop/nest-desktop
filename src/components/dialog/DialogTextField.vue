<template>
  <v-card :title>
    <v-card-text>
      <v-text-field
        density="compact"
        hide-details
        variant="outlined"
        v-model="modelValue"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="closeDialog(false)" title="Cancel">cancel</v-btn>
      <v-btn @click="closeDialog(modelValue)" title="Submit">submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{ modelValue: string; title: string }>();

const emit = defineEmits(["closeDialog"]);

const modelValue = ref(props.modelValue);

function closeDialog(value: string | boolean) {
  emit("closeDialog", value);
}
</script>
