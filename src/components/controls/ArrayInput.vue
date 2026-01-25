<template>
  <v-textarea
    v-model="model"
    :rows="1"
    base-color="grey"
    class="mx-1 array-input"
    color="grey"
    density="compact"
    hide-details
  />
</template>

<script setup lang="ts">
const model = defineModel<string>({ required: true });
</script>

<style lang="scss">
.array-input {
  padding-top: 6px;

  .v-field-label {
    font-size: 15px;
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  }

  .v-field__input {
    font-size: 12px;
    line-height: 24px;
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  }
}
</style>
