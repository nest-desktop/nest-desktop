<template>
  <v-btn class="icon-btn d-flex flex-column">
    <template #prepend>
      <v-icon :icon="props.icon" class="ma-1" size="large" />
    </template>
    <slot />
  </v-btn>
</template>

<script lang="ts" setup>
const props = defineProps<{ icon: string }>();
</script>

<style lang="scss">
.icon-btn {
  .v-btn__prepend {
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
}
</style>
