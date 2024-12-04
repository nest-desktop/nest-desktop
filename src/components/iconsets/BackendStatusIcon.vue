<template>
  <v-icon
    :color="backendStore.state.enabled ? (backendStore.isOK && backendStore.isValid ? 'green' : 'red') : 'grey'"
    :title="backendStore.state.name"
    class="mx-1"
    icon="mdi:mdi-circle"
    size="x-small"
  />
</template>

<script setup lang="ts">
import { TStore } from "@/types";

defineProps<{ backendStore: TStore }>();
</script>
