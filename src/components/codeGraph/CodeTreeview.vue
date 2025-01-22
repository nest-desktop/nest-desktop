<template>
  <!-- <v-sheet class="pa-4">
    <v-text-field
      v-model="search"
      clear-icon="mdi-close-circle-outline"
      label="Search"
      clearable
      dark
      flat
      hide-details
      solo
      density="compact"
      prepend-icon="mdi:mdi-file-tree-outline"
    />
  </v-sheet> -->

  <!-- <v-treeview :items density="compact" open-all></v-treeview> -->

  <v-list density="compact" style="font-size: 12px; font-family: monospace">
    <draggable v-model="code.graph.nodes" group="people" item-key="id" @start="drag = true" @end="dragEnd()">
      <template #item="{ element }">
        <v-list-item style="height: 1.4em; min-height: auto; line-height: 16.8px">
          <v-btn :disabled="element.state.integrated" icon="mdi:mdi-drag" variant="text" size="xsmall" />
          <span :class="{ hidden: element.idx === -1 }" style="display: inline-block; text-align: right; width: 32px">
            {{ element.idx + 1 }} -
          </span>
          {{ element.title }}
        </v-list-item>
      </template>
    </draggable>
  </v-list>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import draggable from "vuedraggable";

import { BaseCode } from "@/helpers/code/code";

const props = defineProps<{ code: BaseCode }>();
const code = computed(() => props.code as BaseCode);
const drag = ref(false);

const dragEnd = () => {
  drag.value = false;
  code.value.generate();
};

// interface IItem {
//   title: string;
//   id?: number;
//   children?: IItem[];
// }

// const search = ref(null);
// const caseSensitive = ref(false);
// const filterFn = function (value: string, search, item) {
//   return caseSensitive.value ? value.indexOf(search) > -1 : value.toLowerCase().indexOf(search.toLowerCase()) > -1;
// };

// const updateItems = (items: IItem[]) => {
//   let id = 1;

//   const updateItemId = (item: IItem): void => {
//     item.id = id;
//     id += 1;
//     // item.children?.forEach((child: IItem) => updateItemId(child));
//   };

//   items.forEach((item: IItem) => updateItemId(item));
// };

// onMounted(update);
</script>

<style lang="scss">
.hidden {
  opacity: 0;
}
</style>
