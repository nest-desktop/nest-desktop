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
    v-model="state.value"
  >
  </v-slider>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

const props = defineProps(["value", "ticks"]);

const state = reactive({
  value: 0,
  tickLabels: {},
  max: 0
});

const decrement = () => {
  state.value--;
};

const increment = () => {
  state.value++;
};

const update = () => {
  state.max = props.ticks.length - 1;
  state.tickLabels = {};
  props.ticks.forEach((value, index) => {
    state.tickLabels[index] = value;
  })
  state.value = state.value;
}

watch(
  () => [props.value, props.ticks],
  update
);

onMounted(update);
</script>

<style>
.tick-slider .v-label {
  position: absolute;
  top: 0px;
  left: 36px;
}
</style>
