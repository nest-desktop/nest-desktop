<template>
  <v-slider
    :step="state.step"
    @click:append="increment"
    @click:prepend="decrement"
    append-icon="mdi-plus"
    class="py-2 slider"
    hide-details
    prepend-icon="mdi-minus"
    style="position: relative"
    v-model="state.value"
  >
    <template #append>
      <v-text-field
        :step="state.step"
        density="compact"
        hide-details
        single-line
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
  state.step = props.step || 1;
}

watch(
  () => [props.value, props.step],
  update
);

onMounted(update);
</script>

<style>
.slider .mdi-plus {
  height: inherit;
  margin-right: 2px;
}

.slider .v-label {
  position: absolute;
  top: 0px;
  left: 36px;
}
</style>
