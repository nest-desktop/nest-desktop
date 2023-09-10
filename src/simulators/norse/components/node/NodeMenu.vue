<template>
  <v-menu :close-on-content-click="false" v-model="state.show">
    <template #activator="{ props }">
      <v-btn
        color="primary"
        icon="mdi-dots-vertical"
        size="small"
        v-bind="props"
        variant="text"
      />
    </template>

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
          <v-list-item
            :key="index"
            @click="item.onClick"
            v-for="(item, index) in items"
            v-show="item.show()"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>
            <v-list-item-title> {{ item.title }}</v-list-item-title>

            <template #append>
              <template v-if="item.append">
                <v-icon icon="mdi-menu-right" size="small" />
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
          </v-list-item>
        </v-list>
      </span>

      <span v-if="state.content === 'eventsExport'">
        <v-card-text class="py-1 px-0">
          <v-list dense>
            <v-list-item @click="exportEvents('json')">
              <template #prepend>
                <v-icon icon="mdi-code-json" />
              </template>
              <v-list-item-title>Export events to JSON file</v-list-item-title>
            </v-list-item>

            <v-list-item @click="exportEvents('csv')">
              <template #prepend>
                <v-icon icon="mdi-file-delimited-outline" />
              </template>
              <v-list-item-title>Export events to CSV file</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="backMenu"
            prepend-icon="mdi-menu-left"
            size="small"
            variant="text"
          >
            back
          </v-btn>
        </v-card-actions>
      </span>

      <span v-if="state.content === 'nodeColor'">
        <v-color-picker
          @update:color="nodeColorChange()"
          flat
          show-swatches
          elevation="0"
          v-model="node.view.color"
        />

        <v-card-actions>
          <v-btn
            @click="backMenu"
            prepend-icon="mdi-menu-left"
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

      <span v-if="state.content === 'nodeDelete'">
        <v-card-title>Are you sure to delete this node?</v-card-title>

        <v-card-actions>
          <v-btn
            @click="backMenu"
            prepend-icon="mdi-menu-left"
            size="small"
            variant="text"
          >
            back
          </v-btn>
          <v-spacer />
          <v-btn @click="deleteNode" size="small" variant="outlined">
            delete
          </v-btn>
        </v-card-actions>
      </span>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import { NorseNode } from "../../helpers/node/norseNode";

const props = defineProps({
  node: NorseNode,
});

const node = computed(() => props.node as NorseNode);

const state = reactive({
  content: undefined as string | undefined,
  dialog: false,
  show: false,
});

const items = [
  {
    icon: "mdi-restart",
    id: "paramsReset",
    onClick: () => {
      node.value.resetParameters();
      closeMenu();
    },
    append: false,
    show: () => true,
    title: "Reset all parameters",
  },
  {
    icon: "mdi-format-color-fill",
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
    icon: "mdi-information-outline",
    id: "modelDoc",
    onClick: () => {
      state.dialog = true;
    },
    show: () => node.value.modelId !== "voltmeter",
    title: "Model documentation",
  },
  {
    icon: "mdi-content-copy",
    id: "nodeClone",
    onClick: () => {
      const newNode: any = JSON.parse(JSON.stringify(node.value.toJSON()));
      newNode.view.position.x += 50;
      newNode.view.color = undefined;
      node.value.nodes.add(newNode);
      node.value.changes();
      closeMenu();
    },
    show: () => true,
    title: "Clone node",
  },
  {
    icon: "mdi-download",
    id: "eventsExport",
    onClick: () => {
      state.content = "eventsExport";
    },
    show: () =>
      node.value.activity &&
      node.value.activity.hasEvents &&
      node.value.model.isRecorder,
    title: "Export events",
    append: true,
  },
  {
    icon: "mdi-trash-can-outline",
    id: "nodeDelete",
    onClick: () => {
      state.content = "nodeDelete";
    },
    show: () => true,
    title: "Delete node",
    append: true,
  },
];

/**
 * Update colors of network and activity.
 */
const nodeColorChange = () => {
  node.value.changes();
  node.value.nodes.updateRecordsColor();
};

/**
 * Reset node color.
 */
const resetColor = () => {
  node.value.view.color = "";
  nodeColorChange();
};

/**
 * Delete node.
 */
const deleteNode = () => {
  node.value.remove();
  closeMenu();
};

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
});
</script>

<style lang="scss">
.synWeightButton {
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-left: 0.75em;
}
</style>
