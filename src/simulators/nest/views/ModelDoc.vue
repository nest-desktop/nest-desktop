<template>
  <v-row
    class="full-height"
    no-gutters
    style="height: calc(100vh - 24px - 48px)"
  >
    <iframe
      :key="modelId"
      :src="`https://nest-simulator.readthedocs.io/en/latest/models/${modelId}.html#models-${parseKebabCase(
        modelId as string)}--page-root`"
      frameborder="0"
      height="100%"
      width="100%"
    />
  </v-row>
</template>

<script lang="ts" setup>
defineProps<{ modelId: string }>();

const parseKebabCase = (text: string) => text.replaceAll("_", "-");
</script>
