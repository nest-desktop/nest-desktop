<template>
  <v-textarea
    :rows="1"
    base-color="grey"
    class="mx-1 array-input"
    color="grey"
    density="compact"
    hide-details
    v-model="value"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  id: { default: "", type: String },
  modelValue: { default: "", required: true, type: Array<Number> },
  unit: { default: "", type: String },
});

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    let valueEmit: Number[] = [];

    switch (typeof value) {
      case "number":
        valueEmit = [value];
        break;
      case "string":
        valueEmit =
          // @ts-ignore - Property 'startsWith' does not exist on type 'never'.
          value.startsWith("[") && value.endsWith("]")
            ? JSON.parse(value)
            : JSON.parse(`[${value}]`);
        break;
    }

    emit("update:modelValue", valueEmit);
  },
});
</script>

<style lang="scss">
.array-input {
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
