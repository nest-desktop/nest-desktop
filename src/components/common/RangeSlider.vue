<template>
  <v-range-slider
    :step="state.step"
    class="py-2 range-slider align-center"
    hide-details
    strict
    style="position: relative"
    v-model="modelValue"
  >
    <template #prepend>
      <v-text-field
        :label="state.id[0]"
        :step="state.step"
        density="compact"
        hide-details
        style="width: 80px"
        type="number"
        v-model="lower"
        variant="underlined"
      />
    </template>
    <template #append>
      <v-text-field
        :label="state.id[1]"
        :step="state.step"
        density="compact"
        hide-details
        style="width: 80px"
        type="number"
        v-model="upper"
        variant="underlined"
      />
    </template>
  </v-range-slider>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from "vue";

const props = defineProps(["id", "modelValue", "step"]);
const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  id: ["lower", "upper"],
  step: 1,
  modelValue: [0, 100],
});

const modelValue = computed({
  get: () => state.modelValue,
  set: (val) => {
    state.modelValue = val;
    emit("update:modelValue", state.modelValue);
  },
});

const lower = computed({
  get: () => state.modelValue[0],
  set: (value: number | string) => {
    state.modelValue[0] = typeof value === "string" ? parseFloat(value) : value;
    emit("update:modelValue", state.modelValue);
  },
});

const upper = computed({
  get: () => state.modelValue[1],
  set: (value: number | string) => {
    state.modelValue[1] = typeof value === "string" ? parseFloat(value) : value;
    emit("update:modelValue", state.modelValue);
  },
});

const update = () => {
  state.id = props.id || ["lower", "upper"];
  state.step = props.step || 1;
  state.modelValue = props.modelValue || [0, 100];
};

watch(() => [props.modelValue], update);
onMounted(update);
</script>

<style lang="scss">
.range-slider {
  .v-slider__label {
    left: 92px;
    pointer-events: none;
    position: absolute;
    top: 0;
  }

  .v-slider-track__background {
    background-color: rgb(var(--v-theme-secondary)) !important;
  }
}
</style>
