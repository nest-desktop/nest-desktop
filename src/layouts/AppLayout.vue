<template :key="theme.name.value">
  <v-app>
    <v-system-bar class="d-print-none" color="systembar" flat>
      <app-bar />
    </v-system-bar>

    <v-progress-circular
      class="ma-auto"
      color="primary"
      indeterminate
      v-if="appStore.session.state.loading"
    />
    <router-view v-else />
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from "@/components/app/AppBar.vue";

import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
appStore.init(theme);
</script>
