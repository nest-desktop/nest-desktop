<template>
  <rect id="workspaceHandler" width="100%" height="100%" />

  <g id="networkWorkspace">
    <g class="grid no-print" />
    <g>
      <path
        :style="{ strokeWidth: props.graph.config.strokeWidth }"
        class="dragline"
        d="M0,0L0,0"
        fill="none"
      />
    </g>

    <g id="network">
      <g :key="props.graph.network.connections.state.hash" class="marker">
        <defs
          :key="'defs' + index"
          :color="connection.source.view.color"
          v-for="(connection, index) of props.graph.network.connections.all"
        >
          <marker
            :id="'generic' + index"
            markerHeight="8"
            markerWidth="16"
            orient="auto"
            refX="14"
            refY="4"
            v-if="connection.view.markerEndLabel === 'generic'"
          >
            <path
              d="M10,2L14,4L10,6"
              fill="transparent"
              stroke="currentcolor"
            />
            <text dx="8" dy="5" />
          </marker>

          <marker
            :id="'exc' + index"
            markerHeight="8"
            markerWidth="16"
            orient="auto"
            refX="14"
            refY="4"
            v-if="connection.view.markerEndLabel === 'exc'"
          >
            <path
              d="M10,2L14,4L10,6L10,2L14,4"
              fill="currentcolor"
              stroke="currentcolor"
            />
            <text dx="8" dy="5" />
          </marker>

          <marker
            :id="'inh' + index"
            markerHeight="8"
            markerWidth="16"
            orient="auto"
            refX="14"
            refY="4"
            v-if="connection.view.markerEndLabel === 'inh'"
          >
            <circle
              fill="currentcolor"
              r="2"
              stroke="currentcolor"
              transform="translate(12,4)"
            />
            <text dx="8" dy="5" />
          </marker>

          <marker
            :id="'assigned' + index"
            markerHeight="10"
            markerWidth="10"
            orient="auto"
            refX="5"
            refY="5"
            v-if="connection.view.markerEndLabel === 'assigned'"
          >
            <circle
              fill="transparent"
              r="4"
              stroke="currentcolor"
              transform="translate(5,5)"
            />
            <text transform="translate(1,5)" />
          </marker>
        </defs>
      </g>

      <g id="modelAssigned" />
      <g id="connections" />
      <g id="nodes" />
    </g>

    <g id="nodeAddPanel" />
  </g>
</template>

<script lang="ts" setup>
import { NetworkGraph } from "@nest/graph/networkGraph/networkGraph";

const props = defineProps({ graph: { type: NetworkGraph, required: true } });

// import { Ref, onBeforeUnmount, onMounted, reactive, ref } from "vue";

// import { useProjectStore } from "@nest/store/project/projectStore";
// import { Network } from "@nest/core/network/network";

// const projectStore = useProjectStore();

// const networkGraphRef: Ref<null> = ref(null);

// const state = reactive({
//   graph: new NetworkGraph(
//     networkGraphRef,
//     projectStore.project.network as Network
//   ),
// });

// onMounted(() => {
//   state.graph = new NetworkGraph(
//     networkGraphRef,
//     projectStore.project.network as Network
//   );

//   const ref = state.graph.selector?.node().parentNode;
//   state.graph.resizeObserver.observe(ref);
//   state.graph.init();
// });

// onBeforeUnmount(() => {
//   state.graph.resizeObserver.disconnect();
// });
</script>

<style lang="scss">
.networkGraph {
  #workspaceHandler {
    fill: rgb(var(--v-theme-background));
  }

  path {
    stroke-linecap: round;
  }

  .marker {
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
      opacity: var(--v-high-emphasis-opacity);
      pointer-events: none;
      text-transform: uppercase !important;
    }
  }
}
</style>
