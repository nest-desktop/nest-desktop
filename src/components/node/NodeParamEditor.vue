<template>
  <v-list-item class="param pl-0 pr-1" v-if="props.param">
    <v-row no-gutters>
      <ParameterSpecMenu :param v-if="param.state.random" />

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
        <span
          class="px-2 py-auto text-medium-emphasis"
          cols="10"
          style="font-size: 15px"
        >
          {{ param.label }}
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
          v-model="param.state.value"
          variant="underlined"
        >
        </v-text-field>
      </template>
    </v-row>

    <template #append>
      <v-menu>
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
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ArrayInput from "../controls/ArrayInput.vue";
import RangeSlider from "../controls/RangeSlider.vue";
import TickSlider from "../controls/TickSlider.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { NodeParameter } from "@/helpers/node/nodeParameter";
import ParameterSpecMenu from "../parameter/ParameterSpecMenu.vue";

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
    iconClass: "",
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

<style lang="scss">
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
</style>
