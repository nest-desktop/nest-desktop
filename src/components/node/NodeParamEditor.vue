<template>
  <v-list-item class="param pl-0 pr-1" v-if="props.param">
    <v-row no-gutters>
      <ParamPopover :param v-if="param.state.random" />

      <ArrayInput
        :model-value="(param.state.value as Number[])"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'arrayInput'"
      />

      <RangeSlider
        :model-value="(param.state.value as number[])"
        :thumb-color="param.node.view.color"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'rangeSlider'"
      />

      <TickSlider
        :model-value="(param.state.value as number)"
        :thumb-color="param.node.view.color"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'tickSlider'"
      />

      <ValueSlider
        :model-value="(param.state.value as number)"
        :thumb-color="param.node.view.color"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'valueSlider'"
      />

      <template v-else>
        <span class="px-2 py-auto text-medium-emphasis" style="font-size: 15px">
          {{ param.label || param.options.label }}
        </span>
        <v-spacer />
        <v-text-field
          :label="param.id"
          :model-value="param.state.value"
          :step="param.step"
          :suffix="param.unit"
          @update:model-value="(value: string) => update(parseFloat(value))"
          density="compact"
          hide-details
          style="max-width: 80px"
          type="number"
          variant="underlined"
        />
      </template>
    </v-row>

    <template #append>
      <ParamMenu :items />
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NodeParameter } from "@/helpers/node/nodeParameter";

import ArrayInput from "../controls/ArrayInput.vue";
import ParamMenu from "../parameter/ParamMenu.vue";
import ParamPopover from "../parameter/ParamPopover.vue";
import RangeSlider from "../controls/RangeSlider.vue";
import TickSlider from "../controls/TickSlider.vue";
import ValueSlider from "../controls/ValueSlider.vue";

const props = defineProps<{ param: NodeParameter }>();
const param = computed(() => props.param);

const items = [
  {
    icon: "custom:dice-multiple-outline",
    onClick: () => {
      param.value.state.random = !param.value.state.random;
      param.value.changes();
    },
    title: "Toggle view",
  },
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
    onClick: () => {
      param.value.hide();
      param.value.changes();
    },
    title: "Hide parameter",
  },
];

const update = (value: number | number[]) => {
  param.value.state.value = value;
  param.value.changes();
};
</script>

<!-- <style lang="scss">
// .param:nth-child(odd) {
//   background-color: rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity));
// }

.param {
  .v-btn__content {
    width: 100%;
  }

  .menu {
    opacity: 0;
  }

  &:hover {
    .menu {
      opacity: 1;
    }
  }

  &:hover .v-text-field__suffix {
    display: none;
  }
}
</style> -->
