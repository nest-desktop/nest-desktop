<template>
  <v-slider
    :max="state.max"
    :ticks="state.tickLabels"
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
      <div class="unit">{{ state.unit }}</div>
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from "vue";

const props = defineProps(["modelValue", "ticks", "unit"]);
const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  tickIdx: 0,
  tickLabels: {},
  max: 0,
  unit: "",
});

const tickIdx = computed({
  get: () => state.tickIdx,
  set: (value: number) => {
    state.tickIdx = value;
    changes();
  },
});

const decrement = () => {
  state.tickIdx = state.tickIdx - 1;
  changes();
};

const increment = () => {
  state.tickIdx = state.tickIdx + 1;
  changes();
};

const update = () => {
  state.max = props.ticks.length - 1;
  state.tickLabels = {};
  props.ticks.forEach((value: any, index: number) => {
    state.tickLabels[index] = value;
    if (props.modelValue === value) {
      state.tickIdx = index;
    }
  });
  state.unit = props.unit || "";
};

const changes = () => {
  emit("update:modelValue", state.tickLabels[state.tickIdx]);
};

watch(() => [props.modelValue], update);
onMounted(update);
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
