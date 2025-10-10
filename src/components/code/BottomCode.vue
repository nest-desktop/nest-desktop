<template>
  <v-bottom-navigation
    :active="store.state.bottomCode.active"
    :height="store.state.bottomCode.height"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    class="no-print bottom-code"
    @transitionend="store.dispatchWindowResize()"
  >
    <div class="resize-handle bottom" @mousedown="store.resizeBottomNav()" />

    <CodeMirror :code class="bottomCode" />
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { TCode, TStore } from "@/types";
import CodeMirror from "../code/CodeMirror.vue";

defineProps<{ code: TCode; store: TStore }>();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();
</script>

<style lang="scss">
.bottom-code {
  .bottom {
    cursor: ns-resize;
    height: 4px;
    width: 100%;
    top: 0;
  }

  .v-btn--stacked {
    height: calc(var(--v-btn-height) + 12px) !important;
    --v-btn-height: 28px !important;
    min-width: auto !important;

    .v-icon {
      --v-icon-size-multiplier: 1 !important;
    }
  }
}
</style>
