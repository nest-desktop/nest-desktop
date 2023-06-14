<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <svg class="networkGraph" height="600" ref="networkGraph" width="800">
      <g
        :key="state.graph.network.connections.state.connectionsLength"
        class="marker"
        v-if="state.graph"
      >
        <defs
          :key="'defs' + index"
          :color="connection.source.view.color"
          v-for="(connection, index) of state.graph.network.connections.all"
        >
          <marker
            :id="'generic' + index"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="4"
          >
            <path d="M2,2L6,4L2,6" fill="transparent" stroke="currentcolor" />
          </marker>

          <marker
            :id="'exc' + index"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="4"
          >
            <path
              d="M2,2L6,4L2,6L2,2L6,4"
              fill="currentcolor"
              stroke="currentcolor"
            />
          </marker>

          <marker
            :id="'inh' + index"
            markerHeight="6"
            markerWidth="6"
            orient="auto"
            refX="5"
            refY="3"
          >
            <circle
              fill="currentcolor"
              r="2"
              stroke="currentcolor"
              transform="translate(3,3)"
            />
          </marker>

          <marker
            :id="'assigned' + index"
            markerHeight="10"
            markerWidth="10"
            orient="auto"
            refX="5"
            refY="5"
          >
            <circle
              fill="transparent"
              r="4"
              stroke="currentcolor"
              style="opacity: 0.5"
              transform="translate(5,5)"
            />
          </marker>
        </defs>
      </g>

      <rect
        :fill="
          state.graph && state.graph.config.transparentWorkspace
            ? 'transparent'
            : darkMode()
            ? '#121212'
            : 'white'
        "
        id="workspaceHandler"
      />

      <g id="networkWorkspace">
        <g class="grid no-print" />
        <g v-if="state.graph">
          <path
            :style="{ strokeWidth: state.graph.config.strokeWidth }"
            class="dragline"
            d="M0,0L0,0"
            fill="none"
            stroke-linecap="round"
          />
        </g>

        <g id="modelAssigned" />
        <g id="connections" />
        <g id="nodes" />

        <g id="nodeAddPanel" />
      </g>
    </svg>
  </v-layout>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeMount, ref, Ref } from "vue";

import { darkMode } from "@/helpers/theme";
import { NetworkGraph } from "@nest/graph/networkGraph/networkGraph";

const networkGraph: Ref<null> = ref(null);

const state = reactive({
  graph: new NetworkGraph(networkGraph),
});

function observeSize() {
  const resizeObserver = new ResizeObserver(function () {
    // console.log("Size changed");
    const networkGraphLayout = document.getElementById("networkGraphLayout");
    if (networkGraphLayout) {
      state.graph.workspace.resize(
        networkGraphLayout.offsetWidth,
        networkGraphLayout.offsetHeight
      );
      state.graph.workspace.updateTransform();
    }
  });

  // @ts-ignore
  resizeObserver.observe(document.getElementById("networkGraphLayout"));
}

/**
 * Update network graph.
 */
const update = () => {
  state.graph.workspace.init();
  state.graph.update();
  state.graph.workspace.update();
};

onMounted(() => {
  observeSize();
  window.addEventListener("darkmode", () => state.graph.render());

  state.graph = new NetworkGraph(networkGraph);

  update();
});

onBeforeMount(() => {
  window.removeEventListener("darkmode", () => state.graph.render());
});
</script>

<style lang="scss">
.networkGraph {
  .connection {
    cursor: pointer;
  }

  .node {
    .shape {
      cursor: pointer;
    }
    text {
      font-size: 12px;
      pointer-events: none;
    }
    .dragline {
      pointer-events: none;
    }
  }
}
</style>
