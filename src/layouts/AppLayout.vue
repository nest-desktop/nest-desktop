<template :key="theme.name.value">
  <v-app>
    <v-system-bar class="d-print-none" color="systembar" flat>
      <AppBar />
    </v-system-bar>

    <AppRequestLogs />

    <router-view />

    <v-overlay :model-value="appStore.state.loading" class="align-center justify-center" scroll-strategy="block">
      <v-card>
        <v-card-text>
          <v-row align-content="center" class="fill-height" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              {{ appStore.state.loadingText }}
            </v-col>
            <v-col cols="6">
              <v-progress-linear height="3" indeterminate rounded />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-overlay>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from "@/components/app/AppBar.vue";
import AppRequestLogs from "@/components/app/AppRequestLogs.vue";

import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

appStore.init(theme);
</script>
