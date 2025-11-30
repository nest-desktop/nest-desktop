<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <v-icon icon="mdi:mdi-export" size="small" />
      Export

      <v-btn flat icon="mdi:mdi-close" size="small" @click="closeDialog()" />
    </v-card-title>

    <v-data-table-virtual
      v-model="state.selected"
      :group-by="[{ key: 'group', order: 'asc' }]"
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
        prepend-icon="mdi:mdi-export"
        text="export selected"
        @click="
          () => {
            exportSelected();
            closeDialog();
          }
        "
      />
      <v-btn prepend-icon="mdi:mdi-reload" text="reload" @click="update()" />
      <v-btn text="close" @click="closeDialog()" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";

import type { IModelState } from "@/model";
import type { INetworkProjectState } from "@/project";
import type { TModel, TProject } from "@/types";
import { download } from "@/utils";

import { getCurrentDBStore } from "@/app";

interface IExportState {
  group?: string;
  name: string;
  props: IModelState | INetworkProjectState;
}

const props = defineProps({
  model: {
    type: Boolean,
    required: false,
    default: true,
  },
  project: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const modelDBStore = getCurrentDBStore("model");
const projectDBStore = getCurrentDBStore("project");

const state = reactive<{ items: IExportState[]; selected: IExportState[] }>({
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
 * Export selected.
 */
const exportSelected = () => {
  download(JSON.stringify(state.selected.map((selected: IExportState) => selected.props)));
  state.selected = [];
};

/**
 * Update list item.
 */
const update = (): void => {
  state.selected = [];
  state.items = [];

  if (props.model) {
    modelDBStore.state.models.forEach((model: TModel) => {
      const item: IExportState = {
        name: model.state.label,
        props: model.save(),
      };

      if (props.project) {
        item.group = "model";
      }

      state.items.push(item);
    });
  }

  if (props.project) {
    projectDBStore.state.projects.forEach((project: TProject | INetworkProjectState) => {
      const item: IExportState = {
        name: project.name as string,
        props: project.doc ? project.save() : project,
      };

      if (props.model) {
        item.group = "project";
      }

      state.items.push(item);
    });
  }
};

onMounted(() => update());
</script>
