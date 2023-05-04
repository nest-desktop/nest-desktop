<template>
  <v-app>
    <v-system-bar flat color="systembar">
      <app-bar />
    </v-system-bar>

    <v-navigation-drawer permanent rail rail-width="64">
      <app-navigation />

      <template #append>
        <div>
          <v-btn
            href="https://nest-desktop.readthedocs.io"
            prepend-icon="mdi-help-circle-outline"
            rounded="0"
            size="small"
            stacked
            target="_blank"
            title="Help"
            variant="text"
          >
            Help
          </v-btn>
          <v-btn
            :active="false"
            prepend-icon="mdi-information-variant"
            rounded="0"
            size="small"
            stacked
            title="About"
            to="/"
            variant="text"
          >
            About
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from "./AppBar.vue";
import AppNavigation from "./AppNavigation.vue";
</script>
