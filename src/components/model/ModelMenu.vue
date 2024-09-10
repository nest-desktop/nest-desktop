<template>
  <v-menu activator="parent">
    <v-list density="compact">
      <v-list-item
        :key="index"
        v-bind="item"
        v-for="(item, index) in menuItems"
      />
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { confirmDialog } from "vuetify3-dialog";

import { TModel } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  model: TModel;
}>();

const model = computed(() => props.model);
const modelDBStore = computed(
  () => appStore.currentSimulator.stores.modelDBStore
);

const menuItems = [
  {
    onClick: () => {
      modelDBStore.value.saveModel(model.value);
    },
    prependIicon: "mdi:mdi-content-save-outline",
    title: "Save",
  },
  {
    onClick: () => {
      const newModel = modelDBStore.value.duplicateModel(model.value);
      if (!route.path.endsWith(newModel.id)) {
        router.push({
          name: appStore.state.simulator + "ModelEditor",
          params: { modelId: newModel.id },
        });
      }
    },
    prependIcon: "mdi:mdi-content-duplicate",
    title: "Duplicate",
  },
  {
    onClick: () => modelDBStore.value.exportModel(model.value),
    prependIcon: "mdi:mdi-download",
    title: "Download",
  },
  {
    onClick: () =>
      confirmDialog({
        text: "Are you sure to delete it?",
        title: "Delete model",
      }).then((answer: boolean) => {
        if (answer) {
          modelDBStore.value.deleteModel(model.value);
        }
      }),
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete",
  },
];
</script>
