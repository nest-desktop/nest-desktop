<template>
  <v-row
    class="full-height"
    no-gutters
    style="height: calc(100vh - 24px - 48px)"
  >
    <iframe
      :src="`https://nest-simulator.readthedocs.io/en/latest/models/${
        props.modelId
      }.html#models-${parseKebabCase(props.modelId)}--page-root`"
      frameborder="0"
      height="100%"
      width="100%"
    />
  </v-row>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";

const props = defineProps({
  modelId: String,
});

const parseKebabCase = (text: string) => {
  return text.replaceAll("_", "-");
};

onMounted(() => {
  console.log("onMounted", props.modelId);
});

watch(
  () => [props.modelId],
  () => {
    console.log("watch", props.modelId);
  }
);
</script>
