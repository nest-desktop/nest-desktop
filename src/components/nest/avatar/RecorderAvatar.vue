<template>
  <v-avatar class="recorder" rounded="0">
    <span class="label">
      {{ props.label }}
    </span>
    <v-icon
      :color="props.color"
      icon="nest:recorder"
      class="position-absolute icon-size"
    />
  </v-avatar>
</template>

<script lang="ts" setup>
const props = defineProps(["color", "label"]);
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
