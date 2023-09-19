<template>
  <v-btn
    class="mx-2"
    color="systembar"
    flat
    icon="mdi-home"
    size="x-small"
    to="/"
  />

  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi-menu-down"
        rounded="0"
        size="small"
        v-bind="props"
        variant="text"
      >
        <template #prepend>
          <v-icon
            :color="appStore.currentSimulator.color"
            :icon="appStore.currentSimulator.icon"
            style="background-color: white; border-radius: 4px; opacity: 1"
            size="large"
          />
        </template>
        {{ appStore.currentSimulator.title }}
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        :key="index"
        :value="item.id"
        :to="'/' + item.id"
        v-for="(item, index) in simulatorItems"
      >
        <template #prepend>
          <v-icon :color="item.color" :icon="item.icon" size="small" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi-menu-down"
        rounded="0"
        size="small"
        v-bind="props"
        variant="text"
      >
        settings
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        :key="index"
        :value="item.id"
        @click="item.onClick"
        v-for="(item, index) in settingsItems"
      >
        <template #prepend>
          <v-icon :icon="item.icon" size="small" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-btn :to="{ name: 'about' }" rounded="0" size="small" variant="text">
    about
  </v-btn>
  <v-btn
    href="https://nest-desktop.readthedocs.io"
    rounded="0"
    size="small"
    target="_blank"
    variant="text"
    append-icon="mdi-open-in-new"
  >
    help
  </v-btn>

  <v-spacer />

  <v-btn
    :disabled="!backend.enabled"
    :key="index"
    size="x-small"
    v-for="(backend, index) in appStore.currentSimulator.backends"
    variant="text"
  >
    {{ backend.name }}
    <v-icon
      :color="
        backend.enabled ? (backend.session.isValid ? 'green' : 'red') : ''
      "
      class="mx-1"
      icon="mdi-circle"
    />
  </v-btn>
</template>

<script lang="ts" setup>
import { DatabaseService } from "@/helpers/common/database";
import { simulatorItems } from "@/simulators";
import { useAppStore } from "@/store/appStore";

const appStore = useAppStore();

const settingsItems = [
  {
    icon: "mdi-cog-refresh-outline",
    id: "clearConfig",
    title: "Clear config",
    onClick: () => localStorage.clear(),
  },
  {
    icon: "mdi-database-refresh-outline",
    id: "destroyDatabase",
    title: "Destroy database",
    onClick: () => {
      appStore.currentSimulator.databases.forEach((url) => {
        const db = new DatabaseService(url);
        db.destroy();
      });
    },
  },
];
</script>
