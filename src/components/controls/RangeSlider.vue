<template>
  <v-range-slider
    v-model="value"
    :step="props.step"
    class="mx-1 py-1 range-slider align-center"
    color="grey"
    hide-details
    strict
    style="position: relative"
    thumb-size="16"
    track-size="2"
  >
    <template #prepend>
      <v-text-field
        v-model="lower"
        :label="(props.inputLabel[0] as string)"
        :step="props.step"
        :suffix="props.unit"
        density="compact"
        hide-details
        style="max-width: 80px"
        type="number"
        variant="underlined"
        @blur="emitUpdate()"
        @keyup.enter="emitUpdate()"
      />
    </template>
    <template #append>
      <v-text-field
        v-model="upper"
        :label="(props.inputLabel[1] as string)"
        :step="props.step"
        :suffix="props.unit"
        density="compact"
        hide-details
        style="max-width: 80px"
        type="number"
        variant="underlined"
        @blur="emitUpdate()"
        @keyup.enter="emitUpdate()"
      />
    </template>
  </v-range-slider>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";

const props = defineProps({
  inputLabel: { default: ["lower", "upper"], type: Array<string> },
  modelValue: { default: [0, 100], type: Array<number> },
  step: { default: 1, type: Number },
  unit: { default: "", type: String },
});
const emit = defineEmits(["update:modelValue"]);
const modelRef = reactive<{
  lower: number;
  upper: number;
}>({
  lower: 0,
  upper: 1,
});

const emitUpdate = () => {
  if (props.modelValue[0] === modelRef.lower && props.modelValue[1] === modelRef.upper) return;
  emit("update:modelValue", [modelRef.lower, modelRef.upper]);
};

const lower = computed({
  get: () => modelRef.lower,
  set: (value) => {
    modelRef.lower = typeof value === "string" ? parseFloat(value) : value;
  },
});

const upper = computed({
  get: () => modelRef.upper,
  set: (value) => {
    modelRef.upper = typeof value === "string" ? parseFloat(value) : value;
  },
});

const value = computed({
  get: () => [modelRef.lower, modelRef.upper],
  set: (value) => {
    modelRef.lower = value[0];
    modelRef.upper = value[1];
    emitUpdate();
  },
});

watch(
  () => [props.modelValue],
  () => {
    modelRef.lower = props.modelValue[0] as number;
    modelRef.upper = props.modelValue[1] as number;
  },
);
</script>

<style lang="scss">
.range-slider {
  .v-input__append,
  .v-input__prepend {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  }

  .v-slider__label {
    font-size: 15px;
    left: 92px;
    pointer-events: none;
    position: absolute;
    top: -4px;
  }
}
</style>
