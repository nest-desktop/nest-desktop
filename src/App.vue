<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

import { useAppStore } from "./store/appStore";

// more information on Service Worker updates: https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
const state = reactive({
  refreshing: false,
  registration: null,
  updateExists: false,
});

/**
 * Register if an update is available.
 * When autoUpdate is enabled, it refreshes the app.
 * Else the user can click on button in snackbar to refresh the app.
 */
const updateAvailable = (event: any) => {
  state.registration = event.detail;
  const appStore = useAppStore();
  if (appStore.autoUpdate) {
    setTimeout(() => {
      refreshApp();
    }, 1);
  } else {
    state.updateExists = true;
  }
};

/**
 * Called when the user accepts the update
 */
const refreshApp = () => {
  state.updateExists = false;
  if (state.refreshing) return;
  state.refreshing = true;
  // Actual reloading of the page
  window.location.reload();
};

onMounted(() => {
  // Check if new updates existed.
  document.addEventListener("swUpdated", updateAvailable, {
    once: true,
  });
});
</script>

<style lang="scss">
@media print {
  // html,
  // body {
  //   // width: 210mm;
  //   // height: 297mm;
  // }

  @page {
    size: landscape;
    margin: 0;
  }
  /* ... the rest of the rules ... */
}
</style>
