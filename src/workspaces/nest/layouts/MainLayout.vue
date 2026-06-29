<template>
  <AppNavigation :nav-items />

  <v-main v-if="appStore.state.currentWorkspace === 'nest'">
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import type { TStore } from "@/types";
import { AppNavigation } from "@/nav/components";
import { getParamFromURL } from "@/utils";
import { getCurrentWorkspace, useAppStore } from "@/app";

import nestSimulator from "../backends/nestSimulator";
import { useNESTModuleStore } from "../module";

const route = useRoute();
const appStore = useAppStore();
const nestModuleStore = useNESTModuleStore();

const navItems = [
  {
    icon: "mdi:mdi-tools",
    id: "nestProject",
    workspace: "nest",
    title: "Sandbox",
    to: { name: "nestProjectRoot" },
  },
  {
    icon: "nest:logo",
    id: "nestModel",
    workspace: "nest",
    title: "Model",
    to: { name: "nestModelRoot" },
  },
  {
    icon: "mdi:mdi-sitemap-outline",
    id: "nestCode",
    workspace: "nest",
    title: "Code",
    to: { name: "nestCodeGraphLayout" },
  },
];

onMounted(() => {
  const currentWorkspace = getCurrentWorkspace();
  if (!currentWorkspace) return;

  const backends = currentWorkspace.backends;
  const stores = currentWorkspace.stores;

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
  Object.values(backends).forEach((backendStore: TStore) => {
    if (backendStore.state.response.status != 200) {
      backendStore.update();
    }
  });

  // Initialize model and project stores.
  stores.modelStore.init();
  stores.projectStore.init();

  nestSimulator.fetchModels();
  nestModuleStore.init();
});
</script>
