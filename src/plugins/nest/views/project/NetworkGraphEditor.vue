<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <network-editor-toolbar />
    <network-graph :network="(network as Network)" />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useProjectStore } from "@nest/store/project/projectStore";
import { Network } from "@nest/core/network/network";

import NetworkGraph from "@nest/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@nest/components/network/NetworkEditorToolbar.vue";

const projectStore = useProjectStore();
const network = computed(() => projectStore.project.network as Network);
</script>
