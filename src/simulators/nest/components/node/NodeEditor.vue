<template>
  <card
    :color="node.view.color"
    @mouseenter="node.state.focus()"
    @mouseleave="node.nodes.unfocusNode()"
    class="node ma-1"
  >
    <v-card-title class="node-title mt-2 ml-10">
      <v-select
        :item-props="true"
        :items="state.items"
        :label="state.elementType + ' model'"
        class="model-select text-primary"
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
                size="xsmall"
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
            <NodeAvatar :node @click="node.state.select()" size="48px" />
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
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list class="py-0" v-if="node.view.state.showSize">
        <v-list-item class="param pl-0 pr-1">
          <v-row no-gutters>
            <ValueSlider
              :thumb-color="node.view.color"
              @update:model-value="node.changes()"
              id="n"
              input-label="n"
              label="population size"
              v-model="node.size"
            />

            <v-menu :close-on-content-click="false">
              <template #activator="{ props }">
                <v-btn
                  color="primary"
                  class="d-print-none menu align-center justify-center my-auto"
                  icon="mdi:mdi-dots-vertical"
                  size="x-small"
                  v-bind="props"
                  variant="text"
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
          </v-row>
        </v-list-item>
      </v-list>

      <v-list class="py-0" v-if="node.model.isMultimeter">
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
    </v-card-text>

    <v-card-actions style="min-height: 40px" v-if="node.connections.length > 0">
      <v-row>
        <v-expansion-panels
          :key="node.connections.length"
          v-model="node.state.connectionPanelIdx"
          variant="accordion"
        >
          <ConnectionEditor
            :connection
            :key="index"
            v-for="(connection, index) in node.connections"
          />
        </v-expansion-panels>
      </v-row>
    </v-card-actions>
  </card>
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
import { NESTNode } from "../../helpers/node/node";
import { NESTModel } from "../../helpers/model/model";

const props = defineProps<{ node: NESTNode }>();
const node = computed(() => props.node);

const state = reactive({
  menu: false,
  panelIdx: null,
  items: [] as (NESTModel | { title: string; value: string })[],
  elementType: "",
});

const elementTypes = [
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
    title: "Toggle spatial",
  },
];

const select = (props: Record<string, unknown>, callback?: () => void) => {
  if (["neuron", "recorder", "stimulator"].includes(props.value as string)) {
    state.elementType = props.value as string;
    state.items =
      node.value.network.project.modelDBStore.getModelsByElementType(
        props.value
      );
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
  .node-title {
    .model-select {
      .v-label {
        font-size: 13px;
      }
    }

    .menu {
      opacity: 0;
    }

    &:hover {
      .menu {
        opacity: 1;
      }
    }
  }

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
