<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <network-editor-toolbar />
    <network-graph :network="(network as NESTNetwork)" />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import NetworkGraph from "@/components/network/NetworkGraph.vue";

import { NESTNetwork } from "../helpers/network/nestNetwork";

import { useNESTProjectStore } from "../store/project/nestProjectStore";
const projectStore = useNESTProjectStore();

const network = computed(() => projectStore.project.network as NESTNetwork);
</script>
