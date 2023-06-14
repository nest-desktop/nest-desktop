<template>
  <card :color="state.node.color" class="node my-1" v-if="state.node">
    <v-card-title class="mt-2 ml-10">
      <v-select
        :items="state.node.models"
        @update:model-value="state.menu = true"
        hide-details
        item-value="id"
        item-title="label"
        label="Model"
        density="compact"
        v-model="state.node.modelId"
        variant="outlined"
      >
        <template #prepend>
          <v-btn
            class="position-absolute"
            flat
            icon
            size="large"
            style="left: 8px; top: 8px"
          >
            <node-avatar
              size="48px"
              :color="state.node.color"
              :label="state.node.label"
              :elementType="state.node.elementType"
              :weight="state.node.weight"
            />
          </v-btn>
        </template>

        <template #append>
          <v-menu
            :close-on-content-click="false"
            density="compact"
            v-model="state.menu"
          >
            <template #activator="{ props }">
              <v-btn
                icon="mdi-order-bool-ascending-variant"
                size="small"
                v-bind="props"
                variant="text"
              />
            </template>

            <v-card>
              <v-card-text>
                <template v-if="state.node.elementType !== 'recorder'">
                  <v-checkbox
                    :color="state.node.color"
                    density="compact"
                    hide-details
                    label="Population"
                    v-model="state.node.paramsVisible"
                    value="size"
                  >
                    <template #append> n: {{ state.node.size }} </template>
                  </v-checkbox>
                </template>
                <template v-if="state.node.modelParams">
                  <template
                    :key="index"
                    v-for="(param, index) in Object.values(
                      state.node.modelParams
                    )"
                  >
                    <v-checkbox
                      :color="state.node.color"
                      :label="param.label"
                      :value="param.id"
                      density="compact"
                      hide-details
                      v-model="state.node.paramsVisible"
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
                <v-btn
                  @click.stop="() => state.node.showAllParams()"
                  size="small"
                  variant="outlined"
                >
                  all
                </v-btn>
                <v-btn
                  @click.stop="() => state.node.hideAllParams()"
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

          <v-menu :close-on-content-click="false" density="compact">
            <template #activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                size="small"
                v-bind="props"
                variant="text"
              />
            </template>

            <list :items="items" />
          </v-menu>
        </template>
      </v-select>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list>
        <node-param
          :color="state.node.color"
          :options="{ id: 'n', inputLabel: 'n', label: 'population' }"
          @update:model-value="state.node.nodeChanges()"
          v-if="
            state.node.elementType !== 'recorder' &&
            state.node.size != undefined &&
            state.node.paramsVisible != undefined &&
            state.node.paramsVisible.includes('size')
          "
          v-model="state.node.size"
        />

        <template v-if="state.node.paramsVisible.length > 0">
          <template
            :key="index"
            v-for="(paramId, index) in state.node.paramsVisible"
          >
            <node-param
              :color="state.node.color"
              :options="state.node.params[paramId].options"
              @update:model-value="state.node.nodeChanges()"
              v-model="state.node.params[paramId].value"
            />
          </template>
        </template>
      </v-list>
    </v-card-text>

    <v-card-actions
      class="pa-0"
      style="min-height: 40px"
      v-if="state.node.state.targetsLength > 0"
    >
      <v-expansion-panels
        :key="state.node.state.targetsLength"
        variant="accordion"
      >
        <node-connection
          :key="index"
          :source="{
            color: state.node.color,
            label: state.node.label,
            elementType: state.node.elementType,
            weight: state.node.weight,
          }"
          :target="{
            color: connection.target.color,
            label: connection.target.label,
            elementType: connection.target.elementType,
            weight: state.node.weight,
          }"
          v-for="(connection, index) in state.node.targets"
        />
      </v-expansion-panels>
    </v-card-actions>
  </card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import Card from "@/components/common/Card.vue";
import List from "@/components/common/List.vue";
import { Node } from "@nest/core/node/node";

import NodeAvatar from "./avatar/NodeAvatar.vue";
import NodeConnection from "./NodeConnection.vue";
import NodeParam from "./NodeParam.vue";

interface Props {
  node: Node;
}

const props = defineProps<Props>();

// @ts-ignore
const state = reactive({
  menu: false,
  node: props.node,
});

const admins = [
  {
    title: "Management",
    icon: "mdi-account-multiple-outline",
    value: "management",
  },
  { title: "Settings", icon: "mdi-cog-outline", value: "settings" },
];

const cruds = [
  { title: "Create", icon: "mdi-plus-outline", value: "create" },
  { title: "Read", icon: "mdi-file-outline", value: "read" },
  { title: "Update", icon: "mdi-update", value: "update" },
  { title: "Delete", icon: "mdi-delete", value: "delete" },
];

const clickMe = [
  { value: "1", title: "Click Me", icon: "mdi-numeric-1" },
  { value: "2", title: "Click Me", icon: "mdi-numeric-2" },
  { value: "3", title: "Click Me", icon: "mdi-numeric-3" },
  { value: "4", title: "Click Me", icon: "mdi-numeric-4" },
];

const items = [
  {
    value: "parameter",
    title: "parameter",
    icon: "mdi-account-circle",
    items: admins,
  },
  {
    value: "actions",
    title: "actions",
    icon: "mdi-database-cog-outline",
    items: cruds,
  },
  {
    value: "clickMe",
    title: "clickMe",
    icon: "mdi-information",
    items: clickMe,
  },
];
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
</style>
