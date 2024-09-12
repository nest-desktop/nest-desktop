<template>
  <v-list-item class="paramViewer">
    <v-row no-gutters>
      <span class="text-medium-emphasis">
        {{ param.label || param.options.label }}
      </span>
      <v-spacer />
      {{ param.id }}:
      {{ param.value || param.options.defaultValue }}
      {{ param.unit || param.options.unit }}
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
import { Parameter } from "@/helpers/common/parameter.ts";
defineProps<{ param: Parameter }>();
</script>

<style lang="scss">
.paramViewer {
  height: 28px !important;
  min-height: 0 !important;
}
</style>
