<template>
  <v-app v-if="nestSessionStore.loading">
    <v-progress-circular class="ma-auto" indeterminate color="primary" />
  </v-app>

  <template v-else>
    <app-navigation :nav-items="navItems" />

    <v-main>
      <router-view />
    </v-main>
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import AppNavigation from "@/components/app/AppNavigation.vue";

import { useNESTSimulatorStore } from "../store/backends/nestSimulatorStore";
import { useNESTSessionStore } from "../store/sessionStore";

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

onMounted(() => {
  const nestSimulatorStore = useNESTSimulatorStore();

  const nestServerURL = getParamFromURL("nest_server_url");
  if (nestServerURL) {
    nestSimulatorStore.url = nestServerURL;
  }

  // Store access token for NEST Server to local storage.
  const accessToken = getParamFromURL("nest_server_access_token");
  if (accessToken) {
    nestSimulatorStore.accessToken = accessToken;
  }

  nestSimulatorStore.update();
});
</script>
