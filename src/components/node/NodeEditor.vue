<template>
  <Card
    v-if="node.show"
    :color="node.color"
    class="node ma-1"
    @mouseenter="node.state.focus()"
    @mouseleave="node.nodes.unfocusNode()"
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
              icon
              class="mx-4 rounded-circle"
              size="medium"
              @click.stop="node.toggleSelection()"
              @click.right.prevent="node.unselect()"
            >
              <NodeAvatar :node />
            </v-btn>

            <slot name="nodeModelSelect" :select-state="state">
              <NodeModelSelect :node @open-menu="() => (state.menu = true)" />
            </slot>

            <v-menu v-model="state.menu" :close-on-content-click="false">
              <template #activator="{ props: btnProps }">
                <v-btn
                  class="rounded-circle"
                  icon="mdi:mdi-order-bool-ascending-variant"
                  size="small"
                  v-bind="btnProps"
                />
              </template>

              <v-card>
                <v-card-text>
                  <v-checkbox
                    v-model="node.sizeVisible"
                    :disabled="node.model.isRecorder"
                    :color="node.color"
                    density="compact"
                    hide-details
                    label="population size"
                  >
                    <template #append>n: {{ node.size }}</template>
                  </v-checkbox>

                  <template v-if="node.modelParams">
                    <template v-for="(param, index) in node.paramsAll" :key="index">
                      <v-checkbox
                        v-model="node.paramsVisible"
                        :color="node.color"
                        :label="param.label"
                        :value="param.id"
                        density="compact"
                        hide-details
                      >
                        <template #append>
                          {{ param.id }}: {{ param.value }}
                          {{ param.unit }}
                        </template>
                      </v-checkbox>
                    </template>
                  </template>
                </v-card-text>

                <v-card-actions>
                  <v-btn text="show all" title="show all parameters" @click.stop="() => node.showAllParams()" />
                  <v-btn text="hide all" title="show no parameters" @click.stop="() => node.hideAllParams()" />
                  <v-spacer />
                  <v-btn text="close" @click.stop="state.menu = false" />
                </v-card-actions>
              </v-card>
            </v-menu>

            <Menu>
              <slot name="nodeMenuContent">
                <NodeMenuList :node />
              </slot>
            </Menu>
          </v-btn-group>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list v-if="node.intf && !node.intf.size.hidden" class="py-0">
            <slot name="popItem">
              <v-list-item class="param pl-0 pr-1">
                <ValueSlider v-model="node.intf.size.value" :thumb-color="node.color" label="population size" />

                <template #append>
                  <Menu :items="popItems" size="x-small" />
                </template>
              </v-list-item>
            </slot>
          </v-list>

          <v-list v-if="node.model?.isMultimeter" class="py-0">
            <v-list-item>
              <NodeRecordSelect :node />
            </v-list-item>
          </v-list>

          <v-list class="py-0">
            <template v-for="param in node.paramsAll" :key="param.intf?.id">
              <ParamListItem
                v-if="param.intf && param.intf[param.id] && !param.intf[param.id]?.hidden"
                :color="node.color"
                :param
              />
            </template>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <slot name="connectionEditor">
        <ConnectionEditor
          v-for="(connection, index) in node.connections"
          :key="index"
          :connection="(connection as TConnection)"
        />
      </slot>
    </v-expansion-panels>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";

import { TConnection, TModel, TNode } from "@/types";

import Card from "../common/Card.vue";
import ConnectionEditor from "../connection/ConnectionEditor.vue";
import Menu from "../common/Menu.vue";
import NodeAvatar from "./avatar/NodeAvatar.vue";
import NodeModelSelect from "./NodeModelSelect.vue";
import NodeRecordSelect from "./NodeRecordSelect.vue";
import ParamListItem from "../parameter/ParamListItem.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import NodeMenuList from "./NodeMenuList.vue";

const props = defineProps<{ node: TNode }>();
const node = computed(() => props.node);

const state = reactive<{
  elementType: string;
  items: TModel[];
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
      if (node.value.intf) node.value.intf.size.value = 1;
    },
    title: "Set default size",
  },
];

onMounted(() => {
  state.items = node.value.models;
  state.elementType = node.value.elementType;
});
</script>
