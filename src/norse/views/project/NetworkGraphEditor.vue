<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <network-editor-toolbar />
    <network-graph :network="network" />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useProjectStore } from "@norse/store/project/projectStore";
import { Network } from "@norse/core/network/network";

import NetworkGraph from "@norse/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@norse/components/network/NetworkEditorToolbar.vue";

const projectStore = useProjectStore();
const network = computed(() => projectStore.project.network as Network);
</script>
