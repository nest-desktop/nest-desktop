<template>
  <v-avatar class="neuron" style="overflow: visible">
    <span :class="{ 'mt-2': weight === 'excitatory' }" class="label">
      <slot />
    </span>
    <v-icon
      :color
      :icon="`network:neuron${weight ? `-${$props.weight}` : ''}`"
      class="icon-size position-absolute"
      size="small"
    />
  </v-avatar>
</template>

<script setup lang="ts">
defineProps({
  color: { type: String, default: "primary" },
  weight: { type: String, default: "" },
});
</script>
