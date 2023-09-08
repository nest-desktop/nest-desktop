<template>
  <v-app>
    <v-system-bar class="d-print-none" color="systembar" flat>
      <app-bar />
    </v-system-bar>

    <v-progress-circular
      class="ma-auto"
      indeterminate
      color="primary"
      v-if="appSessionStore.loading"
    />
    <router-view v-else />
  </v-app>
</template>

<script lang="ts" setup>
import { useAppSessionStore } from "@/store/appSessionStore";

import AppBar from "@/components/app/AppBar.vue";

const appSessionStore = useAppSessionStore();
</script>
