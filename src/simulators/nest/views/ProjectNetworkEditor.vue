<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <network-editor-toolbar />
    <network-graph :network />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import NetworkGraph from "../components/network/NetworkGraph.vue";

import { NESTNetwork } from "../helpers/network/network";

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore = useNESTProjectStore();

const network = computed(
  () => projectStore.state.project.network as NESTNetwork
);
</script>
