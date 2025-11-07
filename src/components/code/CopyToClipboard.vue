<template>
  <v-tooltip v-if="copied" text="Copied">
    <template #activator="tooltipProps">
      <v-btn v-bind="tooltipProps.props" color="success" icon="mdi:mdi-check-bold" size="small" variant="tonal" />
    </template>
  </v-tooltip>
  <v-btn v-else icon="mdi:mdi-content-copy" size="small" title="Copy code script" variant="tonal" @click="copy" />
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import useClipboard from "vue-clipboard3";

const { toClipboard } = useClipboard();

const props = defineProps<{ text: string }>();

const text = toRef(props, "text");

const copied = ref(false);

const copy = async () => {
  try {
    await toClipboard(text.value as string);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    console.error(e);
  }
};
</script>
