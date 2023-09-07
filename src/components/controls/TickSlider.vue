<template>
  <v-slider
    :max="max"
    :ticks="state.ticks"
    @click:append="increment"
    @click:prepend="decrement"
    append-icon="mdi-plus"
    class="py-3 tick-slider"
    hide-details="auto"
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

const state: { tickIdx: number; ticks: Record<number, string> } = reactive({
  tickIdx: 0,
  ticks: {},
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
  if (state.tickIdx <= 0) {
    return;
  }
  tickIdx.value -= 1;
};

const increment = () => {
  if (state.tickIdx >= props.ticks.length - 1) {
    return;
  }
  tickIdx.value += 1;
};

const init = () => {
  state.ticks = {};
  props.ticks.forEach((value: number | string, index: number) => {
    // @ts-ignore
    state.ticks[index] = value;
  });
  update();
};

const update = () => {
  state.tickIdx = 0;
  props.ticks.forEach((value: number | string, index: number) => {
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
    opacity: 0 !important;
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

  .v-input__details {
    padding-top: 16px;
  }
}

.tick-slider:hover {
  .mdi-minus,
  .mdi-plus {
    opacity: 0.6 !important;
  }

  .unit {
    opacity: 0;
  }
}
</style>
