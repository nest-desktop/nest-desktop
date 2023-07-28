<template>
  <svg class="networkGraph" height="100%" ref="networkGraphRef" width="100%">
    <rect id="workspaceHandler" width="100%" height="100%" />

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
        <g :key="graph?.network.connections.all.length" class="synMarker">
          <defs
            :key="'defs' + index"
            :color="connection.source.view.color"
            v-for="(connection, index) of graph?.network.connections.all"
          >
            <marker
              :key="connection.state.hash"
              :id="'syn-' + index"
              markerHeight="8"
              markerWidth="16"
              orient="auto"
              refX="14"
              refY="4"
            >
              <path
                d="M10,2L14,4L10,6"
                fill="transparent"
                stroke="currentcolor"
                v-if="connection.view.markerEndLabel === 'generic'"
              />
              <circle
                fill="currentcolor"
                r="2"
                stroke="currentcolor"
                transform="translate(12,4)"
                v-if="connection.view.markerEndLabel === 'inh'"
              />
              <path
                d="M10,2L14,4L10,6L10,2L14,4"
                fill="currentcolor"
                stroke="currentcolor"
                v-if="connection.view.markerEndLabel === 'exc'"
              />
              <circle
                fill="transparent"
                r="4"
                stroke="currentcolor"
                transform="translate(5,5)"
                v-if="connection.view.markerEndLabel === 'assigned'"
              />
              <text dx="8" dy="5" />
            </marker>
          </defs>
        </g>

        <g id="modelAssigned" />
        <g id="connections" />
        <g id="nodes" />
      </g>

      <g id="nodeAddPanel" />
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";

import { useNetworkGraphStore } from "@nest/store/graph/networkGraphStore";

import { Network } from "@nest/core/network/network";
import { NetworkGraph } from "@/nest/graph/networkGraph/networkGraph";

const props = defineProps({ network: Network });
const network = computed(() => props.network as Network);
const graph = computed(() => {
  return networkGraphStore.graph as NetworkGraph;
});

const networkGraphStore = useNetworkGraphStore();
const networkGraphRef: Ref<null> = ref(null);

onMounted(() => {
  networkGraphStore.mount(networkGraphRef, network.value);
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
      stroke: rgb(var(--v-border-color));
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
