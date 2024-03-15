<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <network-editor-toolbar />
    <network-graph :network />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import { BaseNetwork } from "@/helpers/network/network";

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore = usePyNNProjectStore();

const network = computed(
  () => projectStore.state.project.network as BaseNetwork
);
</script>
