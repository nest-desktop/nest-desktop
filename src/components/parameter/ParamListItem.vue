<template>
  <v-list-item class="param pa-1" v-if="param" style="line-height: 32px">
    <template v-if="param.state.random">
      <v-label class="px-1" style="width: 100%">
        {{ param.label || param.options.label || param.id }}
        <v-spacer />
        {{ param.id }}: {{ param.code }}
      </v-label>
    </template>

    <ArrayInput
      @update:model-value="update"
      v-bind="param.options"
      v-else-if="param.options.component === 'arrayInput'"
      v-model="(param.value as Number[])"
    />

    <v-checkbox
      :color="color"
      @update:model-value="update"
      density="compact"
      hide-details
      v-bind="param.options"
      v-else-if="param.options.component === 'checkbox'"
      v-model="(param.value as boolean)"
    />

    <RangeSlider
      :thumb-color="color"
      @update:model-value="update"
      v-bind="param.options"
      v-else-if="param.options.component === 'rangeSlider'"
      v-model="(param.value as number[])"
    />

    <v-select
      :items="param.items"
      @update:model-value="update"
      class="pa-1 pb-0"
      density="compact"
      hide-details
      v-bind="param.options"
      v-else-if="param.options.component === 'select'"
      v-model="(param.value as string)"
    />

    <TickSlider
      :thumb-color="color"
      @update:model-value="update"
      v-bind="param.options"
      v-else-if="param.options.component === 'tickSlider'"
      v-model="(param.value as number)"
    />

    <ValueSlider
      :thumb-color="color"
      @update:model-value="update"
      v-bind="param.options"
      v-else-if="param.options.component === 'valueSlider'"
      v-model="(param.value as number)"
    />

    <template v-else>
      <v-row class="pt-1" no-gutters>
        <v-label
          :title="param.label || param.options.label"
          class="text-truncate"
        >
          {{ param.label || param.options.label }}
        </v-label>

        <v-spacer />

        <v-text-field
          :label="param.id"
          :step="param.step"
          :suffix="param.unit"
          @update:model-value="update"
          density="compact"
          hide-details
          style="max-width: 80px"
          type="number"
          v-model="param.value"
          variant="underlined"
        />
      </v-row>
    </template>

    <template #append>
      <slot name="append">
        <template v-if="param.state.random">
          <ParamPopover :param size="x-small" />
        </template>

        <Menu :items size="x-small" />
      </slot>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed, nextTick } from "vue";

import ArrayInput from "../controls/ArrayInput.vue";
import ParamPopover from "../parameter/ParamPopover.vue";
import RangeSlider from "../controls/RangeSlider.vue";
import TickSlider from "../controls/TickSlider.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import Menu from "../common/Menu.vue";
import { TParameter } from "@/types";

const emit = defineEmits(["update:paramValue"]);
const props = defineProps<{
  color?: string;
  param: TParameter;
}>();
const param = computed(() => props.param);

const update = () => {
  nextTick(() => {
    emit("update:paramValue", param.value.value);
  });
};

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
