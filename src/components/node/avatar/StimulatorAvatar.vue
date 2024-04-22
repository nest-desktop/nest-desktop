<template>
  <v-avatar class="stimulator" rounded="0">
    <span class="label">
      {{ label }}
    </span>
    <v-icon
      :color="color"
      icon="network:stimulator"
      class="position-absolute icon-size"
    />
  </v-avatar>
</template>

<script lang="ts" setup>
defineProps({
  color: String,
  label: String,
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
    --v-icon-size-multiplier: 2;
  }
}
</style>
