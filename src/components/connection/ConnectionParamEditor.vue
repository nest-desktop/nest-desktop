<template>
  <v-list-item class="param pl-0 pr-1" v-if="props.param">
    <v-row no-gutters>
      <v-checkbox
        :color="param.connection.source.view.color"
        :modelValue="(param.value as boolean)"
        @update:modelValue="update"
        density="compact"
        hideDetails
        v-bind="param.options"
        v-if="param.options.variant === 'checkbox'"
      />
      <value-slider
        :color="param.connection.source.view.color"
        :modelValue="(param.value as number)"
        @update:modelValue="update"
        v-bind="param.options"
        v-else
      />

      <v-menu :closeOnContentClick="false">
        <template #activator="{ props }">
          <v-btn
            color="primary"
            class="menu align-center justify-center my-auto"
            icon="mdi-dots-vertical"
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
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ValueSlider from "@/components/controls/ValueSlider.vue";
import { ConnectionParameter } from "@/helpers/connection/connectionParameter";

const props = defineProps({
  param: ConnectionParameter,
});

const param = computed(() => props.param as ConnectionParameter);

const update = (value: number | number[] | boolean | null) => {
  if (value == null) return;
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
