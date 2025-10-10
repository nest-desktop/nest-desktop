<template>
  <v-tooltip v-if="copied" text="Copied">
    <template #activator="tooltipProps">
      <v-fab v-bind="tooltipProps.props" icon="mdi:mdi-check-bold" color="success" size="small" variant="text" />
    </template>
  </v-tooltip>
  <v-fab v-else icon="mdi:mdi-content-copy" size="small" variant="text" @click="copy" />
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
    setTimeout(() => (copied.value = false), 1500);
  } catch (e) {
    console.error(e);
  }
};
</script>
