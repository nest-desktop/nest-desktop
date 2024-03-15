<template>
  <v-snackbar
    :timeout="0"
    :value="state.updateExists"
    bottom
    color="primary"
    right
  >
    An update is available.
    <v-btn @click="refreshApp" variant="text">Update</v-btn>
  </v-snackbar>

  <router-view />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive } from "vue";

import { useAppStore } from "./stores/appStore";
const appStore = useAppStore();

// more information on Service Worker updates:
// https://medium.com/@dougallrich/give-users-control-over-app-updates-in-vue-cli-3-pwas-20453aedc1f2 (2019)
// https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip (2020)
// https://devpress.csdn.net/vue/62f40393c6770329307f8fcf.html (2022)

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
// @ts-ignore
const updateAvailable = (event: any) => {
  console.log("Updates are available.");
  state.registration = event.detail;
  if (appStore.state.autoUpdate) {
    nextTick(() => refreshApp());
  } else {
    state.updateExists = true;
  }
};

/**
 * Called when the user accepts the update
 */
const refreshApp = () => {
  console.log("Refresh app.");
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
