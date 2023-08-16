<template>
  <v-slider
    :step="props.step"
    @click:append="increment"
    @click:prepend="decrement"
    append-icon="mdi-plus"
    class="py-1 value-slider"
    hide-details="auto"
    prepend-icon="mdi-minus"
    style="position: relative"
    v-model="value"
  >
    <template #append>
      <v-text-field
        :label="props.id"
        :step="props.step"
        :suffix="props.unit"
        density="compact"
        hide-details
        style="width: 70px"
        type="number"
        v-model="value"
        variant="underlined"
      />
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  id: { default: "", type: String },
  modelValue: { default: 0, type: Number },
  step: { default: 1, type: Number },
  unit: { default: "", type: String },
});

const decrement = () => {
  value.value -= props.step;
};

const increment = () => {
  value.value += props.step;
};

const numDecimals = () => {
  const stepStr = props.step.toString();
  return stepStr.includes(".") ? stepStr.split(".")[1].length : 0;
};

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    const val = typeof value === "string" ? parseFloat(value) : value;
    const valueFixed = parseFloat(val.toFixed(numDecimals()));
    emit("update:modelValue", valueFixed);
  },
});
</script>

<style lang="scss">
.value-slider {
  .mdi-minus,
  .mdi-plus {
    opacity: 0 !important;
  }

  .mdi-plus {
    height: inherit;
    margin-right: 4px;
  }

  .v-input__prepend,
  .v-input__append {
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  }

  .v-slider__label {
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
  }

  .v-slider-track__fill,
  .v-slider-track__background {
    background-color: rgb(var(--v-theme-secondary)) !important;
  }

  .v-input:hover .v-text-field__suffix {
    display: none;
  }
}

.value-slider:hover {
  .mdi-minus,
  .mdi-plus {
    opacity: 0.6 !important;
  }
}
</style>
