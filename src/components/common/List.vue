<template>
  <v-list class="list" density="compact" v-model:opened="state.listOpen">
    <v-list-item
      @click="state.listOpen = []"
      prepend-icon="mdi-chevron-left"
      v-if="state.listOpen.length > 0"
    >
      {{ state.listOpen[0] }}
    </v-list-item>

    <div :key="index" v-for="(item, index) in items">
      <v-list-group
        :value="item.value"
        class="no-expand-transition"
        collapse-icon="mdi-chevron-left"
        expand-icon="mdi-chevron-right"
        v-if="'items' in item"
      >
        <template #activator="{ props }">
          <v-list-item
            :prepend-icon="item.icon"
            :title="item.title"
            v-bind="props"
            v-show="state.listOpen.length == 0"
          />
        </template>

        <v-list-item
          :key="'sub' + i"
          v-for="(subitem, i) in item.items"
          :prepend-icon="subitem.icon"
          :title="subitem.title"
          :value="subitem.value"
          class="sublist"
          style="padding-inline-start: 16px !important"
        />
      </v-list-group>

      <div v-else>
        <v-list-item
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          v-if="state.listOpen.length == 0"
        />
      </div>
    </div>
  </v-list>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

defineProps(["items"]);

const state = reactive({
  listOpen: [],
});
</script>

<style lang="scss">
.list {
  .no-expand-transition .expand-transition-enter-active,
  .no-expand-transition .expand-transition-leave-active {
    transition: none !important;
  }

  .sublist {
    border-left: 2px solid rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
    margin-inline-start: 28px !important;
  }
}
</style>
