<template>
  <v-list-item v-if="param" class="param my-1 pa-1" style="line-height: 32px">
    <template v-if="param.intf && param.intf[param.id]">
      <template v-if="param.state.random">
        <v-label class="px-1" style="width: 100%">
          {{ param.label || param.options.label || param.id }}
          <v-spacer />
          {{ param.id }}: {{ param.code }}
        </v-label>
      </template>

      <ArrayInput
        v-else-if="param.options.component === 'arrayInput'"
        v-bind="param.options"
        v-model="(param.intf[param.id].value as number[])"
      />

      <v-checkbox
        v-else-if="param.options.component === 'checkbox'"
        v-bind="param.options"
        v-model="(param.intf[param.id].value as boolean)"
        :color="color"
        density="compact"
        hide-details
      />

      <RangeSlider
        v-else-if="param.options.component === 'rangeSlider'"
        v-bind="param.options"
        v-model="(param.intf[param.id].value as number[])"
        :thumb-color="color"
      />

      <v-select
        v-else-if="param.options.component === 'select'"
        v-bind="param.options"
        v-model="(param.intf[param.id].value as string)"
        :items="param.items"
        class="pa-1 pb-0"
        density="compact"
        hide-details
      />

      <TickSlider
        v-else-if="param.options.component === 'tickSlider'"
        v-bind="param.options"
        v-model="(param.intf[param.id].value as number)"
        :thumb-color="color"
      />

      <ValueSlider
        v-else-if="param.options.component === 'valueSlider'"
        v-bind="param.options"
        v-model="param.intf[param.id].value"
        :thumb-color="color"
      />

      <template v-else>
        <v-row class="pt-1" no-gutters>
          <v-label :title="param.label || param.options.label" class="text-truncate">
            {{ param.label || param.options.label }}
          </v-label>

          <v-spacer />

          <v-text-field
            v-model="param.intf[param.id].value"
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

import { BaseParameter } from "@/helpers/common/parameter";
import { TParameter } from "@/types";

import ArrayInput from "../controls/ArrayInput.vue";
import Menu from "../common/Menu.vue";
import ParamPopover from "../parameter/ParamPopover.vue";
import RangeSlider from "../controls/RangeSlider.vue";
import TickSlider from "../controls/TickSlider.vue";
import ValueSlider from "../controls/ValueSlider.vue";

// const emit = defineEmits(["update:paramValue"]);
const props = defineProps({
  color: { type: String, default: "" },
  param: { type: BaseParameter, required: true },
  showMenu: { type: Boolean, default: true },
});
const param = computed(() => props.param as TParameter);

// const update = () => {
//   nextTick(() => {
//     emit("update:paramValue", param.intf.value);
//   });
// };

const items = [
  {
    onClick: () => {
      param.value.state.random = !param.value.state.random;
      param.value.onUpdate();
    },
    prependIcon: "custom:dice-multiple-outline",
    title: "Toggle view",
  },
  {
    icon: { class: "mdi-flip-h", icon: "mdi:mdi-reload" },
    onClick: () => {
      param.value.reset();
      param.value.onUpdate();
    },
    title: "Set default value",
  },
  {
    onClick: () => {
      param.value.reset();
      param.value.hide();
      param.value.onUpdate();
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
