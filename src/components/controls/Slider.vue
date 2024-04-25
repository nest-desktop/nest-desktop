<template>
  <RangeSlider
    v-if="props.options.component === 'rangeSlider'"
    v-bind="props.options"
    v-model="modelValue"
  />
  <TickSlider
    v-else-if="props.options.component === 'tickSlider'"
    v-bind="props.options"
    v-model="modelValue"
  />
  <ValueSlider v-else v-bind="props.options" v-model="modelValue" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import RangeSlider from "./RangeSlider.vue";
import TickSlider from "./TickSlider.vue";
import ValueSlider from "./ValueSlider.vue";

const props = defineProps(["modelValue", "options"]);
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
