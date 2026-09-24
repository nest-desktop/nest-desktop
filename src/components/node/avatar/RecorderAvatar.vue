<template>
  <v-avatar class="recorder" style="overflow: visible">
    <span class="label">
      <slot />
    </span>
    <v-icon size="small" :color class="position-absolute icon-size" icon="network:recorder" />
  </v-avatar>
</template>

<script setup lang="ts">
defineProps({
  color: { type: String, default: "primary" },
});
</script>
