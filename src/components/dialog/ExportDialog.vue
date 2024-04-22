<template>
  <v-dialog max-width="1280">
    <template #activator="{ props: activatorProps }">
      <v-btn
        icon="mdi:mdi-export"
        style="min-width: 40px"
        title="Open dialog to export"
        v-bind="activatorProps"
      />
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-toolbar color="transparent" density="compact">
          <span class="mx-2 font-weight-bold">
            <v-icon icon="mdi:mdi-export" size="small" />
            Export
          </span>

          <v-spacer />

          <v-btn
            @click="isActive.value = false"
            icon="mdi:mdi-close"
            size="small"
          />
        </v-toolbar>

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
              :icon="value ? 'mdi-check' : 'mdi-close'"
            />
          </template>
        </v-data-table-virtual>

        <v-card-actions>
          <v-btn
            :disabled="state.selected.length === 0"
            @click="
              () => {
                exportSelected();
                isActive.value = false;
              }
            "
            prepend-icon="mdi:mdi-export"
            size="small"
            text="export selected"
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
import { TModel } from "@/types/modelTypes";
import { TProject } from "@/types/projectTypes";
import { download } from "@/helpers/common/download";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

interface IExportProps {
  group: string;
  name: string;
  props: IModelProps | IProjectProps;
}

const props = defineProps<{
  modelDBStore: Store<any, any>;
  projectDBStore: Store<any, any>;
}>();
const modelDBStore = computed(() => props.modelDBStore);
const projectDBStore = computed(() => props.projectDBStore);

const state = reactive({
  items: [] as IExportProps[],
  selected: [] as IExportProps[],
});

const headers = [
  { title: "Name", value: "name" },
  { title: "Created at", key: "props.createdAt" },
];

/**
 * Export selected.
 */
const exportSelected = () => {
  download(
    JSON.stringify(
      state.selected.map((selected: IExportProps) => selected.props)
    )
  );
  state.selected = [] as IExportProps[];
};

/**
 * Update list item.
 */
const update = (): void => {
  state.selected = [] as IExportProps[];
  state.items = [] as IExportProps[];

  modelDBStore.value.state.models.forEach((model: TModel) => {
    state.items.push({
      group: "model",
      name: model.label,
      props: model.toJSON(),
    });
  });

  projectDBStore.value.state.projects.forEach(
    (project: TProject | IProjectProps) => {
      state.items.push({
        group: "project",
        name: project.name as string,
        props: project.doc ? project.toJSON() : project,
      });
    }
  );
};

onMounted(() => {
  update();
});
</script>
