<template>
  <Card
    :color="node.view.color"
    @mouseenter="node.view.focus()"
    @mouseleave="node.nodes.unfocusNode()"
    class="node ma-1"
    v-if="node.show"
  >
    <v-expansion-panels
      :key="node.connections.length"
      v-model="node.view.state.expansionPanels"
      multiple
      variant="accordion"
    >
      <v-expansion-panel>
        <v-expansion-panel-title class="ma-0 pa-0 pr-3 pt-1">
          <v-btn-group class="py-1 pr-2" style="width: 100%" variant="text">
            <v-btn
              @click.stop="node.toggleSelection()"
              icon
              class="mx-4 rounded-circle"
              size="medium"
            >
              <NodeAvatar :node />
            </v-btn>

            <slot name="nodeModelSelect" :selectState="state">
              <NodeModelSelect :node @openMenu="() => (state.menu = true)" />
            </slot>

            <v-menu :close-on-content-click="false" v-model="state.menu">
              <template #activator="{ props }">
                <v-btn
                  class="rounded-circle"
                  icon="mdi:mdi-order-bool-ascending-variant"
                  size="small"
                  v-bind="props"
                />
              </template>

              <v-card variant="outlined">
                <v-card-text>
                  <v-checkbox
                    :disabled="node.model.isRecorder"
                    :color="node.view.color"
                    density="compact"
                    hide-details
                    label="Population size"
                    v-model="node.view.state.showSize"
                  >
                    <template #append>n: {{ node.size }}</template>
                  </v-checkbox>

                  <template v-if="node.modelParams">
                    <v-checkbox
                      :color="node.view.color"
                      :key="index"
                      :label="param.label"
                      :value="param.id"
                      density="compact"
                      hide-details
                      v-for="(param, index) in Object.values(node.modelParams)"
                      v-model="node.paramsVisible"
                    >
                      <template #append>
                        {{ param.id }}: {{ param.value }}
                        {{ param.unit }}
                      </template>
                    </v-checkbox>
                  </template>
                </v-card-text>

                <v-card-actions>
                  <v-btn @click.stop="() => node.showAllParams()" text="all" />
                  <v-btn @click.stop="() => node.hideAllParams()" text="none" />
                  <v-spacer />
                  <v-btn @click.stop="state.menu = false" text="close" />
                </v-card-actions>
              </v-card>
            </v-menu>

            <slot name="nodeMenu">
              <NodeMenu :node />
            </slot>
          </v-btn-group>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list class="py-0" v-if="node.view.state.showSize">
            <slot name="popItem">
              <v-list-item class="param pl-0 pr-1">
                <ValueSlider
                  :thumb-color="node.view.color"
                  @update:model-value="node.changes()"
                  id="n"
                  input-label="n"
                  label="population size"
                  v-model="node.size"
                />

                <template #append>
                  <Menu :items="popItems" size="x-small" />
                </template>
              </v-list-item>
            </slot>
          </v-list>

          <v-list class="py-0" v-if="node.model.isMultimeter">
            <v-list-item>
              <NodeRecordSelect :node />
            </v-list-item>
          </v-list>

          <v-list class="py-0">
            <ParamListItem
              :color="node.view.color"
              :key="index"
              :param="node.params[paramId]"
              v-for="(paramId, index) in node.paramsVisible"
              v-if="node.paramsVisible.length > 0"
            />
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <slot name="connectionEditor">
        <ConnectionEditor
          :connection
          :key="index"
          v-for="(connection, index) in node.connections"
        />
      </slot>
    </v-expansion-panels>
  </Card>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import { TModel, TNode } from "@/types";

import Card from "../common/Card.vue";
import ConnectionEditor from "../connection/ConnectionEditor.vue";
import Menu from "../common/Menu.vue";
import NodeAvatar from "./avatar/NodeAvatar.vue";
import NodeMenu from "./NodeMenu.vue";
import NodeModelSelect from "./NodeModelSelect.vue";
import NodeRecordSelect from "./NodeRecordSelect.vue";
import ParamListItem from "../parameter/ParamListItem.vue";
import ValueSlider from "../controls/ValueSlider.vue";

const props = defineProps<{ node: TNode }>();
const node = computed(() => props.node);

const state = reactive<{
  elementType: string;
  items: (TModel | any)[];
  menu: boolean;
}>({
  elementType: "",
  items: [],
  menu: false,
});

const popItems = [
  {
    icon: { class: "mdi-flip-h", icon: "mdi:mdi-reload" },
    onClick: () => {
      node.value.size = 1;
    },
    title: "Set default size",
  },
];

onMounted(() => {
  state.items = node.value.models;
  state.elementType = node.value.elementType;
});
</script>

<!-- <style lang="scss">
.node {
  .v-list {
    overflow: visible;

    .v-list-item__content {
      overflow: visible;
    }
  }

  .v-input__prepend,
  .v-input__append {
    padding-top: 0 !important;
  }
}
</style> -->
