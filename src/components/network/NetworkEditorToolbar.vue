<template>
  <v-toolbar
    :key="graph?.network.hash"
    :class="{ collapse: state.collapse }"
    :collapse="state.collapse"
    absolute
    class="toolbar"
    color="background"
    density="compact"
  >
    <div
      v-if="graph"
      style="position: absolute"
    >
      <div style="width: 320px">
        <ContextMenu
          v-model="graph.state.contextMenu.modelValue"
          :target="graph.state.contextMenu.target"
        >
          <slot
            name="ContextMenuList"
            :graph
          >
            <ConnectionMenuList
              v-if="graph.state.contextMenu.connection"
              :connection="(graph.state.contextMenu.connection as TConnection)"
            />
            <NodeMenuList
              v-if="graph.state.contextMenu.node"
              :node="(graph.state.contextMenu.node as TNode)"
            />
            <NodeGroupMenuList
              v-if="graph.state.contextMenu.nodeGroup"
              :node-group="(graph.state.contextMenu.nodeGroup as NodeGroup)"
            />
          </slot>
        </ContextMenu>

        <v-menu
          v-model="graph.workspace.nodeAddPanel.state.modelValue"
          :target="graph.workspace.nodeAddPanel.state.target"
        >
          <template #activator="{ props }">
            <slot
              name="activator"
              v-bind="props"
            />
          </template>

          <v-list>
            <v-list-subheader>
              Select a
              {{ graph.workspace.nodeAddPanel.state.elementType }} model
            </v-list-subheader>
            <v-list-item
              v-for="(item, index) in graph.workspace.nodeAddPanel.state
                .menuItems"
              :key="index"
              @click="() => item.onClick()"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-btn
      :icon="state.collapse ? 'mdi:mdi-chevron-right' : 'mdi:mdi-chevron-left'"
      class="icon"
      size="x-small"
      @click="state.collapse = !state.collapse"
    />

    <v-btn
      :disabled="graph?.network.isEmpty"
      class="icon"
      icon="mdi:mdi-trash-can-outline"
      size="x-small"
      title="Delete all network elements"
      @click="emptyNetwork()"
    />

    <v-btn
      :disabled="!graph?.network.nodes.hasAnySelectedNodes"
      class="icon"
      icon="mdi:mdi-select-group"
      size="x-small"
      @click="groupSelectedNodes()"
    />

    <template v-if="!state.collapse">
      <!-- <v-btn
        @click="downloadNetworkGraph()"
        icon="mdi:mdi-camera"
        size="small"
        title="Export network graph"
      /> -->

      <v-btn
        v-for="(node, index) in graph?.network.nodes.state.selectedNodes"
        :key="index"
        icon
        size="x-small"
        @click.stop="node.unselect()"
      >
        <NodeAvatar
          :node="(node as TNode)"
          :size="32"
        />
      </v-btn>

      <v-spacer />

      <v-chip
        v-if="graph && appStore.state.devMode"
        size="small"
        variant="text"
        @click="graph.updateHash()"
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
        class="icon"
        size="x-small"
        title="Auto-center currently selected element"
        @click="() => graph?.workspace.toggleCenterSelected()"
      />

      <v-btn
        :class="{ active: graph?.workspace.state.centerNetwork }"
        class="icon"
        icon="mdi:mdi-focus-field"
        size="x-small"
        title="Auto-center whole network graph"
        @click="() => graph?.workspace.toggleCenterNetwork()"
      />

      <v-btn
        :class="{ active: graph?.workspace.state.showGrid }"
        :icon="
          graph?.workspace.state.showGrid ? 'mdi:mdi-grid' : 'mdi:mdi-grid-off'
        "
        class="icon"
        size="x-small"
        title="Show background grid"
        @click="() => graph?.workspace.toggleGrid()"
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
  if (graph.value && graph.value) {
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
