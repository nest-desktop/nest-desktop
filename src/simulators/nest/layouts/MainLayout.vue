<template>
  <AppNavigation :nav-items />

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { AxiosResponse } from "axios";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import AppNavigation from "@/components/app/AppNavigation.vue";
import { TBackendStore } from "@/stores/defineBackendStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { getParamFromURL } from "@/utils/paramQuery";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

import { useNESTProjectStore } from "../stores/project/projectStore";
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
  const backends = appStore.currentSimulator.backends;

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
  modelStore.init();
  projectStore.init();

  const getElementType = (modelId: string) => {
    if (modelId.endsWith("generator") || modelId.endsWith("dilutor")) {
      return "stimulator";
    } else if (
      modelId.endsWith("meter") ||
      modelId.endsWith("detector") ||
      modelId.endsWith("recorder")
    ) {
      return "recorder";
    } else if (
      modelId.includes("synapse") ||
      modelId.includes("connection") ||
      modelId.startsWith("rate") ||
      modelId == "volume_transmitter" ||
      modelId == "gap_junction"
    ) {
      return "synapse";
    }
    return "neuron";
  };

  backends.nest
    .axiosInstance()
    .get("/api/Models")
    .then((response: AxiosResponse) => {
      if (response.data && response.data.length > 0) {
        modelStore.state.models = response.data.map((modelId: string) => ({
          id: modelId,
          elementType: getElementType(modelId),
        }));
      }
    });
});
</script>
