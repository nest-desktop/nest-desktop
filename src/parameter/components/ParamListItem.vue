<template>
  <v-list-item class="param my-1 pa-1" style="line-height: 32px">
    <template v-if="param.state.random">
      <v-label class="px-1" style="width: 100%">
        {{ param.label || param.options.label || param.id }}
        <v-spacer />
        {{ param.id }}: {{ param.value }}
      </v-label>
    </template>

    <ArrayInput v-else-if="param.options.component === 'arrayInput'" v-bind="param.options" v-model="model as string" />

    <v-checkbox
      v-else-if="param.options.component === 'checkbox'"
      v-bind="param.options"
      v-model="model"
      :color="color"
      density="compact"
      hide-details
    />

    <RangeSlider
      v-else-if="param.options.component === 'rangeSlider'"
      v-bind="param.options"
      v-model="model as number[]"
      :thumb-color="color"
    />

    <v-select
      v-else-if="param.options.component === 'select'"
      v-bind="param.options"
      v-model="model"
      :items="param.items"
      class="pa-1 pb-0"
      density="compact"
      hide-details
    />

    <TickSlider
      v-else-if="param.options.component === 'tickSlider'"
      v-bind="param.options"
      v-model="model as number"
      :thumb-color="color"
    />

    <ValueSlider
      v-else-if="param.options.component === 'valueSlider'"
      v-bind="param.options"
      v-model="model as number"
      :thumb-color="color"
    />

    <template v-else>
      <v-row class="pt-1" no-gutters>
        <v-label :title="param.label || param.options.label" class="text-truncate">
          {{ param.label || param.options.label }}
        </v-label>

        <v-spacer />

        <v-text-field
          v-model="model"
          :label="param.id"
          :step="param.step"
          :suffix="param.unit"
          density="compact"
          hide-details
          style="max-width: 80px"
          type="number"
          variant="underlined"
        />
      </v-row>
    </template>

    <template #append>
      <slot :param name="append">
        <template v-if="param.state.random">
          <ParamPopover :param size="x-small" />
        </template>

        <Menu v-show="showMenu" :items size="x-small" />
      </slot>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { TParameter } from "@/types";
import { ArrayInput, Menu, RangeSlider, TickSlider, ValueSlider } from "@/components";

import ParamPopover from "./ParamPopover.vue";
import { TParamValue } from "../helpers/parameter";

const model = defineModel<TParamValue>({ required: true });

const props = defineProps({
  color: { type: String, default: "" },
  param: { type: Object, required: true },
  showMenu: { type: Boolean, default: true },
});
const param = computed(() => props.param as TParameter);

const items = [
  {
    onClick: () => {
      param.value.state.random = !param.value.state.random;
    },
    prependIcon: "custom:dice-multiple-outline",
    title: "Toggle view",
  },
  {
    icon: { class: "mdi-flip-h", icon: "mdi:mdi-reload" },
    onClick: () => {
      param.value.reset();
    },
    title: "Set default value",
  },
  {
    onClick: () => {
      param.value.reset();
      param.value.hide();
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
