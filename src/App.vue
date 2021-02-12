<template>
  <v-app>
    <Navigation class="no-print" />

    <transition name="fade">
      <router-view />
    </transition>
  </v-app>
</template>

<script>
import Vue from 'vue';
import { onMounted } from '@vue/composition-api';
import Navigation from '@/components/navigation/Navigation.vue';
// import Navigation from '@/components/navigation/NavigationTemporary.vue';
import core from '@/core/index';

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
