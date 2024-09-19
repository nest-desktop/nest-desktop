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
            v-bind="item"
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
            text="back"
          />
          <v-spacer />
          <v-btn @click="resetColor" size="small" text="reset" />
        </v-card-actions>
      </span>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import { NodeGroup } from "@/helpers/node/nodeGroup";

const props = defineProps<{ nodeGroup: NodeGroup }>();
const nodeGroup = computed(() => props.nodeGroup);

const state = reactive<{
  content: string | undefined;
  show: boolean;
}>({
  content: undefined,
  show: false,
});

const items = [
  {
    append: true,
    id: "nodeGroupColor",
    onClick: () => {
      state.content = "nodeGroupColor";
      window.dispatchEvent(new Event("resize"));
    },
    prependIcon: "mdi:mdi-format-color-fill",
    show: () => true,
    title: "Colorize node",
  },
  {
    id: "nodeGroupClone",
    onClick: () => {
      nodeGroup.value.clone();
      nodeGroup.value.changes();
      closeMenu();
    },
    prependIcon: "mdi:mdi-content-copy",
    show: () => true,
    title: "Clone node group",
  },
  {
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
    prependIcon: "mdi:mdi-trash-can-outline",
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
