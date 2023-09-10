<template>
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
import { useTheme } from "vuetify";

import AppBar from "@/components/app/AppBar.vue";

import { useAppStore } from "@/store/appStore";

const theme = useTheme();
const appStore = useAppStore();

onMounted(() => {
  theme.global.name.value = appStore.darkMode ? "dark" : "light";
});
</script>
