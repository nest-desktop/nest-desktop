<template>
  <div style="width: 100%; height: 100%">
    <svg ref="networkGraphRef" class="networkGraph" height="100%" width="100%">
      <rect id="workspaceHandler" height="100%" width="100%" />

      <g id="networkWorkspace">
        <g class="grid no-print" />

        <NetworkGraphContent />

        <g id="nodeAddPanel" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { type Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";

import type { TNetwork } from "@/types";
import { BaseNetworkGraph, mountNetworkGraph, unmountNetworkGraph } from "@/networkGraph";

import NetworkGraphContent from "./NetworkGraphContent.vue";

const props = defineProps<{ network: TNetwork }>();
const network = computed(() => props.network);

const networkGraphRef: Ref<HTMLElement | null> = ref<HTMLElement | null>(null);

onMounted(() => mountNetworkGraph(new BaseNetworkGraph(networkGraphRef, network.value)));
onBeforeUnmount(() => unmountNetworkGraph());
</script>

<style lang="scss">
.networkGraph {
  #workspaceHandler {
    fill: rgb(var(--v-theme-background));
  }
}
</style>
