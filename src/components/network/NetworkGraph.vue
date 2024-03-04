<template>
  <div style="width: 100%; height: 100%">
    <v-chip @click="graph.updateHash()" size="small" variant="text">
      {{ graph?.state.hash }}
    </v-chip>

    <svg class="networkGraph" height="100%" ref="networkGraphRef" width="100%">
      <rect height="100%" id="workspaceHandler" width="100%" />

      <g id="networkWorkspace">
        <g class="grid no-print" />
        <g>
          <path
            :style="{ strokeWidth: graph?.config.strokeWidth }"
            class="dragline"
            d="M0,0L0,0"
            fill="none"
          />
        </g>

        <g id="network">
          <g id="connections" />
          <g id="nodes" />
        </g>

        <g id="nodeAddPanel" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { Network, NetworkPropTypes } from "@/types/networkTypes";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();

const props = defineProps({ network: NetworkPropTypes });
const network = computed(() => props.network as Network);
const graph = computed(() => {
  return networkGraphStore.state.graph as BaseNetworkGraph;
});

const networkGraphRef: Ref<null> = ref(null);

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

  path {
    stroke-linecap: round;
  }

  .synMarker {
    text {
      font-size: 4px;
      font-weight: 100;
      pointer-events: none;
      stroke-width: 0.5px;
      stroke: rgb(var(--v-on-background));
      vertical-align: middle;
      text-anchor: end;
    }

    text.toLeft {
      text-anchor: start;
      transform: rotate(180deg);
    }
  }

  .connection {
    cursor: pointer;
  }

  .dragline {
    pointer-events: none;
  }

  .node {
    .shape {
      cursor: pointer;
      fill: rgb(var(--v-theme-background));
    }
    text {
      fill: rgb(var(--v-border-color));
      font-size: 12px;
      opacity: var(--v-medium-emphasis-opacity);
      pointer-events: none;
      text-transform: uppercase !important;
    }
  }
}
</style>
