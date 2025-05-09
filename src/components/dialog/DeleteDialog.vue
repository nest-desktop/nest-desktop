<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <v-icon icon="mdi:mdi-trash-can-outline" size="small" />
      Delete
      <v-btn icon="mdi:mdi-close" size="small" @click="closeDialog()" />
    </v-card-title>

    <v-data-table-virtual
      v-model="state.selected"
      :headers
      :items="state.items"
      item-selectable="valid"
      item-value="name"
      return-object
      show-select
    >
      <template #[`item.valid`]="{ value }">
        <v-icon :color="value ? 'success' : 'error'" :icon="value ? 'mdi:mdi-check' : 'mdi:mdi-close'" />
      </template>
    </v-data-table-virtual>

    <v-card-actions>
      <v-btn
        :disabled="state.selected.length === 0"
        prepend-icon="mdi:mdi-trash-can-outline"
        text="delete selected"
        @click="
          () => {
            deleteSelected();
            closeDialog();
          }
        "
      />
      <v-btn prepend-icon="mdi:mdi-reload" text="Reload" @click="update()" />
      <v-btn text="close" @click="closeDialog()" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";

import { IModelProps } from "@/helpers/model/model";
import { INetworkProjectProps } from "@/helpers/project/networkProject";
import { TModel, TProject, TStore } from "@/types";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

interface IDeleteProps {
  group: string;
  name: string;
  props: IModelProps | INetworkProjectProps;
}

const props = defineProps<{ store: TStore }>();
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
const closeDialog = (value?: string | boolean) => emit("closeDialog", value);

/**
 * Delete selected.
 */
const deleteSelected = () => {
  if (store.value.state.projects) {
    const projectProps = state.selected.filter((item) => item.group === "project").map((project) => project.props);
    store.value.deleteProjects(projectProps);
  }

  if (store.value.state.models) {
    const modelProps = state.selected.filter((item) => item.group === "model").map((model) => model.props);
    store.value.deleteModels(modelProps);
  }

  state.selected = [];
};

/**
 * Update list item.
 */
const update = (): void => {
  state.selected = [];
  state.items = [];

  if (store.value.state.projects) {
    store.value.state.projects.forEach((project: TProject | INetworkProjectProps) => {
      state.items.push({
        group: "project",
        name: project.name as string,
        props: project.doc ? project.toJSON() : project,
      });
    });
  }

  if (store.value.state.models) {
    store.value.state.models.forEach((model: TModel) => {
      state.items.push({
        group: "model",
        name: model.state.label as string,
        props: model.toJSON(),
      });
    });
  }
};

onMounted(() => {
  update();
});
</script>
