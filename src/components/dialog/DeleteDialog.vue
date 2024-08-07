<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <v-icon icon="mdi:mdi-trash-can-outline" size="small" />
      Delete

      <v-btn @click="closeDialog()" flat icon="mdi:mdi-close" size="small" />
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
          :icon="value ? 'mdi:mdi-check' : 'mdi:mdi-close'"
        />
      </template>
    </v-data-table-virtual>

    <v-card-actions>
      <v-btn
        :disabled="state.selected.length === 0"
        @click="
          () => {
            deleteSelected();
            closeDialog();
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
        @click="closeDialog()"
        size="small"
        text="close"
        variant="outlined"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import { IModelProps } from "@/helpers/model/model";
import { IProjectProps } from "@/helpers/project/project";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModel, TProject } from "@/types";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

interface IDeleteProps {
  name: string;
  props: IModelProps | IProjectProps;
}

const props = defineProps<{
  store: TModelDBStore | TProjectDBStore;
}>();
const store = computed(() => props.store);

const state = reactive<{ items: IDeleteProps[]; selected: IDeleteProps[] }>({
  items: [],
  selected: [],
});

const headers = [
  { title: "Name", value: "name" },
  { title: "Created at", key: "props.createdAt" },
];

const emit = defineEmits(["closeDialog"]);
function closeDialog(value?: string | boolean) {
  emit("closeDialog", value);
}

/**
 * Delete selected.
 */
const deleteSelected = () => {
  state.selected = [];
};

/**
 * Update list item.
 */
const update = (): void => {
  state.selected = [];
  state.items = [];

  if (store.value.state.projects) {
    store.value.state.projects.forEach((project: TProject | IProjectProps) => {
      state.items.push({
        name: project.name as string,
        props: project.doc ? project.toJSON() : project,
      });
    });
  }

  if (store.value.state.models) {
    store.value.state.models.forEach((model: TModel) => {
      state.items.push({
        name: model.label as string,
        props: model.toJSON(),
      });
    });
  }
};

onMounted(() => {
  update();
});
</script>
