<template>
  <v-menu activator="parent">
    <v-list density="compact">
      <v-list-item
        :key="index"
        :value="index"
        @click="item.onClick"
        v-for="(item, index) in menuItems"
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TModel } from "@/types";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useRouter, useRoute } from "vue-router";
import { confirmDialog } from "vuetify3-dialog";
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  model: TModel;
  modelDBStore: TModelDBStore;
}>();

const model = computed(() => props.model);
const modelDBStore = computed(() => props.modelDBStore);

const menuItems = [
  {
    icon: "mdi:mdi-content-save-outline",
    onClick: () => {
      modelDBStore.value.saveModel(model.value);
    },
    title: "Save",
  },
  {
    icon: "mdi:mdi-content-duplicate",
    id: "modelDuplicate",
    onClick: () => {
      const newModel = modelDBStore.value.duplicateModel(model.value);
      if (!route.path.endsWith(newModel.id)) {
        router.push({
          name: appStore.state.simulator + "ModelEditor",
          params: { modelId: newModel.id },
        });
      }
    },
    title: "Duplicate",
  },
  {
    icon: "mdi:mdi-download",
    onClick: () => modelDBStore.value.exportModel(model.value),
    title: "Download",
  },
  {
    icon: "mdi:mdi-trash-can-outline",
    onClick: () =>
      confirmDialog({
        text: "Are you sure to delete it?",
        title: "Delete model",
      }).then((answer: boolean) => {
        if (answer) {
          modelDBStore.value.deleteModel(model.value);
        }
      }),
    title: "Delete",
  },
];
</script>
