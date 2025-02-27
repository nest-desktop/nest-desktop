<template>
  <router-view />
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive } from "vue";

import { confirmDialog } from "./helpers/common/confirmDialog";
import { logger as mainLogger } from "./utils/logger";

import { useAppStore } from "./stores/appStore";
const appStore = useAppStore();

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "app component",
});

// more information on Service Worker updates:
// https://medium.com/@dougallrich/give-users-control-over-app-updates-in-vue-cli-3-pwas-20453aedc1f2 (2019)
// https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip (2020)
// https://devpress.csdn.net/vue/62f40393c6770329307f8fcf.html (2022)

const state = reactive<{ refreshing: boolean }>({
  refreshing: false,
});

/**
 * Register if an update is available.
 * When autoUpdate is enabled, it automatically refreshes the app.
 * Otherwise the user has to confirm to refresh app.
 */
const updateAvailable = (event: { detail: ServiceWorkerRegistration }) => {
  logger.trace("updates are available:", event.detail);

  if (appStore.state.autoUpdate) {
    nextTick(() => refreshApp());
  } else {
    confirmDialog({
      title: "Update manager",
      text: "An update is available. Do you want to refresh the app?",
    }).then((answer: boolean) => {
      if (answer) refreshApp();
    });
  }
};

/**
 * Called when the user accepts the update
 */
const refreshApp = () => {
  logger.trace("refresh app.");

  if (state.refreshing) return;
  state.refreshing = true;
  // Actual reloading of the page
  window.location.reload();
};

onMounted(() => {
  logger.trace("on mounted");

  // Check if new updates existed.
  document.addEventListener("swUpdated", ((e: CustomEvent) => updateAvailable(e)) as EventListener, {
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
