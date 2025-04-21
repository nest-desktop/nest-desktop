<template>
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
          refX="12"
          refY="4"
        >
          <path
            v-if="connection.view.markerEndLabel === 'generic'"
            d="M11,2L14,4L11,6"
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
            d="M10.5,1.5L15,4L10.5,6.5"
            fill="currentcolor"
            stroke="transparent"
          />
          <slot name="synMarkerStyle" :connection />
          <text dx="8" dy="5" />
        </marker>
      </defs>
      <slot name="synMarker" :network="graph?.network" />
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
</template>

<script setup lang="ts">
import { TNetworkGraph } from "@/types";

defineProps<{ graph: TNetworkGraph }>();
</script>

<style lang="scss">
#network {
  path {
    stroke-linecap: round;
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
