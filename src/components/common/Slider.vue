<template>
  <v-slider
    @click:append="increment"
    @click:prepend="decrement"
    append-icon="mdi-plus"
    class="py-2 slider"
    hide-details
    prepend-icon="mdi-minus"
    step="state.step"
    style="position: relative"
    v-model="state.value"
  >
    <template #append>
      <v-text-field
        density="compact"
        hide-details
        single-line
        step="state.step"
        style="width: 80px"
        type="number"
        v-model="value"
        variant="underlined"
      />
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from "vue";

const props = defineProps(["value", "step"]);

const state = reactive({
  step: 1,
  value: 0,
});

const value = computed({
  get: () => state.value,
  set: (val) => {
    state.value = parseFloat(val);
  },
});

const decrement = () => {
  state.value -= state.step;
};

const increment = () => {
  state.value += state.step;
};

const update = () => {
  state.value = props.value || 0;
}

watch(
  () => [props.value],
  update
);

onMounted(update);
</script>

<style>
.slider .v-label {
  position: absolute;
  top: 0px;
  left: 36px;
}
</style>
