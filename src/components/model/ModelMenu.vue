<template>
  <Menu
    :items
    size="x-small"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Menu from "../common/Menu.vue";
import { TModel } from "@/types";
import { confirmDialog } from "@/helpers/common/confirmDialog";

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

const items = [
  {
    onClick: () => {
      modelDBStore.value.saveModel(model.value);
    },
    prependIcon: "mdi:mdi-content-save-outline",
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
        text: "Are you sure to delete model?",
        title: "Delete model",
      }).then((answer: boolean) => {
        if (answer) modelDBStore.value.deleteModel(model.value);
      }),
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete",
  },
];
</script>
