<template>
  <RangeSlider
    v-if="props.options.component === 'rangeSlider'"
    v-bind="props.options"
    v-model="(modelValue as number[])"
  />
  <TickSlider
    v-else-if="props.options.component === 'tickSlider'"
    v-bind="props.options"
    v-model="(modelValue as string | number)"
  />
  <ValueSlider v-else v-bind="props.options" v-model="(modelValue as number)" />
</template>

<script setup lang="ts">
import { computed } from "vue";

import { TValue } from "@/types";

import RangeSlider from "./RangeSlider.vue";
import TickSlider from "./TickSlider.vue";
import ValueSlider from "./ValueSlider.vue";

interface IOptions {
  component?: "rangeSlider" | "tickSlider" | "valueSlider" | string;
  color?: string;
  id?: string;
  inputLabel?: string[];
  label?: string;
  max?: number;
  min?: number;
  step?: number;
  ticks?: (number | string)[];
  unit?: string;
  value: TValue;
}

const props = defineProps<{ modelValue: TValue; options: IOptions }>();
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
