<template>
  <v-avatar class="recorder" rounded="0">
    <span class="label">
      {{ label }}
    </span>
    <v-icon
      :color="color"
      icon="network:recorder"
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
.recorder {
  width: 50px !important;

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
