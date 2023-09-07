<template>
  <v-toolbar color="transparent" density="compact">
    <v-text-field
      class="mx-1"
      clearable
      density="compact"
      hide-details
      placeholder="Search model"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
    />

    <v-menu>
      <template #activator="{ props }">
        <v-btn icon="mdi-dots-vertical" size="small" v-bind="props" />
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

  <v-list density="compact" lines="two" nav>
    <v-list-item
      :key="index"
      :subtitle="model.elementType"
      :title="model.label"
      :to="{ name: 'norseModel', params: { modelId: model.id } }"
      v-for="(model, index) in modelDBStore.models"
    >
      <template #append>
        <v-btn
          @click="(e: MouseEvent) => e.preventDefault()"
          class="list-item-menu"
          icon="mdi-dots-vertical"
          size="x-small"
          variant="text"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { useNorseModelDBStore } from "@norse/store/model/norseModelDBStore";
const modelDBStore = useNorseModelDBStore();

const menuItems = [
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Reload", icon: "mdi-reload" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
];
</script>
