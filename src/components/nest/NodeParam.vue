<template>
  <v-list-item class="param">
    <v-row no-gutters>
      <range-slider
        :color="state.color"
        :label="state.label"
        :input-label="state.inputLabel"
        :max="state.max"
        :min="state.min"
        :step="state.step"
        :unit="state.unit"
        v-if="state.variant === 'range'"
        v-model="modelValue"
      />
      <tick-slider
        :color="state.color"
        :input-label="state.inputLabel"
        :label="state.label"
        :ticks="state.ticks"
        :unit="state.unit"
        v-else-if="state.variant === 'ticks'"
        v-model="modelValue"
      />
      <value-slider
        :color="state.color"
        :input-label="state.inputLabel"
        :label="state.label"
        :max="state.max"
        :min="state.min"
        :step="state.step"
        :unit="state.unit"
        v-else
        v-model="modelValue"
      />

      <v-menu :close-on-content-click="false" density="compact">
        <template #activator="{ props }">
          <v-btn
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
import { computed, reactive, onMounted, watch } from "vue";

import List from "@/components/common/List.vue";
import RangeSlider from "@/components/common/RangeSlider.vue";
import TickSlider from "@/components/common/TickSlider.vue";
import ValueSlider from "@/components/common/ValueSlider.vue";

const props = defineProps(["color", "options", "modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  inputLabel: "",
  color: "primary",
  label: "undefined",
  max: 100,
  min: 0,
  step: 1,
  modelValue: 0,
  ticks: [0, 100],
  unit: "",
  variant: "value",
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

const modelValue = computed({
  get: () => state.modelValue,
  set: (val) => {
    state.modelValue = val;
    emit("update:modelValue", state.modelValue);
  },
});

const update = () => {
  state.color = props.color || "primary";
  state.inputLabel = props.options.inputLabel || "";
  state.label = props.options.label || "undefined";
  state.max = props.options.max || 100;
  state.min = props.options.min || 0;
  state.modelValue = props.modelValue || 0;
  state.step = props.options.step || 0;
  state.ticks = props.options.ticks || [1, 100];
  state.unit = props.options.unit || "";
  state.variant = props.options.variant || "value";
};

watch(() => [props.modelValue], update);
onMounted(update);
</script>

<style lang="scss">
.param:nth-child(odd) {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

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
