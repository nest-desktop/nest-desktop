<template>
  <v-dialog max-width="1280">
    <template #default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <v-icon icon="mdi:mdi-trash-can-outline" size="small" />
          Delete

          <v-btn
            @click="isActive.value = false"
            flat
            icon="mdi:mdi-close"
            size="small"
          />
        </v-card-title>

        <v-data-table-virtual
          :headers
          :items="state.items"
          item-selectable="valid"
          item-value="name"
          return-object
          show-select
          v-model="state.selected"
        >
          <template #item.valid="{ value }">
            <v-icon
              :color="value ? 'success' : 'error'"
              :icon="value ? 'mdi-check' : 'mdi-close'"
            />
          </template>
        </v-data-table-virtual>

        <v-card-actions>
          <v-btn
            :disabled="state.selected.length === 0"
            @click="
              () => {
                deleteSelected();
                isActive.value = false;
              }
            "
            prepend-icon="mdi:mdi-trash-can-outline"
            size="small"
            text="delete selected"
            variant="outlined"
          />

          <v-btn
            @click="update()"
            prepend-icon="mdi:mdi-reload"
            size="small"
            text="Reload"
            variant="outlined"
          />

          <v-btn
            @click="isActive.value = false"
            size="small"
            text="close"
            variant="outlined"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { Store } from "pinia";
import { computed, onMounted, reactive } from "vue";

import { IModelProps } from "@/helpers/model/model";
import { IProjectProps } from "@/helpers/project/project";
import { TProject } from "@/types";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

interface IDeleteProps {
  name: string;
  props: IModelProps | IProjectProps;
}

const props = defineProps<{
  store: Store<any, any>;
}>();
const store = computed(() => props.store);

const state = reactive({
  items: [] as IDeleteProps[],
  selected: [] as IDeleteProps[],
});

const headers = [
  { title: "Name", value: "name" },
  { title: "Created at", key: "props.createdAt" },
];

/**
 * Delete selected.
 */
const deleteSelected = () => {
  state.selected = [] as IDeleteProps[];
};

/**
 * Update list item.
 */
const update = (): void => {
  state.selected = [] as IDeleteProps[];
  state.items = [] as IDeleteProps[];

  store.value.state.projects.forEach((project: TProject | IProjectProps) => {
    state.items.push({
      name: project.name as string,
      props: project.doc ? project.toJSON() : project,
    });
  });
};

onMounted(() => {
  update();
});
</script>
