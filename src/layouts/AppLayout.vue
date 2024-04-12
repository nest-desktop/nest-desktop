<template :key="theme.name.value">
  <v-app>
    <v-system-bar class="d-print-none" color="systembar" flat>
      <app-bar />
    </v-system-bar>

    <app-request-logs />

    <v-progress-circular
      v-if="appStore.session.state.loading"
      class="ma-auto"
      color="primary"
      indeterminate
    />
    <router-view v-else />
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from "@/components/app/AppBar.vue";
import AppRequestLogs from "@/components/app/AppRequestLogs.vue";

import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

appStore.init(theme);
</script>
