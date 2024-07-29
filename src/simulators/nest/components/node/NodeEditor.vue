<template>
  <Card
    :color="node.view.color"
    @mouseenter="node.view.focus()"
    @mouseleave="node.nodes.unfocusNode()"
    class="ma-1"
    v-if="node.show"
  >
    <v-expansion-panels
      :key="node.connections.length"
      v-model="node.view.expansionPanelIdx"
      variant="accordion"
    >
      <v-expansion-panel>
        <v-expansion-panel-title class="node-title">
          <v-select
            :item-props="true"
            :items="state.items"
            :label="state.elementType + ' model'"
            @click.stop
            class="model-select text-primary ml-8"
            density="compact"
            hide-details
            item-title="label"
            item-value="id"
            v-model="node.modelId"
            variant="outlined"
          >
            <template #append>
              <div class="d-print-none menu">
                <v-menu :close-on-content-click="false" v-model="state.menu">
                  <template #activator="{ props }">
                    <v-btn
                      color="primary"
                      icon="mdi:mdi-order-bool-ascending-variant"
                      size="small"
                      v-bind="props"
                      variant="text"
                    />
                  </template>

                  <v-card>
                    <v-card-text>
                      <v-checkbox
                        :disabled="node.model.isRecorder"
                        :color="node.view.color"
                        density="compact"
                        hide-details
                        label="Population size"
                        v-model="node.view.state.showSize"
                      >
                        <template #append> n: {{ node.size }} </template>
                      </v-checkbox>
                      <template v-if="node.modelParams">
                        <v-checkbox
                          :color="node.view.color"
                          :key="index"
                          :label="param.label"
                          :value="param.id"
                          density="compact"
                          hide-details
                          v-for="(param, index) in Object.values(
                            node.modelParams
                          )"
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
                      <v-btn
                        @click.stop="() => node.showAllParams()"
                        size="small"
                        variant="outlined"
                      >
                        all
                      </v-btn>
                      <v-btn
                        @click.stop="() => node.hideAllParams()"
                        size="small"
                        variant="outlined"
                      >
                        none
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        @click.stop="state.menu = false"
                        size="small"
                        variant="outlined"
                      >
                        close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>

                <v-btn color="primary" icon size="small" variant="text">
                  <v-icon icon="mdi:mdi-dots-vertical" />
                  <NodeMenu :node />
                </v-btn>
              </div>
            </template>

            <template #item="{ props }">
              <v-list-item @click="select(props)" class="node-model-item">
                {{ props.title }}

                <template #append>
                  <v-btn
                    @click.stop="select(props, () => (state.menu = true))"
                    class="icon"
                    icon="mdi:mdi-menu-right"
                    size="x-small"
                    variant="outlined"
                    v-if="state.elementType"
                  />
                </template>
              </v-list-item>
            </template>

            <template #prepend>
              <v-btn
                class="position-absolute"
                flat
                icon
                size="large"
                style="left: 8px; top: 8px"
              >
                <NodeAvatar :node @click="node.select()" size="48px" />
              </v-btn>
            </template>

            <template #prepend-item v-if="state.elementType">
              <v-list-item
                @click="
                  () => {
                    state.elementType = '';
                    state.items = elementTypes;
                  }
                "
              >
                Other element types

                <template #prepend>
                  <v-icon icon="mdi:mdi-menu-left" />
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list class="py-0" v-if="node.view.state.showSize">
            <v-list-item class="param pl-0 pr-1">
              <v-row no-gutters>
                <NodePosition
                  :nodeSpatial="node.spatial"
                  v-if="node.spatial.hasPositions"
                />
                <template v-else>
                  <ValueSlider
                    :thumb-color="node.view.color"
                    @update:model-value="node.changes()"
                    id="n"
                    input-label="n"
                    label="population size"
                    v-model="node.size"
                  />
                </template>
              </v-row>

              <template #append>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      color="primary"
                      class="d-print-none menu align-center justify-center my-auto"
                      icon="mdi:mdi-dots-vertical"
                      size="x-small"
                      variant="text"
                      v-bind="props"
                    />
                  </template>

                  <v-list density="compact">
                    <v-list-item
                      :key="index"
                      :title="item.title"
                      @click="item.onClick()"
                      v-for="(item, index) in popItems"
                    >
                      <template #prepend>
                        <v-icon :class="item.iconClass" :icon="item.icon" />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>
          </v-list>

          <v-list class="py-0" v-if="node.model?.isMultimeter">
            <v-list-item>
              <NodeRecordSelect :node />
            </v-list-item>
          </v-list>

          <v-list class="py-0" v-if="node.paramsVisible.length > 0">
            <NodeParamEditor
              :key="index"
              :param="node.params[paramId]"
              v-for="(paramId, index) in node.paramsVisible"
            />
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <ConnectionEditor
        :connection
        :key="index"
        v-for="(connection, index) in node.connections"
      />
    </v-expansion-panels>
  </Card>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import Card from "@/components/common/Card.vue";
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import NodeParamEditor from "@/components/node/NodeParamEditor.vue";
import NodeRecordSelect from "@/components/node/NodeRecordSelect.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";

import ConnectionEditor from "../connection/ConnectionEditor.vue";
import NodeMenu from "./NodeMenu.vue";
import NodePosition from "./NodePosition.vue";
import { NESTCopyModel } from "../../helpers/model/copyModel";
import { NESTModel } from "../../helpers/model/model";
import { NESTNode } from "../../helpers/node/node";

const props = defineProps<{ node: NESTNode }>();
const node = computed(() => props.node);

const state = reactive({
  elementType: "",
  items: [] as (NESTCopyModel | NESTModel | any)[],
  menu: false,
  panelIdx: null,
});

const elementTypes = [
  { title: "copied model", value: "copied" },
  { title: "neuron", value: "neuron" },
  { title: "recorder", value: "recorder" },
  { title: "stimulator", value: "stimulator" },
];

const popItems = [
  {
    icon: "mdi:mdi-reload",
    iconClass: "mdi-flip-h",
    onClick: () => {
      node.value.size = 1;
    },
    title: "Set default size",
  },
  {
    icon: "mdi:mdi-axis-arrow",
    iconClass: "",
    onClick: () => {
      node.value.toggleSpatial();
    },
    title: "Toggle spatial mode",
  },
];

const select = (props: Record<string, unknown>, callback?: () => void) => {
  if (
    ["neuron", "recorder", "stimulator", "copied"].includes(
      props.value as string
    )
  ) {
    state.elementType = props.value as string;
    if (props.value === "copied") {
      state.items =
        node.value.network.modelsCopied.filterByGeneralElementType("node");
    } else {
      state.items =
        node.value.network.project.modelDBStore.getModelsByElementType(
          state.elementType
        );
    }
  } else {
    node.value.modelId = props.value as string;
  }

  if (callback) {
    callback();
  }
};

onMounted(() => {
  state.items = node.value.models;
  state.elementType = node.value.elementType;
});
</script>

<style lang="scss">
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

.node-model-item {
  .icon {
    display: none;
  }

  &:hover {
    .icon {
      display: block;
    }
  }
}
</style>
