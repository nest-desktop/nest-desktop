<template>
  <v-list-item>
    <v-row no-gutters>
      <span class="text-medium-emphasis">{{ param.label }}</span>
      <v-spacer />
      {{ param.id }}:
      {{ param.value }}
      {{ param.unit }}
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
defineProps(["param"]);
</script>

<style lang="scss">
// .paramViewer:nth-child(odd) {
//   background-color: rgba(var(--v-theme-primary), 0.03);
// }
</style>
