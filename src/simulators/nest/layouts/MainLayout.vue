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
import { getParamFromURL } from "@/utils/paramQuery";

import { useNESTSessionStore } from "../store/sessionStore";
import { useNESTSimulatorStore } from "../store/backends/nestSimulatorStore";
import { useNESTModelStore } from "../store/model/modelStore";
import { useNESTProjectStore } from "../store/project/projectStore";

const modelStore = useNESTModelStore();
const nestSessionStore = useNESTSessionStore();
const nestSimulatorStore = useNESTSimulatorStore();
const projectStore = useNESTProjectStore();
const route = useRoute();

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

onMounted(() => {
  // Store URL of NEST Server from the query.
  const nestServerURL = getParamFromURL(route, "nest_server_url");
  if (nestServerURL) {
    nestSimulatorStore.url = nestServerURL;
  }

  // Store access token for NEST Server from the query.
  const accessToken = getParamFromURL(route, "nest_server_access_token");
  if (accessToken) {
    nestSimulatorStore.accessToken = accessToken;
  }

  nestSimulatorStore.update();

  modelStore.init();
  projectStore.init();
  nestSessionStore.loading = false;
});
</script>
