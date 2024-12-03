<template>
  <v-avatar
    class="stimulator"
    rounded="0"
  >
    <span class="label">
      <slot />
    </span>
    <v-icon
      :color
      class="position-absolute icon-size"
      icon="network:stimulator"
    />
  </v-avatar>
</template>

<script lang="ts" setup>
defineProps({
  color: { type: String, default: "primary" },
});
</script>

<style lang="scss">
.stimulator {
  .label {
    font-weight: 900;
    font-size: 0.7em;
    z-index: 1;
  }

  .icon-size {
    --v-icon-size-multiplier: 2 !important;
  }
}
</style>
