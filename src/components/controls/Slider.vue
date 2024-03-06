<template>
  <RangeSlider
    v-bind="props.options"
    v-if="props.options.component === 'rangeSlider'"
    v-model="modelValue"
  />
  <TickSlider
    v-bind="props.options"
    v-else-if="props.options.component === 'tickSlider'"
    v-model="modelValue"
  />
  <ValueSlider v-bind="props.options" v-else v-model="modelValue" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import RangeSlider from "@/components/controls/RangeSlider.vue";
import TickSlider from "@/components/controls/TickSlider.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";

const props = defineProps(["modelValue", "options"]);
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
