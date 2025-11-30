<template>
  <v-bottom-navigation
    :active="store.state.bottomNav.active"
    :height="store.state.bottomNav.height"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    class="no-print"
    @transitionend="store.dispatchWindowResize()"
  >
    <div class="resize-handle bottom" @mousedown="store.resizeBottomNav()" />

    <slot />
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import type { TStore } from "@/types";
import { useNavStore } from "@/nav";

const navStore = useNavStore();

defineProps<{ store: TStore }>();
</script>
