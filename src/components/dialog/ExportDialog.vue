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
import { computed, onMounted, reactive } from "vue";

import { IModelProps } from "@/helpers/model/model";
import { INetworkProjectProps } from "@/helpers/project/networkProject";
import { TModel, TProject } from "@/types";
import { download } from "@/utils/download";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

interface IExportProps {
  group?: string;
  name: string;
  props: IModelProps | INetworkProjectProps;
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

const modelDBStore = computed(() => appStore.currentWorkspace.stores.modelDBStore);
const projectDBStore = computed(() => appStore.currentWorkspace.stores.projectDBStore);

const state = reactive<{ items: IExportProps[]; selected: IExportProps[] }>({
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
  download(JSON.stringify(state.selected.map((selected: IExportProps) => selected.props)));
  state.selected = [];
};

/**
 * Update list item.
 */
const update = (): void => {
  state.selected = [];
  state.items = [];

  if (props.model) {
    modelDBStore.value.state.models.forEach((model: TModel) => {
      const item: IExportProps = {
        name: model.state.label,
        props: model.toJSON(),
      };

      if (props.project) {
        item.group = "model";
      }

      state.items.push(item);
    });
  }

  if (props.project) {
    projectDBStore.value.state.projects.forEach((project: TProject | INetworkProjectProps) => {
      const item: IExportProps = {
        name: project.name as string,
        props: project.doc ? project.toJSON() : project,
      };

      if (props.model) {
        item.group = "project";
      }

      state.items.push(item);
    });
  }
};

onMounted(() => {
  update();
});
</script>
