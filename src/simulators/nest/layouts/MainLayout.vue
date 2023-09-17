<template>
  <app-navigation :nav-items="navItems" />

  <v-main>
    <v-app v-if="nestSessionStore.loading">
      <v-progress-circular class="ma-auto" indeterminate color="primary" />
    </v-app>

    <router-view v-else />
  </v-main>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

import AppNavigation from "@/components/app/AppNavigation.vue";

import { useNESTSimulatorStore } from "../store/backends/nestSimulatorStore";
import { useNESTSessionStore } from "../store/sessionStore";
import { onUpdated } from "vue";

const nestSessionStore = useNESTSessionStore();

const navItems = [
  {
    icon: "network:network",
    id: "nestProject",
    simulator: "nest",
    title: "Project",
    to: { name: "nestProjectRoot" },
  },
  {
    icon: "nest:logo",
    id: "nestModel",
    simulator: "nest",
    title: "Model",
    to: { name: "nestModelRoot" },
  },
];

/**
 * Get parameter from URL.
 */
const getParamFromURL = (paramKey: string) => {
  const route = useRoute();

  let param: string | null;
  if (route.query[paramKey]) {
    param = route.query[paramKey] as string;
  } else if (route.params[paramKey]) {
    param = route.params[paramKey] as string;
  } else {
    param = new URLSearchParams(window.location.search).get(paramKey);
  }
  return param;
};

onUpdated(() => {
  const nestSimulatorStore = useNESTSimulatorStore();

  const nestServerURL = getParamFromURL("nest_server_url");
  if (nestServerURL) {
    nestSimulatorStore.url = nestServerURL;
  }

  const nestServerAccessToken = "nest_server_access_token";
  let token: string | null;

  // Store access token for NEST Server to local storage.
  token = getParamFromURL(nestServerAccessToken);
  if (token) {
    localStorage.setItem(nestServerAccessToken, token);
  }

  // Update access token for NEST Server from local storage.
  token = localStorage.getItem(nestServerAccessToken);
  if (token) {
    const nestSimulatorInstance = nestSimulatorStore.instance;
    nestSimulatorInstance.defaultConfig.headers.NESTServerAuth = token;
  }
});
</script>
