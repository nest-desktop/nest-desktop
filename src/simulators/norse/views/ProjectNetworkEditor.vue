<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <NetworkEditorToolbar />
    <NetworkGraph :network />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";

import { NorseNetwork } from "../helpers/network/network";

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore = useNorseProjectStore();

const network = computed(
  () => projectStore.state.project.network as NorseNetwork
);
</script>
