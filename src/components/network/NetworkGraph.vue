<template>
  <div style="width: 100%; height: 100%">
    <svg ref="networkGraphRef" class="networkGraph" height="100%" width="100%">
      <rect id="workspaceHandler" height="100%" width="100%" />

      <g id="networkWorkspace">
        <g class="grid no-print" />

        <NetworkGraphContent :graph />

        <g id="nodeAddPanel" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { TNetwork } from "@/types";

import NetworkGraphContent from "./NetworkGraphContent.vue";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();

const props = defineProps<{ network: TNetwork }>();
const network = computed(() => props.network);

const graph = computed(() => networkGraphStore.state.graph as BaseNetworkGraph);

const networkGraphRef: Ref<HTMLElement | null> = ref<HTMLElement | null>(null);

onMounted(() => {
  networkGraphStore.mount(new BaseNetworkGraph(networkGraphRef, network.value));
});

onBeforeUnmount(() => {
  networkGraphStore.unmount();
});
</script>

<style lang="scss">
.networkGraph {
  #workspaceHandler {
    fill: rgb(var(--v-theme-background));
  }
}
</style>
