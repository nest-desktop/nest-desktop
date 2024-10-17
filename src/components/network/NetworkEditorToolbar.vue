<template>
  <v-toolbar
    :collapse="state.collapse"
    :key="graph?.network.hash"
    absolute
    density="compact"
  >
    <v-btn
      :disabled="!graph?.network.nodes.hasAnySelectedNodes"
      @click="groupSelectedNodes()"
      icon="mdi:mdi-select-group"
      size="small"
    />

    <v-btn
      :key="index"
      @click.stop="node.unselect()"
      icon
      size="small"
      v-for="(node, index) in graph?.network.nodes.state.selectedNodes"
    >
      <NodeAvatar :node="node as TNode" :size="32" />
    </v-btn>

    <div v-if="graph">
      <v-chip
        @click="graph.updateHash()"
        size="small"
        variant="text"
        v-if="appStore.state.devMode"
      >
        {{ graph.hash }}
      </v-chip>

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
          :target="graph.workspace.state.modelsMenu.target"
          v-model="graph.workspace.state.modelsMenu.modelValue"
        >
          <template #activator="{ props }">
            <slot name="activator" v-bind="props" />
          </template>

          <v-list>
            <v-list-subheader> Select a model </v-list-subheader>
            <v-list-item
              :key="index"
              @click="() => item.onClick()"
              v-for="(item, index) in graph.workspace.state.modelsMenu
                .menuItems"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-spacer />

    <v-btn
      @click="downloadNetworkGraph()"
      icon="mdi:mdi-camera"
      size="small"
      title="Export network graph"
    />

    <!-- <v-btn
      @click="state.collapse = !state.collapse"
      icon="mdi:mdi-tools"
      size="small"
    /> -->

    <template v-if="!state.collapse">
      <v-btn
        :disabled="graph?.network.isEmpty"
        @click="emptyNetwork()"
        icon="mdi:mdi-trash-can-outline"
        size="small"
        title="Delete all network elements"
      />

      <!--
      <v-text-field
        class="px-4"
        hide-details
        prepend-inner-icon="mdi:mdi-pencil"
        single-line
        v-model="projectStore.state.project.name"
      /> -->

      <v-btn
        :color="graph?.workspace.state.centerSelected ? 'amber' : 'grey'"
        :icon="
          graph?.workspace.state.centerSelected
            ? 'mdi:mdi-image-filter-center-focus'
            : 'mdi:mdi-image-filter-center-focus-strong-outline'
        "
        @click="() => graph?.workspace.toggleCenterSelected()"
        size="small"
        title="Auto-center currently selected element"
      />

      <v-btn
        :color="graph?.workspace.state.centerNetwork ? 'amber' : 'grey'"
        @click="() => graph?.workspace.toggleCenterNetwork()"
        icon="mdi:mdi-focus-field"
        size="small"
        title="Auto-center whole network graph"
      />

      <v-btn
        :color="graph?.workspace.state.showGrid ? 'amber' : 'grey'"
        :icon="
          graph?.workspace.state.showGrid ? 'mdi:mdi-grid' : 'mdi:mdi-grid-off'
        "
        @click="() => graph?.workspace.toggleGrid()"
        size="small"
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
import { downloadSVGImage } from "@/utils/download";

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
  collapse: false,
  dialogDelete: false,
  dialogDownload: false,
});

/**
 * Download network graph as svg.
 */
const downloadNetworkGraph = () => {
  if (!graph.value?.selector) return;

  downloadSVGImage(
    graph.value?.selector.node() as Node,
    graph.value?.network.project.name
  );
  state.dialogDownload = false;
};

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
</style>
