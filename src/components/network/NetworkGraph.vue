<template>
  <div style="width: 100%; height: 100%">
    <svg ref="networkGraphRef" class="networkGraph" height="100%" width="100%">
      <rect id="workspaceHandler" height="100%" width="100%" />

      <g id="networkWorkspace">
        <g class="grid no-print" />

        <g id="network">
          <g :key="graph?.network.connections.all.length" class="synMarker">
            <defs
              v-for="(connection, index) of graph?.network.connections.all"
              :key="'defs' + index"
              :style="{
                color: 'var(--colorNode' + connection.sourceIdx + ')',
              }"
            >
              <marker
                :id="'syn-' + index"
                :key="connection.hash"
                markerHeight="8"
                markerWidth="16"
                orient="auto"
                refX="14"
                refY="4"
              >
                <path
                  v-if="connection.view.markerEndLabel === 'generic'"
                  d="M10,2L14,4L10,6"
                  fill="transparent"
                  stroke="currentcolor"
                />
                <circle
                  v-if="connection.view.markerEndLabel === 'inh'"
                  fill="currentcolor"
                  r="2"
                  stroke="currentcolor"
                  transform="translate(12,4)"
                />
                <path
                  v-if="connection.view.markerEndLabel === 'exc'"
                  d="M10,2L14,4L10,6L10,2L14,4"
                  fill="currentcolor"
                  stroke="currentcolor"
                />
                <slot name="marker" :connection />
                <text dx="8" dy="5" />
              </marker>
            </defs>
          </g>

          <g class="dragline">
            <path :style="{ strokeWidth: graph?.config?.localStorage.strokeWidth }" d="M0,0L0,0" fill="none" />
          </g>

          <slot name="components">
            <g id="nodeGroups" />
            <g id="connections" />
            <g id="nodes" />
          </slot>
        </g>

        <g id="nodeAddPanel" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { TNetwork } from "@/types";

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
  path {
    stroke-linecap: round;
  }

  #workspaceHandler {
    fill: rgb(var(--v-theme-background));
  }

  .connection {
    cursor: pointer;
  }

  .dragline {
    pointer-events: none;
  }

  .node {
    text {
      font-size: 12px;
      opacity: var(--v-medium-emphasis-opacity);
      pointer-events: none;
      text-transform: uppercase !important;
    }

    .shape {
      cursor: pointer;
      fill: rgb(var(--v-theme-background));
    }
  }

  .nodeGroup {
    path {
      cursor: pointer;
    }

    .shape {
      cursor: pointer;
    }
  }

  .synMarker {
    text {
      font-size: 4px;
      font-weight: 700;
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
}
</style>
