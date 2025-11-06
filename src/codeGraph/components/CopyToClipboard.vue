<template>
  <div>
    <button v-if="copied" class="baklava-button"><Check /></button>
    <button v-else @click="copy" class="baklava-button"><Copy /></button>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import useClipboard from "vue-clipboard3";

import { Check, Copy } from "../icons";

const { toClipboard } = useClipboard();

const props = defineProps({ text: String });

const text = toRef(props, "text");

const copied = ref(false);

const copy = async () => {
  try {
    await toClipboard(text.value as string);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
    console.log("Copied to clipboard");
  } catch (e) {
    console.error(e);
  }
};
</script>
