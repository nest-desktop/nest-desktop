<template>
  <v-navigation-drawer
    :model-value="navStore.state.open"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="navStore.state.width"
    permanent
    @transitionend="navStore.dispatchWindowResize()"
  >
    <div class="resize-handle" @mousedown="navStore.resizeSideNav()" />

    <v-toolbar :color class="fixed-bar" density="compact" extended extension-height="36">
      <v-text-field
        v-model="state.search"
        class="mx-1"
        clearable
        density="compact"
        hide-details
        placeholder="Search model"
        prepend-inner-icon="mdi:mdi-magnify"
        single-line
      />

      <template #extension>
        <slot name="newModel">
          <!-- <v-fab
            @click="dialogNewModel()"
            class="ms-4"
            color="primary"
            icon="mdi:mdi-plus"
            location="bottom left"
            size="40"
            absolute
            offset
            title="Create a new model"
          /> -->
        </slot>

        <v-row class="ma-2" no-gutters>
          <v-spacer />

          <v-chip
            :text="state.source"
            class="mx-1"
            density="compact"
            prepend-icon="mdi:mdi-filter-variant"
            title="source of the models"
            variant="text"
            @click="state.source = sources[(sources.indexOf(state.source) + 1) % sources.length]"
          />

          <v-chip
            :prepend-icon="'mdi:mdi-order-alphabetical-' + (state.orderByAsc ? 'ascending' : 'descending')"
            class="mx-1"
            density="compact"
            text="sort"
            title="order by"
            variant="text"
            @click="state.orderByAsc = !state.orderByAsc"
          />

          <v-spacer />

          <span class="text-subtitle-2">
            {{ models.length }}
            model<span v-show="models.length > 1" text="s" />
          </span>
        </v-row>
      </template>

      <Menu :items />
    </v-toolbar>

    <v-list class="pt-0" density="compact" lines="two" nav>
      <v-list-subheader class="pa-0" inset style="margin-left: -28px">
        <v-btn-toggle v-model="state.elementType" density="compact" style="height: 24px">
          <v-btn
            v-for="elementType in elementTypes"
            :key="elementType"
            :text="elementType"
            :value="elementType"
            size="x-small"
            style="font-size: 9px"
          />
        </v-btn-toggle>
      </v-list-subheader>

      <v-virtual-scroll :items="models" :key="models.length">
        <template #default="{ item }">
          <v-hover v-slot="{ isHovering, props }">
            <v-list-item
              :subtitle="(item as TModel).elementType"
              :title="(item as TModel).state.label || (item as TModel).id"
              :to="{
                name: appStore.state.currentWorkspace+ 'Model',
                params: { modelId: (item as TModel).id },
              }"
              v-bind="props"
            >
              <template #append>
                <v-chip v-if="appStore.state.devMode" :text="item.hash" size="x-small" />
                <ModelMenu :color="isHovering ? 'primary' : 'transparent'" :model="(item as TModel)" />
              </template>
            </v-list-item>
          </v-hover>
        </template>
      </v-virtual-scroll>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import { TElementType } from "@/helpers/model/model";
import { TModel } from "@/types";
import { sortString } from "@/utils/array";

import DeleteDialog from "../dialog/DeleteDialog.vue";
import ExportDialog from "../dialog/ExportDialog.vue";
import ImportDialog from "../dialog/ImportDialog.vue";
import Menu from "../common/Menu.vue";
import ModelMenu from "./ModelMenu.vue";
// import TextFieldDialog from "../dialog/TextFieldDialog.vue";

// import { useRouter } from "vue-router";
// const router = useRouter();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

defineProps<{ color: string }>();

const modelStore = computed(() => appStore.currentWorkspace.stores.modelStore);
const modelDBStore = computed(() => appStore.currentWorkspace.stores.modelDBStore);

const models = computed(() => {
  let models: TModel[] = [];

  if (state.source == appStore.currentWorkspace.id) {
    models = modelStore.value.state.models;
  } else {
    models = modelDBStore.value.state.models;

    if (state.source === "custom") {
      models = models.filter((model: TModel) => model.state.custom);
    }
  }

  if (state.search) {
    models = models.filter((model: TModel) =>
      model.state.label.toLocaleLowerCase().includes(state.search ? state.search.toLocaleLowerCase() : ""),
    );
  }

  if (state.elementType) {
    models = models.filter((model: TModel) => model.elementType === state.elementType);
  }

  const sortedBy = "id";
  models.sort((a: TModel, b: TModel) => sortString(a[sortedBy], b[sortedBy], state.orderByAsc));

  return models;
});

const state = reactive<{
  elementType: string;
  orderByAsc: boolean;
  search: string;
  source: string;
}>({
  elementType: "",
  orderByAsc: true,
  search: "",
  source: "installed",
});

const sources = ["installed", "custom", appStore.currentWorkspace.id];
const elementTypes: TElementType[] = ["neuron", "recorder", "stimulator", "synapse"];

const items = [
  {
    id: "import-dialog",
    onClick: () => {
      createDialog({
        customComponent: {
          component: ImportDialog,
          props: {},
        },
        dialogOptions: {
          width: "1280px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-import",
    title: "Import",
  },
  {
    id: "export-dialog",
    onClick: () => {
      createDialog({
        customComponent: {
          component: ExportDialog,
          props: {
            project: false,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-export",
    title: "Export",
  },
  {
    id: "delete-dialog",
    onClick: () => {
      createDialog({
        customComponent: {
          component: DeleteDialog,
          props: {
            store: modelDBStore.value,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete",
  },
];

// const dialogNewModel = () => {
//   createDialog({
//     customComponent: {
//       component: TextFieldDialog,
//       props: {
//         title: "Create model",
//         modelValue: "new model " + modelDBStore.value.state.models.length,
//       },
//     },
//     text: "",
//     title: "",
//   }).then((modelLabel: string | undefined) => {
//     if (modelLabel) {
//       let modelId = modelLabel as string;
//       const model = modelDBStore.value.newModel({
//         id: modelId.replaceAll(" ", "_"),
//         label: modelLabel,
//       });

//       nextTick(() => {
//         router.push({
//           name: appStore.state.currentWorkspace+ "ModelEditor",
//           params: { modelId: model.id },
//         });
//       });
//     }
//   });
// };
</script>

<style lang="scss" scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 0em;
  z-index: 2;
}

.resize-handle {
  cursor: ew-resize;
  height: 100%;
  right: 0;
  position: fixed;
  width: 2px;
  z-index: 10;
}
</style>
