<template>
  <v-combobox
    :append-inner-icon="state.valid && !state.exist ? 'mdi:mdi-plus' : false"
    :hide-no-data="false"
    :items="moduleStore.state.modules"
    :rules
    @click:append-inner="state.valid ? moduleStore.addModule(state.search) : ''"
    @update:search="updateModuleExisting()"
    @update:model-value="updateModuleExisting()"
    density="compact"
    hide-details="auto"
    label="Module"
    prepend-inner-icon="mdi:mdi-memory"
    item-title="id"
    item-value="id"
    v-model:search="state.search"
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
            @click.stop="moduleStore.removeModule(item.title)"
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

import { useModuleStore } from "../../stores/moduleStore";
const moduleStore = useModuleStore();

const state = reactive({
  search: "nestmlmodule",
  exist: true,
  valid: false,
});

const rules = [
  (value: string | undefined) => {
    state.valid = typeof value === "string" ? value.endsWith("module") : true;
    return state.valid || "The module name must ends with `module`.";
  },
];

const updateModuleExisting = () => {
  const moduleIds = moduleStore.moduleIds();
  state.exist = moduleIds.includes(state.search);
};
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
