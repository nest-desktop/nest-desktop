<template>
  <v-slider
    :step="state.step"
    @click:append="increment"
    @click:prepend="decrement"
    append-icon="mdi-plus"
    class="py-2 value-slider"
    hide-details
    prepend-icon="mdi-minus"
    style="position: relative"
    v-model="modelValue"
  >
    <template #append>
      <v-text-field
        :label="state.id"
        :step="state.step"
        density="compact"
        hide-details
        style="width: 80px"
        type="number"
        v-model="modelValue"
        :suffix="state.unit"
        variant="underlined"
      />
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from "vue";

const props = defineProps(["id", "modelValue", "step", "unit"]);
const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  id: "",
  modelValue: 0,
  step: 1,
  unit: ""
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
  return stepStr.includes(".") ? stepStr.split(".")[1].length : 0;
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
  state.id = props.id || "";
  state.modelValue = props.modelValue || 0;
  state.step = props.step || 1;
  state.unit = props.unit || "";
};

watch(() => [props.id, props.modelValue], update);
onMounted(update);
</script>

<style lang="scss">
.value-slider {
  .mdi-minus,
  .mdi-plus {
    opacity: 0;
  }

  .mdi-plus {
    height: inherit;
    margin-right: 4px;
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
}

.value-slider:hover {
  .mdi-minus,
  .mdi-plus {
    opacity: 0.6;
  }
}
</style>
