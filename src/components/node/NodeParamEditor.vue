<template>
  <v-list-item class="param pl-0 pr-1" v-if="props.param">
    <v-row no-gutters>
      <range-slider
        :color="param.node.view.color"
        :model-value="(param.value as number[])"
        @update:model-value="update"
        v-bind="param.options"
        v-if="param.options.variant === 'range'"
      />
      <tick-slider
        :color="param.node.view.color"
        :model-value="(param.value as number)"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.variant === 'ticks'"
      />
      <value-slider
        :color="param.node.view.color"
        :model-value="(param.value as number)"
        @update:model-value="update"
        v-bind="param.options"
        v-else
      />

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            color="primary"
            class="menu align-center justify-center my-auto"
            icon="mdi-dots-vertical"
            size="x-small"
            v-bind="props"
            variant="text"
          />
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            :icon="item.icon"
            @click="item.onclick"
            v-for="(item, index) in items"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>
            {{ item.title }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import RangeSlider from "@/components/controls/RangeSlider.vue";
import TickSlider from "@/components/controls/TickSlider.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";
import { NodeParameter } from "@/common/node/nodeParameter";

const props = defineProps({
  param: NodeParameter,
});

const param = computed(() => props.param as NodeParameter);

const update = (value: number | number[]) => {
  param.value.value = value;
  param.value.changes();
};

const items = [
  {
    title: "Set default value",
    icon: "mdi-reload",
    onclick: () => {
      param.value.reset();
      param.value.changes();
    },
  },
  {
    title: "Hide parameter",
    icon: "mdi-eye-off-outline",
    onclick: () => {
      param.value.hide();
      param.value.changes();
    },
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
}

.param:hover {
  .menu {
    opacity: 1;
  }
}
</style>
