<template>
  <AppNavigation :navItems />

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import AppNavigation from "@/components/app/AppNavigation.vue";
import { TBackendStore } from "@/stores/defineBackendStore";
import { getParamFromURL } from "@/utils/paramQuery";
import nestSimulator from "../stores/backends/nestSimulatorStore";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNESTModuleStore } from "../stores/moduleStore";
const nestModuleStore = useNESTModuleStore();

const route = useRoute();

const navItems = [
  {
    icon: "mdi:mdi-tools",
    id: "nestProject",
    simulator: "nest",
    title: "Sandbox",
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

onMounted(() => {
  const backends = appStore.currentSimulator.backends;
  const stores = appStore.currentSimulator.stores;

  // Store URL of NEST Server from the query.
  const nestServerURL = getParamFromURL(route, "nest_server_url");
  if (nestServerURL) {
    backends.nest.state.url = nestServerURL;
  }

  // Store access token for NEST Server from the query.
  const accessToken = getParamFromURL(route, "nest_server_access_token");
  if (accessToken) {
    backends.nest.state.accessToken = accessToken;
  }

  // Update and check backends.
  Object.values(backends).forEach((backend: TBackendStore) => {
    if (backend.state.response.status != 200) {
      backend.update();
    }
  });

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();

  nestSimulator.fetchModels();
  nestModuleStore.init();
});
</script>
