<template>
  <div style="width: 100%; height: 100%">
    <svg ref="networkGraphRef" class="networkGraph" height="100%" width="100%">
      <rect id="workspaceHandler" height="100%" width="100%" />

      <g id="networkWorkspace">
        <g class="grid no-print" />

        <NetworkGraphContent :graph>
          <template v-if="network.copyModels.synapseModels.length" #synMarker>
            <defs
              v-for="(model, index) of network.copyModels.synapseModels"
              :key="'defs' + index"
              :style="{
                color: 'var(--colorNode' + model.weightRecorder.idx + ')',
              }"
            >
              <marker
                :id="'assigned-' + model.weightRecorder.idx"
                :key="model.weightRecorder.hash"
                class="assigned"
                markerHeight="18"
                markerWidth="18"
                orient="auto"
                refX="12"
                refY="12"
              >
                <circle
                  fill="transparent"
                  r="4"
                  stroke="currentcolor"
                  style="stroke-dasharray: 2"
                  transform="translate(12,12)"
                />
              </marker>
            </defs>
          </template>

          <template #components>
            <g id="nodeGroups" />
            <g id="modelAssigned" />
            <g id="connections" />
            <g id="nodes" />
          </template>
        </NetworkGraphContent>

        <g id="nodeAddPanel" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";

import NetworkGraphContent from "@/components/network/NetworkGraphContent.vue";
import { NESTNetworkGraph } from "../../helpers/network/networkGraph";
import { NESTNetwork } from "../../types";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();

const props = defineProps<{ network: NESTNetwork }>();
const network = computed(() => props.network as NESTNetwork);

const graph = computed(() => networkGraphStore.state.graph as NESTNetworkGraph);

const networkGraphRef: Ref<HTMLElement | null> = ref<HTMLElement | null>(null);

onMounted(() => {
  networkGraphStore.mount(new NESTNetworkGraph(networkGraphRef, network.value));
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

// .assigned circle {
//   animation-name: assigned-animation;
//   animation-duration: 5s;
//   animation-timing-function: linear;
//   animation-delay: 0s;
//   animation-iteration-count: infinite;
//   animation-direction: normal;
// }

// @keyframes assigned-animation {
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }
</style>
