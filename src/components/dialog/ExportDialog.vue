<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <v-icon icon="mdi:mdi-export" size="small" />
      Export

      <v-btn @click="closeDialog()" flat icon="mdi:mdi-close" size="small" />
    </v-card-title>

    <v-data-table-virtual
      :group-by="[{ key: 'group', order: 'asc' }]"
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
            exportSelected();
            closeDialog();
          }
        "
        prepend-icon="mdi:mdi-export"
        text="export selected"
      />
      <v-btn @click="update()" prepend-icon="mdi:mdi-reload" text="reload" />
      <v-btn @click="closeDialog()" text="close" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import { IModelProps } from "@/helpers/model/model";
import { IProjectProps } from "@/helpers/project/project";
import { TModel, TProject } from "@/types";
import { download } from "@/utils/download";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

interface IExportProps {
  group?: string;
  name: string;
  props: IModelProps | IProjectProps;
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

const modelDBStore = computed(
  () => appStore.currentSimulator.stores.modelDBStore
);
const projectDBStore = computed(
  () => appStore.currentSimulator.stores.projectDBStore
);

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
  download(
    JSON.stringify(
      state.selected.map((selected: IExportProps) => selected.props)
    )
  );
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
    projectDBStore.value.state.projects.forEach(
      (project: TProject | IProjectProps) => {
        const item: IExportProps = {
          name: project.name as string,
          props: project.doc ? project.toJSON() : project,
        };

        if (props.model) {
          item.group = "project";
        }

        state.items.push(item);
      }
    );
  }
};

onMounted(() => {
  update();
});
</script>
