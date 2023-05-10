<template>
  <v-slider
    :step="state.step"
    @click:append="increment"
    @click:prepend="decrement"
    append-icon="mdi-plus"
    class="py-2 valueslider"
    hide-details
    prepend-icon="mdi-minus"
    style="position: relative"
    v-model="modelValue"
  >
    <template #append>
      <v-text-field
        :step="state.step"
        density="compact"
        hide-details
        single-line
        style="width: 80px"
        type="number"
        v-model="modelValue"
        variant="underlined"
      />
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from "vue";

const props = defineProps(["modelValue", "step"]);
const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  step: 1,
  modelValue: 0,
});

const modelValue = computed({
  get: () => state.modelValue,
  set: (value: number | string) => {
    state.modelValue = typeof value === "string" ? parseFloat(value) : value;
    changes();
  },
});

const numDecimals = () => {
  const stepStr = state.step.toString();
  return stepStr.includes('.') ? stepStr.split('.')[1].length : 0
};

const decrement = () => {
  state.modelValue -= state.step;
  state.modelValue = parseFloat(state.modelValue.toFixed(numDecimals()));
  changes();
};

const increment = () => {
  state.modelValue += state.step;
  state.modelValue = parseFloat(state.modelValue.toFixed(numDecimals()));
  changes();
};

const changes = () => {
  emit("update:modelValue", state.modelValue);
};

const update = () => {
  state.modelValue = props.modelValue || 0;
  state.step = props.step || 1;
};

watch(() => [props.modelValue], update);
onMounted(update);
</script>

<style>
.valueslider .mdi-plus {
  height: inherit;
  margin-right: 4px;
}

.valueslider .v-label {
  position: absolute;
  top: 0px;
  left: 36px;
}

.valueslider .v-slider-track__fill,
.valueslider .v-slider-track__background {
  background-color: #ccc !important;
}
</style>
