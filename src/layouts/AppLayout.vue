<template :key="theme.name.value">
  <v-app>
    <v-system-bar class="d-print-none" color="systembar" flat>
      <app-bar />
    </v-system-bar>

    <v-progress-circular
      class="ma-auto"
      indeterminate
      color="primary"
      v-if="appStore.session.loading"
    />
    <router-view v-else />
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import AppBar from "@/components/app/AppBar.vue";

import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();

onMounted(() => {
  if (appStore.darkMode) {
    appStore.setDarkMode(theme);
  }
});
</script>
