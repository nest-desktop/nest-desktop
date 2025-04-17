<template>
  <v-slider
    v-model="value"
    :step="props.step"
    append-icon="mdi:mdi-plus"
    class="mx-1 py-1 value-slider"
    color="grey"
    hide-details="auto"
    prepend-icon="mdi:mdi-minus"
    style="position: relative"
    thumb-size="16"
    track-size="2"
    @click:append="increment()"
    @click:prepend="decrement()"
    @update:model-value="emitUpdate()"
  >
    <template #append>
      <v-text-field
        :model-value="value"
        :label="props.id"
        :step="props.step"
        :suffix="props.unit"
        density="compact"
        hide-details
        style="width: 80px"
        type="number"
        variant="underlined"
        @blur="emitUpdate()"
        @keyup.enter="emitUpdate()"
        @update:model-value="onUpdate"
      />
    </template>
  </v-slider>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  id: { default: "", type: String },
  modelValue: { default: 0, type: Number },
  step: { default: 1, type: Number },
  unit: { default: "", type: String },
});

const value = ref(props.modelValue);

const decrement = () => {
  value.value -= props.step;
  emitUpdate();
};

const emitUpdate = () => {
  if (props.modelValue === value.value) return;
  emit("update:modelValue", value.value);
};

const increment = () => {
  value.value += props.step;
  emitUpdate();
};

const onUpdate = (val: string) => {
  value.value = parseFloat(val);
};
</script>

<style lang="scss">
.value-slider {
  margin-right: 0 !important;

  .mdi-minus,
  .mdi-plus {
    opacity: 0 !important;
  }

  .mdi-plus {
    height: inherit;
    margin-right: 4px;
  }

  .v-input__append,
  .v-input__prepend {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  }

  .v-slider__label {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    font-size: 15px;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: -4px;
    z-index: 0;
  }

  .v-input {
    &:hover .v-text-field__suffix {
      display: none;
    }
  }

  .v-field__outline .v-label {
    background-color: rgb(var(--v-theme-surface)) !important;
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    display: inline;
    opacity: 1;
    padding-left: 8px;
    width: 100%;
    z-index: 1000;
  }

  &:hover {
    .mdi-minus,
    .mdi-plus {
      opacity: 0.6 !important;
    }
  }
}
</style>
