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
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from "vue";

const props = defineProps(["modelValue", "ticks"]);
const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  tickIdx: 0,
  tickLabels: {},
  max: 0,
});

const tickIdx = computed({
  get: () => state.tickIdx,
  set: (value: number) => {
    state.tickIdx = value;
    changes();
  },
});

const decrement = () => {
  state.tickIdx++;
  changes();
};

const increment = () => {
  state.tickIdx--;
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
};

const changes = () => {
  emit("update:modelValue", state.tickLabels[state.tickIdx]);
};

watch(() => [props.modelValue], update);
onMounted(update);
</script>

<style lang="scss">
.tick-slider .v-label {
  position: absolute;
  top: 0px;
  left: 36px;
}

.tick-slider .v-slider-track__fill,
.tick-slider .v-slider-track__background {
  background-color: #ccc !important;
}
</style>
