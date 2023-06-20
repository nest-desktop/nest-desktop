<template>
  <v-list-item class="paramViewer">
    <v-row no-gutters>
      {{ props.options.label }}
      <v-spacer />
      {{  props.value }}
      {{  props.options.unit }}
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
const props = defineProps(["options", "value"]);
</script>

<style lang="scss">
.paramViewer {
  height: 30px !important;
  min-height: 0 !important;
}

.paramViewer:nth-child(odd) {
  background-color: rgba(var(--v-theme-primary), 0.03);
}
</style>
