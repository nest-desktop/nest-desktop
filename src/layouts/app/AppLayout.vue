<template>
  <v-app>
    <v-system-bar flat color="systembar">
      <app-bar />
    </v-system-bar>

    <v-navigation-drawer permanent rail rail-width="64">
      <app-navigation />

      <template #append>
        <v-row align="center" justify="center" no-gutters>
          <v-btn
            @click="toggleTheme"
            icon="mdi-theme-light-dark"
            size="small"
            title="Toggle dark mode"
            variant="plain"
          />
          <v-btn
            prepend-icon="mdi-cogs"
            rounded="0"
            size="x-small"
            stacked
            title="Settings"
            variant="plain"
          >
            Settings
          </v-btn>
          <v-btn
            href="https://nest-desktop.readthedocs.io"
            prepend-icon="mdi-help-circle-outline"
            rounded="0"
            size="x-small"
            stacked
            target="_blank"
            title="Help"
            variant="plain"
          >
            Help
          </v-btn>
          <v-btn
            :active="false"
            prepend-icon="mdi-information-variant"
            rounded="0"
            size="x-small"
            stacked
            title="About"
            to="/"
            variant="plain"
          >
            About
          </v-btn>
        </v-row>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";
const theme = useTheme();

import AppBar from "./AppBar.vue";
import AppNavigation from "./AppNavigation.vue";

const toggleTheme = () =>
  (theme.global.name.value = theme.global.current.value.dark
    ? "light"
    : "dark");
</script>
