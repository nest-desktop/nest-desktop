<template>
  <v-list-item class="param pl-0 pr-1" v-if="props.param">
    <v-row no-gutters>
      <v-checkbox
        :model-value="(param.state.value as boolean)"
        @update:model-value="update"
        density="compact"
        hide-details
        v-bind="param.options"
        v-if="param.options.component === 'checkbox'"
      />

      <TickSlider
        :model-value="(param.state.value as number)"
        @update:model-value="update"
        v-bind="param.options"
        v-else-if="param.options.component === 'tickSlider'"
      />

      <ValueSlider
        :model-value="(param.state.value as number)"
        @update:model-value="update"
        v-bind="param.options"
        v-else
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

import TickSlider from "../controls/TickSlider.vue";
import ValueSlider from "../controls/ValueSlider.vue";
import { ActivityChartPanelModelParameter } from "@/helpers/activityChartGraph/activityChartPanelModelParameter";

const props = defineProps<{ param: ActivityChartPanelModelParameter }>();
const param = computed(() => props.param);

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

const update = (value: boolean | number | null) => {
  if (value == null) return;
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
}
</style>
