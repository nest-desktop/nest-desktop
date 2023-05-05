<template>
  <v-slider
    class="slider align-center"
    hide-details
    style="position: relative;"
    v-model="state.value"
  >
    <template #prepend>
      <v-btn
        @click="decrement"
        flat
        icon="mdi-minus"
        size="small"
        variant="text"
      />
    </template>
    <template #append>
      <v-btn
        @click="increment"
        flat
        icon="mdi-plus"
        size="small"
        variant="text"
      />
      <v-text-field
        :step="state.step"
        density="compact"
        hide-details
        single-line
        style="width: 80px"
        type="number"
        v-model="state.value"
        variant="underlined"
        @update:modelValue="onValueUpdate"
      />
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

const props = defineProps(["value", "step"]);

const state = reactive({
  step: props.step || 1,
  value: props.value || 0,
});

const decrement = () => {
  state.value -= state.step;
};

const increment = () => {
  state.value += state.step;
};

const onValueUpdate = (value: string) => {
    state.value = parseFloat(value);
}

watch(
  () => [props.value],
  () => {
    state.value = props.value;
  }
);

onMounted(() => {
  state.value = props.value;
});
</script>

<style>
.slider .v-label {
  position: absolute;
  top: -4px;
  left: 52px
}
</style>
