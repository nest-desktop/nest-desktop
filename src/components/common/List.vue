<template>
  <v-list v-model:opened="state.listOpen">
    <v-list-item
      @click="state.listOpen = []"
      append-icon="mdi-chevron-left"
      v-if="state.listOpen.length > 0"
    >
      Back
    </v-list-item>

    <div v-for="(item, index) in items" :key="index">
      <v-list-group
        collapse-icon="mdi-chevron-left"
        expand-icon="mdi-chevron-right"
        fluid
        :value="item.value"
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
          :prepend-icon="subitem.icon"
          :title="subitem.title"
          :value="subitem.value"
          v-for="(subitem, i) in item.items"
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

const props = defineProps(["items"]);

const state = reactive({
  listOpen: [],
});

</script>
