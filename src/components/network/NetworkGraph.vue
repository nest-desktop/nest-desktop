<template>
  <div style="width: 100%; height: 100%">
    <v-chip @click="graph?.updateHash()" size="small" variant="text">
      {{ graph?.hash }}
    </v-chip>

    <div style="width: 320px">
      <NodeMenu
        :model-value="graph?.state.nodeMenu.open"
        :node="graph?.state.nodeMenu.node as TNode"
        :offset="graph?.state.nodeMenu.offset"
        v-if="graph?.state.nodeMenu.node"
      />
    </div>

    <svg class="networkGraph" height="100%" ref="networkGraphRef" width="100%">
      <rect height="100%" id="workspaceHandler" width="100%" />

      <g id="networkWorkspace">
        <g class="grid no-print" />

        <g id="network">
          <g :key="graph?.network.connections.all.length" class="synMarker">
            <defs
              :key="'defs' + index"
              :style="{
                color: 'var(--node' + connection.source.idx + '-color)',
              }"
              v-for="(connection, index) of graph?.network.connections.all"
            >
              <marker
                :key="connection.hash"
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

          <g class="dragline">
            <path
              :style="{ strokeWidth: graph?.config?.localStorage.strokeWidth }"
              d="M0,0L0,0"
              fill="none"
            />
          </g>

          <g id="nodeGroups" />
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

import NodeMenu from "../node/NodeMenu.vue";
import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { TNetwork, TNode } from "@/types";

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
      font-size: 12px;
      opacity: var(--v-medium-emphasis-opacity);
      pointer-events: none;
      text-transform: uppercase !important;
    }
  }

  .nodeGroup {
    text {
      opacity: 1;
    }
    path {
      cursor: pointer;
    }
  }
}
</style>
