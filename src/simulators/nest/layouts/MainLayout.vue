<template>
  <v-app v-if="nestSessionStore.loading">
    <v-container class="fill-height">
      <v-progress-circular class="ma-auto" color="primary" indeterminate />
    </v-container>

    <AppFooter />
  </v-app>

  <template v-else>
    <AppNavigation :navItems />

    <v-main>
      <router-view />
    </v-main>
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import AppFooter from "@/components/app/AppFooter.vue";
import AppNavigation from "@/components/app/AppNavigation.vue";
import { getParamFromURL } from "@/helpers/common/paramQuery";

import { useNESTSessionStore } from "../stores/sessionStore";
import { useNESTSimulatorStore } from "../stores/backends/nestSimulatorStore";
import { useNESTModelStore } from "../stores/model/modelStore";
import { useNESTProjectStore } from "../stores/project/projectStore";

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
    nestSimulatorStore.backendConfigStore.state.url = nestServerURL;
  }

  // Store access token for NEST Server from the query.
  const accessToken = getParamFromURL(route, "nest_server_access_token");
  if (accessToken) {
    nestSimulatorStore.state.accessToken = accessToken;
  }

  nestSimulatorStore.update();

  modelStore.init();
  projectStore.init();
  nestSessionStore.loading = false;
});
</script>
