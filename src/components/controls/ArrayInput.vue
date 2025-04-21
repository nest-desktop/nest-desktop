<template>
  <v-textarea
    v-model="value"
    :rows="1"
    base-color="grey"
    class="mx-1 array-input"
    color="grey"
    density="compact"
    hide-details
    @blur="emitUpdate()"
    @keydown.enter="emitUpdate"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { default: [], type: Array<number> },
  unit: { default: "", type: String },
});

const value = ref(props.modelValue);

const emitUpdate = (k?: KeyboardEvent) => {
  if (props.modelValue === value.value) return;
  k?.preventDefault();

  let valueEmit: number[] = [];

  switch (typeof value.value) {
    case "number":
      valueEmit = [value.value];
      break;
    case "string":
      valueEmit =
        // @ts-expect-error Property 'startsWith' does not exist on type 'never'.
        value.value.startsWith("[") && value.value.endsWith("]") ? JSON.parse(value) : JSON.parse(`[${value.value}]`);
      break;
  }

  emit("update:modelValue", valueEmit);
};
</script>

<style lang="scss">
.array-input {
  padding-top: 6px;

  .v-field-label {
    font-size: 15px;
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  }

  .v-field__input {
    font-size: 12px;
    line-height: 24px;
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  }
}
</style>
