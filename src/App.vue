<template>
  <v-app>
    <iframe id="NESTFrame" class="iframe" />
    <Navigation class="no-print" />

    <transition name="fade">
      <router-view />
    </transition>

    <v-snackbar :timeout="-1" :value="updateExists">
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
import { onMounted } from '@vue/composition-api';

import core from '@/core';
import Navigation from '@/components/navigation/Navigation.vue';
// import Navigation from '@/components/navigation/NavigationTemporary.vue';
import update from './mixins/update';

export default Vue.extend({
  name: 'App',
  components: {
    Navigation,
  },
  mixins: [update],
  setup() {
    /**
     * Keep connection to NEST Server alive.
     * Ping every 5 min.
     */
    const keepConnectionToNESTServerAlive = () => {
      core.app.nestServer.check().then(() => {
        const NESTFrame = document.getElementById(
          'NESTFrame'
        ) as HTMLIFrameElement;
        setInterval(() => {
          NESTFrame.src = core.app.nestServer.url;
          // NESTFrame.contentDocument.location.reload(true);
        }, 300000);
      });
    };

    onMounted(() => {
      core.app.init();
      keepConnectionToNESTServerAlive();
    });
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
