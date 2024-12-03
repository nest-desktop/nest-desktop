<template>
  <v-list
    v-model:opened="state.listOpen"
    class="list"
    density="compact"
  >
    <v-list-item
      v-if="state.listOpen.length > 0"
      prepend-icon="mdi:mdi-chevron-left"
      @click="state.listOpen = []"
    >
      {{ state.listOpen[0] }}
    </v-list-item>

    <div
      v-for="(item, index) in items"
      :key="index"
    >
      <v-list-group
        v-if="'items' in item"
        :value="item.value"
        class="no-expand-transition"
        collapse-icon="mdi:mdi-chevron-left"
        expand-icon="mdi:mdi-chevron-right"
      >
        <template #activator="{ props }">
          <v-list-item
            v-show="state.listOpen.length == 0"
            v-bind="props"
            :prepend-icon="item.icon"
            :title="item.title"
          />
        </template>

        <v-list-item
          v-for="(subitem, i) in item.items"
          :key="'sub' + i"
          :prepend-icon="subitem.icon"
          :title="subitem.title"
          :value="subitem.value"
          class="subitem"
          style="padding-inline-start: 16px !important"
        />
      </v-list-group>

      <div v-else>
        <v-list-item
          v-if="state.listOpen.length == 0"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
        />
      </div>
    </div>
  </v-list>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

interface IItem {
  icon: string,
  title: string,
  value: string,
  items?: IItem[]
}



defineProps<{ items: IItem[] }>();

const state = reactive<{ listOpen: any }>({
  listOpen: [],
});
</script>

<style lang="scss">
.list {
  .no-expand-transition .expand-transition-enter-active,
  .no-expand-transition .expand-transition-leave-active {
    transition: none !important;
  }

  .subitem {
    border-left: 2px solid
      rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
    margin-inline-start: 28px !important;
  }
}
</style>
