<template>
  <v-list density="compact" v-model:opened="state.listOpen">
    <v-list-item
      @click="state.listOpen = []"
      prepend-icon="mdi-chevron-left"
      v-if="state.listOpen.length > 0"
    >
      Back
    </v-list-item>

    <template :key="index" v-for="(item, index) in items">
      <v-list-group
        :value="item.value"
        class="no-expand-transition"
        collapse-icon="mdi-chevron-left"
        expand-icon="mdi-chevron-right"
        fluid
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
    </template>
  </v-list>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const props = defineProps(["items"]);

const state = reactive({
  listOpen: [],
});
</script>

<style>
.no-expand-transition .expand-transition-enter-active ,
.no-expand-transition .expand-transition-leave-active {
  transition: none !important;
}
</style>
