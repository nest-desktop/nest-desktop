<template>
  <v-app>
    <!-- <v-system-bar app flat color="white">
      NEST Desktop
    </v-system-bar> -->

    <!-- <v-app-bar app dense flat dark color="primary">
      <v-toolbar-title>
        NEST Desktop
      </v-toolbar-title>
    </v-app-bar> -->

    <Navigation />

    <transition name="fade">
      <router-view />
    </transition>
  </v-app>
</template>

<script>
import Vue from 'vue';
import Navigation from '@/components/Navigation.vue';
// import Navigation from '@/components/NavigationTemporary.vue';
import core from '@/core/index';

export default Vue.extend({
  name: 'App',
  components: {
    Navigation,
  },
  setup() {
    core.app.init();
  },
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
