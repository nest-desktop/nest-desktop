<template :key="theme.name.value">
  <v-app>
    <v-system-bar
      class="d-print-none"
      color="systembar"
      flat
    >
      <app-bar />
    </v-system-bar>

    <v-navigation-drawer
      v-model="appSessionStore.state.logsOpen"
      location="right"
      temporary
      width="400"
    >
      <v-toolbar
        color="transparent"
        density="compact"
        title="Request logs"
      >
        <v-spacer />

        <v-btn
          icon="mdi-playlist-remove"
          size="small"
          title="Clear all logs"
          @click="appSessionStore.clearLogs()"
        />
        <v-btn
          icon="mdi-menu-close"
          size="small"
          title="Close request logs"
          @click="appSessionStore.state.logsOpen = false"
        />
      </v-toolbar>
      <v-list>
        <v-list-item
          v-for="(log, index) in appSessionStore.state.requestLogs"
          :key="index"
        >
          <v-card
            :color="log.type"
            variant="tonal"
          >
            <v-toolbar
              color="transparent"
              density="compact"
            >
              <v-toolbar-title class="text-subtitle-1">
                {{ log.date }}
              </v-toolbar-title>

              <v-spacer />

              <v-btn
                icon="mdi-close"
                size="small"
                variant="text"
                @click="appSessionStore.state.requestLogs.splice(index, 1)"
              />
            </v-toolbar>

            <v-card-text>
              <span v-html="log.text" />
            </v-card-text>
          </v-card>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

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

import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useAppSessionStore } from "@/stores/appSessionStore";
const appSessionStore = useAppSessionStore();

appStore.init(theme);
</script>
