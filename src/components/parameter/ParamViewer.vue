<template>
  <v-list-item class="paramViewer">
    <v-row no-gutters>
      <v-label :title="param.label || param.options?.label">
        <div class="text-truncate">
          {{ param.label || param.options?.label }}
        </div>
      </v-label>

      <v-spacer />
      {{ param.id }}:
      {{ param.value || param.options?.defaultValue }}
      {{ param.unit || param.options?.unit }}
    </v-row>
  </v-list-item>
</template>

<script setup lang="ts">
import { BaseParameter } from "@/helpers/common/parameter.ts";
defineProps<{ param: BaseParameter }>();
</script>

<style lang="scss">
.paramViewer {
  height: 28px !important;
  min-height: 0 !important;
}
</style>
