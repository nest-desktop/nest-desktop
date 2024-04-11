<template>
  <v-avatar
    class="neuron"
    rounded="0"
  >
    <span
      :class="{ 'mt-2': props.weight === 'excitatory' }"
      class="label"
    >
      {{ props.label }}
    </span>
    <v-icon
      :color="props.color"
      :icon="`network:neuron${props.weight ? `-${$props.weight}` : ''}`"
      class="icon-size position-absolute"
    />
  </v-avatar>
</template>

<script lang="ts" setup>
const props = defineProps({
  color: { type: String, default: "primary" },
  label: { type: String, default: "" },
  weight: { type: String, default: "" },
});
</script>

<style lang="scss">
.neuron {
  .label {
    font-weight: 900;
    font-size: 0.7em;
    z-index: 1;
  }

  .icon-size {
    --v-icon-size-multiplier: 2;
  }
}
</style>
