<template>
  <v-list-item class="param pl-0 pr-1" v-if="props.param">
    <v-row no-gutters>
      <ArrayInput
        :model-value="(param.value as Number[])"
        @update:model-value="update"
        v-bind="param.options"
        v-if="param.options.component === 'arrayInput'"
      />
      <RangeSlider
        :model-value="(param.value as number[])"
        :thumb-color="param.node.view.color"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'rangeSlider'"
      />
      <TickSlider
        :model-value="(param.value as number)"
        :thumb-color="param.node.view.color"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'tickSlider'"
      />
      <ValueSlider
        :model-value="(param.value as number)"
        :thumb-color="param.node.view.color"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'valueSlider'"
      />

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            color="primary"
            class="menu align-center justify-center my-auto"
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
            v-for="(item, index) in items"
          >
            <template #prepend>
              <v-icon :class="item.iconClass" :icon="item.icon" />
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ArrayInput from "../controls/ArrayInput.vue";
import RangeSlider from "../controls/RangeSlider.vue";
import TickSlider from "../controls/TickSlider.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { NodeParameter } from "@/helpers/node/nodeParameter";

const props = defineProps<{ param: NodeParameter }>();
const param = computed(() => props.param);

const update = (value: number | number[]) => {
  param.value.value = value;
  param.value.changes();
};

const items = [
  {
    icon: "mdi:mdi-reload",
    iconClass: "mdi-flip-h",
    onClick: () => {
      param.value.reset();
      param.value.changes();
    },
    title: "Set default value",
  },
  {
    icon: "mdi:mdi-eye-off-outline",
    iconClass: "",
    onClick: () => {
      param.value.hide();
      param.value.changes();
    },
    title: "Hide parameter",
  },
];
</script>

<style lang="scss">
// .param:nth-child(odd) {
//   background-color: rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity));
// }

.param {
  .menu {
    opacity: 0;
  }

  &:hover {
    .menu {
      opacity: 1;
    }
  }
}
</style>
