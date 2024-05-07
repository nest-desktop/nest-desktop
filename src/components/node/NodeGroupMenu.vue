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

      <span v-if="state.content === 'nodeGroupColor'">
        <v-color-picker
          @update:model-value="nodeGroup.changes()"
          flat
          show-swatches
          elevation="0"
          v-model="nodeGroup.view.color"
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
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import { INodeGroupProps, NodeGroup } from "@/helpers/node/nodeGroup";
import { TNodes } from "@/types/nodesTypes";

const props = defineProps<{ nodeGroup: NodeGroup }>();
const nodeGroup = computed(() => props.nodeGroup);

const state = reactive({
  content: undefined as string | undefined,
  show: false,
});

const items = [
  {
    icon: "mdi:mdi-format-color-fill",
    iconClass: "",
    id: "nodeGroupColor",
    onClick: () => {
      state.content = "nodeGroupColor";
      window.dispatchEvent(new Event("resize"));
    },
    append: true,
    show: () => true,
    title: "Colorize node",
  },
  {
    icon: "mdi:mdi-content-copy",
    iconClass: "",
    id: "nodeGroupClone",
    onClick: () => {
      const newNodeGroupProps: INodeGroupProps = nodeGroup.value.toJSON();
      const nodes = nodeGroup.value.parent as TNodes;
      nodes.addNodeGroup(newNodeGroupProps);
      nodeGroup.value.changes();
      closeMenu();
    },
    show: () => true,
    title: "Clone node group",
  },
  {
    icon: "mdi:mdi-trash-can-outline",
    iconClass: "",
    id: "nodeGroupDelete",
    onClick: () => {
      createDialog({
        title: "Delete node group?",
        text: "Are you sure to delete node group?",
        buttons: [
          { title: "no", key: "no" },
          { title: "yes", key: "yes" },
        ],
      }).then((answer: string) => {
        if (answer === "yes") {
          nodeGroup.value.remove();
        }
      });
      // state.content = "nodeDelete";
    },
    show: () => true,
    title: "Delete node group",
  },
];

/**
 * Reset node color.
 */
const resetColor = () => {
  nodeGroup.value.view.color = "";
  nodeGroup.value.changes();
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
