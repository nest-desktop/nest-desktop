<template>
  <v-navigation-drawer
    :model-value="navState.state.open"
    :style="{ transition: navState.state.resizing ? 'initial' : '' }"
    :width="navState.state.width"
    @transitionend="dispatchWindowResize()"
    permanent
  >
    <div @mousedown="resizeSidebar" class="resize-handle" />

    <v-toolbar
      class="fixed-bar"
      color="nest-model"
      density="compact"
      extended
      extension-height="36"
    >
      <v-text-field
        class="mx-1"
        clearable
        density="compact"
        hide-details
        placeholder="Search model"
        prepend-inner-icon="mdi:mdi-magnify"
        single-line
        v-model="state.search"
        variant="outlined"
      />

      <template #extension>
        <v-fab
          @click="dialogNewModel()"
          class="ms-4"
          color="primary"
          icon="mdi:mdi-plus"
          location="bottom left"
          size="40"
          absolute
          offset
          title="Create a new model"
        />

        <v-row class="ma-2" no-gutters>
          <v-spacer />

          <v-chip
            @click="
              state.source =
                sources[(sources.indexOf(state.source) + 1) % sources.length]
            "
            class="mx-1"
            density="compact"
            prepend-icon="mdi:mdi-filter-variant"
            title="source of the models"
          >
            {{ state.source }}
          </v-chip>

          <v-chip
            :prepend-icon="
              'mdi:mdi-order-alphabetical-' +
              (state.orderByAsc ? 'ascending' : 'descending')
            "
            @click="state.orderByAsc = !state.orderByAsc"
            class="mx-1"
            density="compact"
            title="order by"
          >
            sort
          </v-chip>

          <v-spacer />
          <span class="text-subtitle-2">
            {{ models.length }} model<span v-show="models.length > 1">s</span>
          </span>
        </v-row>
      </template>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="props" />
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            :value="index"
            @click="item.onClick()"
            v-for="(item, index) in menuItems"
          >
            <template #prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-list class="pt-0" density="compact" lines="two" nav>
      <v-list-subheader class="pa-0" inset style="margin-left: -28px">
        <v-btn-toggle
          density="compact"
          style="height: 24px"
          v-model="state.elementType"
        >
          <v-btn
            :key="elementType"
            :value="elementType"
            size="x-small"
            style="font-size: 9px"
            v-for="elementType in elementTypes"
          >
            {{ elementType }}
          </v-btn>
        </v-btn-toggle>
      </v-list-subheader>

      <v-virtual-scroll :items="models">
        <template #default="{ item }">
          <v-hover v-slot="{ isHovering, props }">
            <v-list-item
              :subtitle="(item as TModel).elementType"
              :title="(item as TModel).label || (item as TModel).id"
              :to="{
                name: appStore.state.simulator + 'Model',
                params: { modelId: (item as TModel).id },
              }"
              v-bind="props"
            >
              <template #append>
                <v-btn
                  :color="isHovering ? 'primary' : 'transparent'"
                  @click.stop="(e: MouseEvent) => e.preventDefault()"
                  class="list-item-menu"
                  icon
                  size="x-small"
                  variant="text"
                >
                  <v-icon icon="mdi:mdi-dots-vertical" />

                  <ModelMenu :model="item as TModel" />
                </v-btn>
              </template>
            </v-list-item>
          </v-hover>
        </template>
      </v-virtual-scroll>

      <!-- <template v-for="(model, index) in models">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            :key="index"
            :subtitle="model.elementType"
            :title="model.label || model.id"
            :to="{
              name: appStore.state.simulator + 'Model',
              params: { modelId: model.id },
            }"
            v-bind="props"
          >
            <template #append>
              <v-btn
                :color="isHovering ? 'primary' : 'transparent'"
                @click.stop="(e: MouseEvent) => e.preventDefault()"
                class="list-item-menu"
                icon
                size="x-small"
                variant="text"
              >
                <v-icon icon="mdi:mdi-dots-vertical" />

                <ModelMenu :model />
              </v-btn>
            </template>
          </v-list-item>
        </v-hover>
      </template> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import { TModel } from "@/types";

import DeleteDialog from "../dialog/DeleteDialog.vue";
import DialogTextField from "../dialog/DialogTextField.vue";
import ExportDialog from "../dialog/ExportDialog.vue";
import ImportDialog from "../dialog/ImportDialog.vue";
import ModelMenu from "./ModelMenu.vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navState = useNavStore();

const modelStore = computed(() => appStore.currentSimulator.stores.modelStore);
const modelDBStore = computed(
  () => appStore.currentSimulator.stores.modelDBStore
);

const models = computed(() => {
  let models: TModel[] = [];

  if (state.source == appStore.currentSimulator.id) {
    models = modelStore.value.state.models;
  } else {
    models = modelDBStore.value.state.models;

    if (state.source === "custom") {
      models = models.filter((model: TModel) => model.custom);
    }
  }

  if (state.search) {
    models = models.filter((model: TModel) =>
      model.label
        .toLocaleLowerCase()
        .includes(state.search ? state.search.toLocaleLowerCase() : "")
    );
  }

  if (state.elementType) {
    models = models.filter(
      (model: TModel) => model.elementType === state.elementType
    );
  }

  if (state.orderByAsc) {
    models = models.sort((a: TModel, b: TModel) =>
      a["id"] < b["id"] ? -1 : a["id"] > b["id"] ? 1 : 0
    );
  } else {
    models = models.sort((a: TModel, b: TModel) =>
      a["id"] > b["id"] ? -1 : a["id"] < b["id"] ? 1 : 0
    );
  }

  return models;
});

const state = reactive({
  elementType: "",
  orderByAsc: true,
  search: "",
  source: "installed",
});

const sources = ["installed", "custom", appStore.currentSimulator.id];
const elementTypes = ["neuron", "recorder", "stimulator", "synapse"];

const menuItems = [
  {
    title: "Import",
    icon: "mdi:mdi-import",
    id: "import-dialog",
    onClick: () => {
      createDialog({
        title: "",
        text: "",
        customComponent: {
          component: ImportDialog,
          props: {},
        },
        dialogOptions: {
          width: "1280px",
        },
      });
    },
  },
  {
    title: "Export",
    icon: "mdi:mdi-export",
    id: "export-dialog",
    onClick: () => {
      createDialog({
        title: "",
        text: "",
        customComponent: {
          component: ExportDialog,
          props: {
            project: false,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
      });
    },
  },
  {
    title: "Delete",
    icon: "mdi:mdi-trash-can-outline",
    id: "delete-dialog",
    onClick: () => {
      createDialog({
        title: "",
        text: "",
        customComponent: {
          component: DeleteDialog,
          props: {
            store: modelDBStore.value,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
      });
    },
  },
];

const dialogNewModel = () => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: DialogTextField,
      props: {
        title: "Create model",
        modelValue: "new model " + modelDBStore.value.state.models.length,
      },
    },
  }).then((modelLabel: boolean | string) => {
    if (modelLabel) {
      let modelId = modelLabel as string;
      const model = modelDBStore.value.newModel({
        id: modelId.replaceAll(" ", "_"),
        label: modelLabel,
      });

      nextTick(() => {
        router.push({
          name: appStore.state.simulator + "ModelEditor",
          params: { modelId: model.id },
        });
      });
    }
  });
};

const dispatchWindowResize = () => {
  nextTick(() => window.dispatchEvent(new Event("resize")));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleMouseMove = (e: MouseEvent) => {
  navState.state.width = e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleMouseUp = () => {
  navState.state.resizing = false;
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize sidebar.
 */
const resizeSidebar = () => {
  navState.state.resizing = true;
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};
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
