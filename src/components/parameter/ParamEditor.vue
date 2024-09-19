<template>
  <v-list-item class="param pa-0" v-if="props.param">
    <v-row class="pt-1 my-1" no-gutters>
      <ParamPopover :param v-if="param.state.random" />

      <ArrayInput
        v-bind="param.options"
        v-else-if="param.options.component === 'arrayInput'"
        v-model="(param.value as Number[])"
      />

      <v-checkbox
        :color="props.color"
        density="compact"
        hide-details
        v-bind="param.options"
        v-if="param.options.component === 'checkbox'"
        v-model="(param.value as boolean)"
      />

      <RangeSlider
        :thumb-color="props.color"
        v-bind="param.options"
        v-else-if="param.options.component === 'rangeSlider'"
        v-model="(param.value as number[])"
      />

      <v-select
        :items="param.items"
        class="pa-1 pb-0"
        density="compact"
        hide-details
        v-bind="param.options"
        v-else-if="param.options.component === 'select'"
        v-model="(param.value as string)"
      />

      <TickSlider
        :thumb-color="props.color"
        v-bind="param.options"
        v-else-if="param.options.component === 'tickSlider'"
        v-model="(param.value as number)"
      />

      <ValueSlider
        :thumb-color="props.color"
        v-bind="param.options"
        v-else-if="param.options.component === 'valueSlider'"
        v-model="(param.value as number)"
      />

      <template v-else>
        <span class="px-2 py-auto text-medium-emphasis" style="font-size: 15px">
          {{ param.label || param.options.label }}
        </span>

        <v-spacer />

        <v-text-field
          :label="param.id"
          :step="param.step"
          :suffix="param.unit"
          density="compact"
          hide-details
          style="max-width: 80px"
          type="number"
          v-model="param.value"
          variant="underlined"
        />
      </template>
    </v-row>

    <template #append v-if="!props.hideMenu">
      <Menu :items size="x-small" />
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ArrayInput from "../controls/ArrayInput.vue";
import Menu from "../common/Menu.vue";
import ParamPopover from "../parameter/ParamPopover.vue";
import RangeSlider from "../controls/RangeSlider.vue";
import TickSlider from "../controls/TickSlider.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { TParameter } from "@/types";

const props = defineProps<{
  color?: string;
  param: TParameter;
  hideMenu?: boolean;
}>();
const param = computed(() => props.param);

const items = [
  {
    onClick: () => {
      param.value.state.random = !param.value.state.random;
      param.value.changes();
    },
    prependIcon: "custom:dice-multiple-outline",
    title: "Toggle view",
  },
  {
    icon: { class: "mdi-flip-h", icon: "mdi:mdi-reload" },
    onClick: () => {
      param.value.reset();
      param.value.changes();
    },
    title: "Set default value",
  },
  {
    onClick: () => {
      param.value.hide();
      param.value.changes();
    },
    prependIcon: "mdi:mdi-eye-off-outline",
    title: "Hide parameter",
  },
];
</script>

<style lang="scss">
.param {
  .menu-btn {
    opacity: 0;
  }

  &:hover {
    .menu-btn {
      opacity: 1;
    }
  }
}
</style>
