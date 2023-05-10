<template>
  <span>
    <range-slider
      :color="state.color"
      :id="state.id"
      :label="state.label"
      :max="state.max"
      :min="state.min"
      :step="state.step"
      v-if="state.variant === 'range'"
      v-model="modelValue"
    />
    <tick-slider
      :color="state.color"
      :id="state.id"
      :label="state.label"
      :ticks="state.ticks"
      v-else-if="state.variant === 'ticks'"
      v-model="modelValue"
    />
    <value-slider
      :color="state.color"
      :id="state.id"
      :label="state.label"
      :max="state.max"
      :min="state.min"
      :step="state.step"
      v-else
      v-model="modelValue"
    />
  </span>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from "vue";

import RangeSlider from "@/components/common/RangeSlider.vue";
import TickSlider from "@/components/common/TickSlider.vue";
import ValueSlider from "@/components/common/ValueSlider.vue";

const props = defineProps(["color", "options", "modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  id: "",
  color: "primary",
  label: "undefined",
  max: 100,
  min: 0,
  step: 1,
  ticks: [0, 100],
  modelValue: 0,
  variant: "value",
});

const modelValue = computed({
  get: () => state.modelValue,
  set: (val) => {
    state.modelValue = val;
    emit("update:modelValue", state.modelValue);
  },
});

const update = () => {
  state.id = props.options.id || "";
  state.color = props.color || "primary";
  state.label = props.options.label || "undefined";
  state.max = props.options.max || 100;
  state.min = props.options.min || 0;
  state.step = props.options.step || 0;
  state.ticks = props.options.ticks || [1, 100];
  state.modelValue = props.modelValue || 0;
  state.variant = props.options.variant || "value";
};

watch(() => [props.modelValue], update);
onMounted(update);
</script>
