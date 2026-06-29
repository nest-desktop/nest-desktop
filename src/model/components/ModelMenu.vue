<template>
  <Menu :items size="x-small" />
</template>

<script setup lang="ts">
import { toRef } from "vue";

import type { TModel } from "@/types";
import { confirmDialog } from "@/core";

import { Menu } from "@/components";

import { getCurrentDBStore, useAppStore } from "@/app";
const appStore = useAppStore();

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const props = defineProps<{ model: TModel }>();
const model = toRef(props, "model");

const modelDBStore = getCurrentDBStore("model");

const items = [
  {
    onClick: () => {
      modelDBStore.saveModel(model.value);
    },
    prependIcon: "mdi:mdi-content-save-outline",
    title: "Save",
  },
  {
    onClick: () => {
      const newModel = modelDBStore.duplicateModel(model.value);
      if (!route.path.endsWith(newModel.id)) {
        router.push({
          name: appStore.state.currentWorkspace + "ModelEditor",
          params: { modelId: newModel.id },
        });
      }
    },
    prependIcon: "mdi:mdi-content-duplicate",
    title: "Duplicate",
  },
  {
    onClick: () => modelDBStore.exportModel(model.value),
    prependIcon: "mdi:mdi-download",
    title: "Download",
  },
  {
    onClick: () =>
      confirmDialog({
        text: "Are you sure to delete model?",
        title: "Delete model",
      }).then((answer: boolean) => {
        if (answer) modelDBStore.deleteModel(model.value);
      }),
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete",
  },
];
</script>
