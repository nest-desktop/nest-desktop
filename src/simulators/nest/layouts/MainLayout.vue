<template>
  <v-app v-if="nestStore.state.loading">
    <v-container class="fill-height">
      <v-progress-circular class="ma-auto" color="primary" indeterminate />
    </v-container>

    <AppFooter />
  </v-app>

  <template v-else>
    <AppNavigation :nav-items />

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

import { useNESTModelStore } from "../stores/model/modelStore";
import { useNESTProjectStore } from "../stores/project/projectStore";
import { useNESTStore } from "../stores/nestStore";
import { useNESTSimulatorStore } from "../stores/backends/nestSimulatorStore";

const modelStore = useNESTModelStore();
const nestStore = useNESTStore();
const nestSimulatorStore = useNESTSimulatorStore();
const projectStore = useNESTProjectStore();

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
  let changed = false;

  // Store URL of NEST Server from the query.
  const nestServerURL = getParamFromURL(route, "nest_server_url");
  if (nestServerURL) {
    nestSimulatorStore.state.url = nestServerURL;
    changed = true;
  }

  // Store access token for NEST Server from the query.
  const accessToken = getParamFromURL(route, "nest_server_access_token");
  if (accessToken) {
    nestSimulatorStore.state.accessToken = accessToken;
    changed = true;
  }

  if (changed) {
    nestSimulatorStore.update();
  }

  // Initialize project and model stores.
  modelStore.init();
  projectStore.init();

  // Loading off.
  nestStore.state.loading = false;
});
</script>
