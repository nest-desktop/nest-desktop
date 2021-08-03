<template>
  <v-app>
    <iframe id="NESTFrame" class="iframe" />
    <Navigation class="no-print" />

    <transition name="fade">
      <router-view />
    </transition>

    <v-snackbar :timeout="-1" :value="state.updateExists">
      An update is available.

      <template #action="{ attrs }">
        <v-btn
          @click="refreshApp"
          outlined
          small
          v-bind="attrs"
          v-text="'Update'"
        />
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted } from '@vue/composition-api';

import core from '@/core';
import Navigation from '@/components/navigation/Navigation.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Navigation,
  },
  setup() {
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
      if (core.app.config.autoUpdate) {
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

    /**
     * Keep connection to NEST Server alive.
     * Ping every 5 min.
     */
    const keepConnectionToNESTServerAlive = () => {
      core.app.nestServer
        .check()
        .then(() => {
          const NESTFrame = document.getElementById(
            'NESTFrame'
          ) as HTMLIFrameElement;
          setInterval(() => {
            NESTFrame.src = core.app.nestServer.url;
            // NESTFrame.contentDocument.location.reload(true);
          }, 300000);
        })
        .catch((e: Error) => {
          // Errors are already logged inside the httpClient
        });
    };

    onMounted(() => {
      document.addEventListener('swUpdated', updateAvailable, {
        once: true,
      });
      core.app.init();
      keepConnectionToNESTServerAlive();
    });

    return { refreshApp, state };
  },
});
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }

  .print {
    display: block !important;
  }

  .v-main {
    padding: 0 !important;
  }

  @page {
    size: landscape;
  }
}

.iframe {
  background-color: white;
  display: none;
  position: absolute;
  z-index: 1000;
}

.v-toast__text h1 {
  font-size: 20px;
}

.v-toast__text p {
  margin: 4px 0;
}

.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  opacity: 0;
}
.fade-enter {
  opacity: 0;
}
</style>
