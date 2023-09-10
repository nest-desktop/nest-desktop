<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <network-editor-toolbar />
    <network-graph :network="(network as Network)" />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import { Network } from "@/types/networkTypes";

import { useNorseProjectStore } from "../store/project/norseProjectStore";

const projectStore = useNorseProjectStore();
const network = computed(() => projectStore.project.network as Network);
</script>
