<template>
  <v-range-slider
    :step="state.step"
    class="py-2 range-slider align-center"
    hide-details
    style="position: relative"
    v-model="state.value"
  >
    <template #prepend>
      <v-text-field
        density="compact"
        hide-details
        single-line
        step="state.step"
        style="width: 80px"
        type="number"
        v-model="lower"
        variant="underlined"
      />
    </template>
    <template #append>
      <v-text-field
        density="compact"
        hide-details
        single-line
        step="state.step"
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

const props = defineProps(["value", "step"]);

const state = reactive({
  step: 1,
  value: [0, 1],
});

const lower = computed({
  get: () => state.value[0],
  set: (val) => {
    state.value[0] = parseFloat(val);
  },
});

const upper = computed({
  get: () => state.value[1],
  set: (val) => {
    state.value[1] = parseFloat(val);
  },
});

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
.range-slider .v-label {
  position: absolute;
  top: 0px;
  left: 92px;
}
</style>
