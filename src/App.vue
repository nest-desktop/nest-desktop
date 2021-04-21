<template>
  <v-app>
    <Navigation class="no-print" />

    <transition name="fade">
      <router-view />
    </transition>

    <iframe id="NESTFrame" style="display:none;position:absolute" />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted } from '@vue/composition-api';

import core from '@/core';
import Navigation from '@/components/navigation/Navigation.vue';
// import Navigation from '@/components/navigation/NavigationTemporary.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Navigation,
  },
  setup() {
    onMounted(() => {
      core.app.init();
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
