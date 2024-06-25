<template>
  <v-combobox
    :append-inner-icon="
      state.valid && !simulatorStore.state.modules.includes(state.search)
        ? 'mdi:mdi-plus'
        : false
    "
    :hide-no-data="false"
    :items="simulatorStore.state.modules"
    :rules
    @click:append-inner="
      state.valid ? simulatorStore.addModule(state.search) : ''
    "
    density="compact"
    hide-details="auto"
    label="Module which model is installed to"
    prepend-inner-icon="mdi:mdi-memory"
    v-model:search="state.search"
    v-model="simulatorStore.state.selectedModule"
    variant="outlined"
  >
    <template #append><slot name="append" /></template>

    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          No results matching "
          <strong>{{ state.search }}</strong
          >".
          <span v-if="state.valid">
            Click <kbd>+</kbd> to create a new one.
          </span>
        </v-list-item-title>
      </v-list-item>
    </template>

    <template #item="{ index, item, props }">
      <v-list-item :key="index" class="module-item" v-bind="props" title="">
        <template #prepend>
          <v-avatar class="text-uppercase" size="small" start>
            {{ item.title.slice(0, 2) }}
          </v-avatar>
        </template>

        <template #append>
          <v-btn
            @click.stop="simulatorStore.removeModule(item.title)"
            class="icon"
            flat
            icon="mdi:mdi-close"
            size="x-small"
          />
        </template>

        {{ item.title }}
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import { useSimulatorStore } from "../../stores/simulatorStore";
const simulatorStore = useSimulatorStore();

const state = reactive({
  search: "nestmlmodule",
  valid: false,
});

const rules = [
  (value: string | undefined) => {
    state.valid = typeof value === "string" ? value.endsWith("module") : true;
    return state.valid || "The module name must ends with `module`.";
  },
];
</script>

<style lang="scss">
.module-item {
  .icon {
    display: none;
  }

  &:hover {
    .icon {
      display: block;
    }
  }
}
</style>
