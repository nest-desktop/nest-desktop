<template>
  <v-slider
    :max="max"
    :ticks="Object.values(state.ticks)"
    @click:append="increment"
    @click:prepend="decrement"
    append-icon="mdi-plus"
    class="py-3 tick-slider"
    hide-details
    min="0"
    prepend-icon="mdi-minus"
    show-ticks="always"
    step="1"
    style="position: relative"
    v-model="tickIdx"
  >
    <template #append>
      <div class="unit">{{ props.unit }}</div>
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from "vue";

interface Props {
  modelValue: number | string;
  ticks?: number[];
  unit?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  ticks: () => [0, 100],
  unit: "",
});
const emit = defineEmits(["update:modelValue"]);

const state: { tickIdx: number; ticks: { [key: string]: number } } = reactive({
  tickIdx: 0,
  ticks: { 0: 0, 1: 100 },
});

const tickIdx = computed({
  get: () => state.tickIdx,
  set: (value: number) => {
    state.tickIdx = value;
    emit("update:modelValue", state.ticks[state.tickIdx]);
  },
});

const max = computed(() => props.ticks.length - 1);

const decrement = () => {
  tickIdx.value -= 1;
};

const increment = () => {
  tickIdx.value += 1;
};

const init = () => {
  state.ticks = {};
  props.ticks.forEach((value: number, index: number) => {
    state.ticks[index] = value;
  });
  update();
};

const update = () => {
  state.tickIdx = 0;
  props.ticks.forEach((value: number, index: number) => {
    if (props.modelValue === value) {
      state.tickIdx = index;
    }
  });
};

watch(() => [props.modelValue], update);
onMounted(init);
</script>

<style lang="scss">
.tick-slider {
  .mdi-minus,
  .mdi-plus {
    opacity: 0;
  }

  .unit {
    position: absolute;
    pointer-events: none;
    opacity: 0.6;
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

.tick-slider:hover {
  .mdi-minus,
  .mdi-plus {
    opacity: 0.6;
  }

  .unit {
    opacity: 0;
  }
}
</style>
