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
      extension-height="28"
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

        <v-row class="mx-4 text-subtitle-2" no-gutters>
          <v-spacer />
          {{ models.length }} models
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

    <!-- <v-virtual-scroll :items="models">
      <template #default="{ item }">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            :subtitle="item.elementType"
            :title="item.label"
            :to="{
              name: appStore.state.simulator + 'Model',
              params: { modelId: item.id },
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

                <ModelMenu :model="item" :modelDBStore />
              </v-btn>
            </template>
          </v-list-item>
        </v-hover>
      </template>
    </v-virtual-scroll> -->

    <v-list class="pt-0" density="compact" lines="two" nav>
      <v-list-subheader class="pa-0" inset style="margin-left: -24px">
        <v-btn-toggle density="compact" tile v-model="state.elementType">
          <v-btn
            :key="elementType"
            size="x-small"
            style="font-size: 9px"
            :value="elementType"
            v-for="elementType in elementTypes"
          >
            {{ elementType }}
          </v-btn>
        </v-btn-toggle>
      </v-list-subheader>

      <template v-for="(model, index) in models">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            :key="index"
            :subtitle="model.elementType"
            :title="model.label"
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

                <ModelMenu :model :modelDBStore />
              </v-btn>
            </template>
          </v-list-item>
        </v-hover>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import DialogTextField from "@/components/dialog/DialogTextField.vue";
import ModelMenu from "./ModelMenu.vue";
import { TModel } from "@/types";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";

import { useRouter } from "vue-router";
const router = useRouter();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navState = useNavStore();

const props = defineProps<{ modelDBStore: TModelDBStore }>();
const models = computed(() => {
  let models = props.modelDBStore.state.models;

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

  models = models.sort((a: any, b: any) =>
    a["id"] < b["id"] ? -1 : a["id"] > b["id"] ? 1 : 0
  );
  return models;
});

const state = reactive({
  elementType: "",
  search: "",
});

const elementTypes = ["neuron", "recorder", "stimulator", "synapse"];

const menuItems = [
  { title: "Upload", icon: "mdi:mdi-upload" },
  { title: "Download", icon: "mdi:mdi-download" },
  { title: "Reload", icon: "mdi:mdi-reload" },
  { title: "Delete", icon: "mdi:mdi-trash-can-outline" },
];

const dialogNewModel = () => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: DialogTextField,
      props: {
        title: "Create model",
        modelValue: "new model " + props.modelDBStore.state.models.length,
      },
    },
  }).then((modelLabel: boolean | string) => {
    if (modelLabel) {
      let modelId = modelLabel as string;
      const model = props.modelDBStore.newModel({
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
