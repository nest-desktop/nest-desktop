<template>
  <v-list-item class="param pl-0 pr-1" v-if="props.param">
    <v-row no-gutters>
      <ParameterSpecMenu :param v-if="param.state.random" />

      <v-checkbox
        :color="param.connection.sourceNode.view.color"
        :model-value="(param.value as boolean)"
        @update:model-value="update"
        density="compact"
        hide-details
        v-bind="param.options"
        v-if="param.options.component === 'checkbox'"
      />

      <ValueSlider
        :model-value="(param.value as number)"
        :thumb-color="param.connection.sourceNode.view.color"
        @update:model-value="update"
        v-bind="param.options"
        v-if="param.options.component === 'valueSlider'"
      />
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
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ParameterSpecMenu from "../parameter/ParameterSpecMenu.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { ConnectionParameter } from "@/helpers/connection/connectionParameter";

const props = defineProps<{ param: ConnectionParameter }>();
const param = computed(() => props.param as ConnectionParameter);

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
    title: "Set default value",
    icon: "mdi:mdi-reload",
    onclick: () => {
      param.value.reset();
      param.value.changes();
    },
  },
  {
    title: "Hide parameter",
    icon: "mdi:mdi-eye-off-outline",
    onclick: () => {
      param.value.hide();
      param.value.changes();
    },
  },
];

const update = (value: number | number[] | boolean | null) => {
  if (value == null) return;
  param.value.value = value;
  param.value.changes();
};
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
