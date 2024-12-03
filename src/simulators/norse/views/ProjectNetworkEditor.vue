<template>
  <v-layout
    id="networkGraphLayout"
    class="networkGraphLayout"
    full-height
  >
    <NetworkEditorToolbar />
    <NetworkGraph
      :key="network.project.id"
      :network
    />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { NorseNetwork } from "../helpers/network/network";

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNorseProjectStore();

const network = computed(
  () => projectStore.state.project.network as NorseNetwork
);
</script>
