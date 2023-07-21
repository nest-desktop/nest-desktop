<template>
  <v-app>
    <transition name="fade">
      <div v-if="core.app.state.ready">
        <AppDialog />

        <SystemBar class="no-print" />
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
      </div>
    </transition>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, onUpdated, reactive } from '@vue/composition-api';
import { Route } from 'vue-router';

import core from '@/core';

import AppDialog from '@/components/dialog/AppDialog.vue';
import Navigation from '@/components/navigation/Navigation.vue';
import SystemBar from '@/components/systembar/SystemBar.vue';

export default Vue.extend({
  name: 'App',
  components: {
    AppDialog,
    Navigation,
    SystemBar,
  },
  setup(_, context) {
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
     * Store parameter from URL.
     */
    const storeParamFromURL = (route: Route, paramKey: string) => {
      let param: string;
      if (route.query[paramKey]) {
        param = route.query[paramKey] as string;
      } else if (route.params[paramKey]) {
        param = route.params[paramKey] as string;
      } else {
        param = new URLSearchParams(window.location.search).get(paramKey);
      }
      if (param) {
        localStorage.setItem(paramKey, param);
      }
    };

    onMounted(() => {
      // Check if new updates existed.
      document.addEventListener('swUpdated', updateAvailable, {
        once: true,
      });

      // Initialize Vuetify theme (light / dark).
      core.app.initTheme(context.root.$vuetify.theme);

      // Initialize app with global config.
      core.app.init(context, Vue.prototype.$appConfig);

      // It doesn't work in Electron.
      if (!process.env.IS_ELECTRON) {
        // Ask user before leave when some project is changed.
        window.onbeforeunload = () =>
          core.app.project.checkSomeProjectChanges() ? '' : null;
      }
    });

    onUpdated(() => {

      // Update access token for NEST Server.
      storeParamFromURL(context.root.$route, 'nest_server_access_token');
      core.app.backends.nestSimulator.updateAuthToken(
        'nest_server_access_token'
      );

      // Check if backends is running.
      core.app.checkBackends().then(() => {
        // Fetch models from NEST Simulator.
        core.app.model.fetchModelsNEST();
      });
    });

    return { core, refreshApp, state };
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

.ma-1px {
  margin: 1px !important;
}

.ma-2px {
  margin: 2px !important;
}

/* Overrides default Vuetify style */
.v-tabs-slider-wrapper {
  pointer-events: none;
}

.paramLabel {
  color: black;
  font-size: 12px;
  font-weight: 400;
  height: 12px;
  left: -8px;
  line-height: 12px;
  pointer-events: none;
  position: absolute;
  top: 2px;
}
</style>
