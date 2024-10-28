<template>
  <v-toolbar
    :class="{ collapse: state.collapse }"
    :collapse="state.collapse"
    :key="graph?.network.hash"
    absolute
    class="toolbar"
    color="background"
    density="compact"
  >
    <div v-if="graph" style="position: absolute">
      <div style="width: 320px">
        <ContextMenu
          :target="graph.state.contextMenu.target"
          v-model="graph.state.contextMenu.modelValue"
        >
          <slot name="ContextMenuList" :graph>
            <ConnectionMenuList
              :connection="(graph.state.contextMenu.connection as TConnection)"
              v-if="graph.state.contextMenu.connection"
            />
            <NodeMenuList
              :node="(graph.state.contextMenu.node as TNode)"
              v-if="graph.state.contextMenu.node"
            />
            <NodeGroupMenuList
              :nodeGroup="(graph.state.contextMenu.nodeGroup as NodeGroup)"
              v-if="graph.state.contextMenu.nodeGroup"
            />
          </slot>
        </ContextMenu>

        <v-menu
          :target="graph.workspace.nodeAddPanel.state.target"
          v-model="graph.workspace.nodeAddPanel.state.modelValue"
        >
          <template #activator="{ props }">
            <slot name="activator" v-bind="props" />
          </template>

          <v-list>
            <v-list-subheader>
              Select a
              {{ graph.workspace.nodeAddPanel.state.elementType }} model
            </v-list-subheader>
            <v-list-item
              :key="index"
              @click="() => item.onClick()"
              v-for="(item, index) in graph.workspace.nodeAddPanel.state
                .menuItems"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-btn
      @click="state.collapse = !state.collapse"
      :icon="state.collapse ? 'mdi:mdi-chevron-right' : 'mdi:mdi-chevron-left'"
      class="icon"
      size="x-small"
    />

    <v-btn
      :disabled="graph?.network.isEmpty"
      @click="emptyNetwork()"
      class="icon"
      icon="mdi:mdi-trash-can-outline"
      size="x-small"
      title="Delete all network elements"
    />

    <v-btn
      :disabled="!graph?.network.nodes.hasAnySelectedNodes"
      @click="groupSelectedNodes()"
      class="icon"
      icon="mdi:mdi-select-group"
      size="x-small"
    />

    <template v-if="!state.collapse">
      <!-- <v-btn
        @click="downloadNetworkGraph()"
        icon="mdi:mdi-camera"
        size="small"
        title="Export network graph"
      /> -->

      <v-btn
        :key="index"
        @click.stop="node.unselect()"
        icon
        size="x-small"
        v-for="(node, index) in graph?.network.nodes.state.selectedNodes"
      >
        <NodeAvatar :node="(node as TNode)" :size="32" />
      </v-btn>

      <v-spacer />

      <v-chip
        @click="graph.updateHash()"
        size="small"
        variant="text"
        v-if="graph && appStore.state.devMode"
      >
        {{ graph.hash }}
      </v-chip>

      <!--
      <v-text-field
        class="px-4"
        hide-details
        prepend-inner-icon="mdi:mdi-pencil"
        single-line
        v-model="projectStore.state.project.name"
      /> -->

      <v-btn
        :class="{ active: graph?.workspace.state.centerSelected }"
        :icon="
          graph?.workspace.state.centerSelected
            ? 'mdi:mdi-image-filter-center-focus'
            : 'mdi:mdi-image-filter-center-focus-strong-outline'
        "
        @click="() => graph?.workspace.toggleCenterSelected()"
        class="icon"
        size="x-small"
        title="Auto-center currently selected element"
      />

      <v-btn
        :class="{ active: graph?.workspace.state.centerNetwork }"
        @click="() => graph?.workspace.toggleCenterNetwork()"
        class="icon"
        icon="mdi:mdi-focus-field"
        size="x-small"
        title="Auto-center whole network graph"
      />

      <v-btn
        :class="{ active: graph?.workspace.state.showGrid }"
        :icon="
          graph?.workspace.state.showGrid ? 'mdi:mdi-grid' : 'mdi:mdi-grid-off'
        "
        @click="() => graph?.workspace.toggleGrid()"
        class="icon"
        size="x-small"
        title="Show background grid"
      />
    </template>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";

import ConnectionMenuList from "../connection/ConnectionMenuList.vue";
import ContextMenu from "../common/ContextMenu.vue";
import NodeAvatar from "../node/avatar/NodeAvatar.vue";
import NodeGroupMenuList from "../node/NodeGroupMenuList.vue";
import NodeMenuList from "../node/NodeMenuList.vue";
import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TConnection, TNode } from "@/types";
import { confirmDialog } from "@/helpers/common/confirmDialog";
// import { downloadSVGImage } from "@/utils/download";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();

const graph = computed(() => networkGraphStore.state.graph);

const state = reactive<{
  collapse: boolean;
  dialogDelete: boolean;
  dialogDownload: boolean;
}>({
  collapse: true,
  dialogDelete: false,
  dialogDownload: false,
});

// /**
//  * Download network graph as svg.
//  */
// const downloadNetworkGraph = () => {
//   if (!graph.value?.selector) return;

//   downloadSVGImage(
//     graph.value?.selector.node() as Node,
//     graph.value?.network.project.name
//   );
//   state.dialogDownload = false;
// };

/**
 * Empty network.
 */
const emptyNetwork = () => {
  confirmDialog({
    text: "Are you sure to delete all elements of this network?",
    title: "Empty network?",
  }).then((answer: boolean) => {
    if (answer) graph.value?.network.clear();
  });
};

const groupSelectedNodes = () => {
  if (graph && graph.value) {
    graph.value.network.nodes.groupSelected();
    graph.value.nodeGroupGraph.update();
  }
};
</script>

<style lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.toolbar {
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  border-bottom-width: 1px;

  &.collapse {
    border-right-width: 1px;
  }

  .icon {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));

    &.active {
      color: darkorange;
    }
  }
}
</style>
