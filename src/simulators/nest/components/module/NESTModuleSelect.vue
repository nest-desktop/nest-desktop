<template>
  <v-select
    :items="moduleStore.state.modules"
    density="compact"
    hide-details
    label="Module"
    prepend-inner-icon="mdi:mdi-memory"
    item-title="name"
    item-value="name"
    variant="outlined"
  >
    <template #append>
      <slot name="append" />
    </template>

    <template #item="{ index, item, props }">
      <v-list-item :key="index" class="module-item" v-bind="props" title="">
        <template #prepend>
          <v-avatar class="text-uppercase" size="small" start>
            {{ item.title.slice(0, 2) }}
          </v-avatar>
        </template>

        {{ item.title }}
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts" setup>
import { useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();
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
