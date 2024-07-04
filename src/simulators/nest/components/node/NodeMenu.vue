<template>
  <v-menu
    :close-on-content-click="false"
    activator="parent"
    v-model="state.show"
  >
    <v-card flat style="min-width: 300px">
      <!-- <v-card-title class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <NodeModelSelect :node="node" />
          </v-col>
        </v-row>
      </v-card-title> -->

      <span v-if="state.content == undefined">
        <v-list density="compact">
          <v-list-item v-if="!node.model?.isRecorder">
            <template #prepend>
              <v-icon icon="mdi:mdi-contrast" />
            </template>

            <v-list-item-title>Set all synaptic weights</v-list-item-title>

            <template #append>
              <v-switch
                :class="{
                  'text-red': node.view.state.synWeights === 'inhibitory',
                }"
                :indeterminate="!node.view.state.synWeights"
                :model-value="node.view.state.synWeights"
                @update:model-value="updateSynWeights"
                class="pl-2"
                color="nest-project"
                density="compact"
                false-icon="mdi:mdi-minus-circle"
                false-value="inhibitory"
                hide-details
                inset
                true-icon="mdi:mdi-plus-circle"
                true-value="excitatory"
              />
            </template>
          </v-list-item>

          <v-list-item
            :key="index"
            :title="item.title"
            @click="item.onClick"
            v-for="(item, index) in items"
            v-show="item.show()"
          >
            <template #append>
              <template v-if="item.append">
                <v-icon icon="mdi:mdi-menu-right" size="small" />
              </template>

              <!-- <template v-if="item.input === 'checkbox'">
                <v-checkbox
                  :color="node.view.color"
                  :input-value="state[item.value]"
                />
              </template>

              <template v-if="item.input === 'switch'">
                <v-switch
                  :color="node.view.color"
                  :value="state[item.value]"
                  dense
                  hide-details
                />
              </template> -->
            </template>

            <template #prepend>
              <v-icon :class="item.iconClass" :icon="item.icon" />
            </template>
          </v-list-item>
        </v-list>
      </span>

      <span v-if="state.content === 'eventsExport'">
        <v-card-text class="py-1 px-0">
          <v-list dense>
            <v-list-item @click="exportEvents('json')">
              <template #prepend>
                <v-icon icon="mdi:mdi-code-json" />
              </template>
              <v-list-item-title>Export events to JSON file</v-list-item-title>
            </v-list-item>

            <v-list-item @click="exportEvents('csv')">
              <template #prepend>
                <v-icon icon="mdi:mdi-file-delimited-outline" />
              </template>
              <v-list-item-title>Export events to CSV file</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="backMenu"
            prepend-icon="mdi:mdi-menu-left"
            size="small"
            variant="text"
          >
            back
          </v-btn>
        </v-card-actions>
      </span>

      <span>
        <v-dialog :value="state.dialog" width="80%">
          <ModelDocumentation :modelId="node.modelId" />
        </v-dialog>
      </span>

      <span v-if="state.content === 'nodeColor'">
        <v-color-picker
          @update:model-value="nodeColorChange"
          flat
          show-swatches
          elevation="0"
          v-model="node.view.color"
        />

        <v-card-actions>
          <v-btn
            @click="backMenu"
            prepend-icon="mdi:mdi-menu-left"
            size="small"
            variant="text"
          >
            back
          </v-btn>
          <v-spacer />
          <v-btn @click="resetColor" size="small" variant="outlined">
            reset
          </v-btn>
        </v-card-actions>
      </span>

      <span v-if="state.content === 'synWeights'">
        <v-switch
          :key="index"
          :label="connection.synapse.weightLabel"
          false-value="inhibitory"
          true-value="excitatory"
          v-for="(connection, index) in node.connections"
          v-model="connection.synapse.weightLabel"
        />

        <v-card-actions>
          <v-btn
            @click="backMenu"
            prepend-icon="mdi:mdi-menu-left"
            size="small"
            variant="text"
          >
            back
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </span>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import ModelDocumentation from "../../views/ModelDoc.vue";
import { NESTNode } from "../../helpers/node/node";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();

const props = defineProps<{ node: NESTNode }>();
const node = computed(() => props.node);

const state = reactive({
  content: undefined as string | undefined,
  dialog: false,
  show: false,
  spatialNode: false,
});

const items = [
  // {
  //   icon: "mdi:mdi-pencil",
  //   id: "paramEdit",
  //   onClick: () => {
  //     state.content = "nodeParamEdit";
  //     window.dispatchEvent(new Event("resize"));
  //   },
  //   append: true,
  //   show: () => true,
  //   title: "Edit parameters",
  // },
  {
    icon: "mdi:mdi-reload",
    iconClass: "mdi-flip-h",
    id: "resetParams",
    onClick: () => {
      node.value.resetParams();
      closeMenu();
    },
    append: false,
    show: () => true,
    title: "Reset all parameters",
  },
  {
    icon: "mdi:mdi-axis-arrow",
    iconClass: "",
    id: "nodeSpatial",
    input: "switch",
    onClick: () => {
      node.value.toggleSpatial();
    },
    show: () => !node.value.model?.isRecorder,
    title: "Toggle spatial mode",
    value: "spatialNode",
  },
  {
    icon: "mdi:mdi-format-color-fill",
    iconClass: "",
    id: "nodeColor",
    onClick: () => {
      state.content = "nodeColor";
      window.dispatchEvent(new Event("resize"));
    },
    append: true,
    show: () => true,
    title: "Colorize node",
  },
  {
    icon: "mdi:mdi-information-outline",
    iconClass: "",
    id: "modelDoc",
    onClick: () => {
      state.dialog = true;
    },
    show: () => node.value.modelId !== "voltmeter",
    title: "Model documentation",
  },
  {
    icon: "mdi:mdi-content-copy",
    iconClass: "",
    id: "nodeClone",
    onClick: () => {
      node.value.clone();
      node.value.changes();
      closeMenu();
    },
    show: () => true,
    title: "Clone node",
  },
  // {
  //   icon: "network:synapse-excitatory",
  //   id: "setSynWeights",
  //   onClick: () => {
  //     state.content = "synWeights";
  //   },
  //   append: true,
  //   show: () => true,
  //   title: "Set synaptic weights",
  // },
  {
    icon: "mdi:mdi-download",
    iconClass: "",
    id: "eventsExport",
    onClick: () => {
      state.content = "eventsExport";
    },
    show: () =>
      node.value.model?.isRecorder &&
      node.value.activity &&
      node.value.activity.hasEvents,
    title: "Export events",
    append: true,
  },
  {
    icon: "mdi:mdi-trash-can-outline",
    iconClass: "",
    id: "nodeDelete",
    onClick: () => {
      createDialog({
        title: "Delete node?",
        text: "Are you sure to delete node?",
        buttons: [
          { title: "no", key: "no" },
          { title: "yes", key: "yes" },
        ],
      }).then((answer: string) => {
        if (answer === "yes") {
          node.value.remove();
        }
      });
    },
    show: () => true,
    title: "Delete node",
  },
];

/**
 * Update colors of network and activity.
 */
const nodeColorChange = () => {
  node.value.changes();
  nextTick(() => {
    node.value.nodes.updateRecordsColor();
  });

  // Render network graph
  networkGraphStore.state.graph?.updateHash();
};

/**
 * Reset node color.
 */
const resetColor = () => {
  node.value.view.color = "";
  nodeColorChange();
};

// /**
//  * Set weigths of all connection in this node.
//  */
// const setWeights = (mode: string) => {
//   node.value.setWeights(mode);
//   closeMenu();
// };

/**
 * Export events.
 */
const exportEvents = (format: string = "json") => {
  if (format === "json") {
    node.value.activity?.exportEvents();
  } else if (format === "csv") {
    node.value.activity?.exportEventsCSV();
  }
  closeMenu();
};

/**
 * Update states.
 */
const updateStates = () => {
  if (!node.value) return;

  state.spatialNode = node.value.spatial.hasPositions;
};

/**
 * Update synaptic weights.
 *
 * @param value string
 */
const updateSynWeights = (value: string | null) => {
  if (value == null) return;

  node.value.view.state.synWeights = value;
  node.value.changes();
  networkGraphStore.state.graph?.render();
};

/**
 * Return to main menu content.
 */
const backMenu = () => {
  state.content = undefined;
};

/**
 * Close menu.
 */
const closeMenu = () => {
  state.content = undefined;
  state.show = false;
};

onMounted(() => {
  closeMenu();
  updateStates();
});
</script>

<style lang="scss">
.synWeightButton {
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-left: 0.75em;
}
</style>
