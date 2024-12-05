<template>
  <v-layout id="networkGraphLayout" class="networkGraphLayout" full-height>
    <NetworkEditorToolbar />
    <NetworkGraph :key="network.project.id" :network />
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import { BaseNetwork } from "@/helpers/network/network";

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore = usePyNNProjectStore();

const network = computed(() => projectStore.state.project?.network as BaseNetwork);
</script>
