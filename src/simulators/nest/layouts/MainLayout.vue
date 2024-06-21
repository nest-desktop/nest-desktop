<template>
  <AppNavigation :nav-items />

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import AppNavigation from "@/components/app/AppNavigation.vue";
import { getParamFromURL } from "@/helpers/common/paramQuery";

import { TBackendStore } from "@/stores/defineBackendStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { useInsiteAccessStore } from "../stores/backends/insiteAccessStore";
import { useNESTModelStore } from "../stores/model/modelStore";
import { useNESTProjectStore } from "../stores/project/projectStore";
import { useNESTSimulatorStore } from "../stores/backends/nestSimulatorStore";
import { AxiosResponse } from "axios";

const insiteAccessStore: TBackendStore = useInsiteAccessStore();
const modelStore: TModelStore = useNESTModelStore();
const nestSimulatorStore: TBackendStore = useNESTSimulatorStore();
const projectStore: TProjectStore = useNESTProjectStore();

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
  // Store URL of NEST Server from the query.
  const nestServerURL = getParamFromURL(route, "nest_server_url");
  if (nestServerURL) {
    nestSimulatorStore.state.url = nestServerURL;
  }

  // Store access token for NEST Server from the query.
  const accessToken = getParamFromURL(route, "nest_server_access_token");
  if (accessToken) {
    nestSimulatorStore.state.accessToken = accessToken;
  }

  // Update and check backends.
  nestSimulatorStore.update();
  insiteAccessStore.update();

  // Initialize project and model stores.
  modelStore.init();
  projectStore.init();

  nestSimulatorStore
    .axiosInstance()
    .get("/api/Models")
    .then((response: AxiosResponse) => {
      // console.log(response);
      if (response.data && response.data.length > 0) {
        modelStore.state.models = response.data;
      }
    });
});
</script>
