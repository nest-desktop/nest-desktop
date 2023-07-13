<template>
  <v-list-item class="param">
    <v-row no-gutters>
      <range-slider
        :color="props.color"
        v-bind="props.options"
        v-if="props.options != undefined && props.options.variant === 'range'"
        v-model="modelValue"
      />
      <tick-slider
        :color="props.color"
        v-bind="props.options"
        v-else-if="props.options != undefined && props.options.variant === 'ticks'"
        v-model="modelValue"
      />
      <value-slider
        :color="props.color"
        v-bind="props.options"
        v-else
        v-model="modelValue"
      />

      <v-menu :close-on-content-click="false" density="compact">
        <template #activator="{ props }">
          <v-btn
            color="primary"
            class="menu align-center justify-center my-auto"
            icon="mdi-dots-vertical"
            size="small"
            v-bind="props"
            variant="text"
          />
        </template>
        <list :items="items" />
      </v-menu>
    </v-row>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed, } from "vue";

import List from "@/components/common/List.vue";
import RangeSlider from "@/components/common/RangeSlider.vue";
import TickSlider from "@/components/common/TickSlider.vue";
import ValueSlider from "@/components/common/ValueSlider.vue";

const props = defineProps(["color", "options", "modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: Number | String) => {
    emit("update:modelValue", value);
  },
});

const params = [
  {
    title: "Management",
    icon: "mdi-account-multiple-outline",
    value: "management",
  },
  { title: "Settings", icon: "mdi-cog-outline", value: "settings" },
];

const cruds = [
  { title: "Create", icon: "mdi-plus-outline", value: "create" },
  { title: "Read", icon: "mdi-file-outline", value: "read" },
  { title: "Update", icon: "mdi-update", value: "update" },
  { title: "Delete", icon: "mdi-delete", value: "delete" },
];

const items = [
  {
    value: "parameter",
    title: "parameter",
    icon: "mdi-account-circle",
    items: params,
  },
  {
    value: "node",
    title: "node",
    icon: "mdi-database-cog-outline",
    items: cruds,
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
  .v-text-field__suffix {
    opacity: 0;
  }
  .menu {
    opacity: 1;
  }
}
</style>
