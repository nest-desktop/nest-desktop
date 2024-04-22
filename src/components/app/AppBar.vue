<template>
  <v-btn
    class="mx-2"
    color="systembar"
    flat
    icon="mdi:mdi-home"
    size="x-small"
    to="/"
  />

  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi:mdi-menu-down"
        class="mx-1px"
        size="x-small"
        v-bind="props"
        variant="text"
      >
        <template #prepend>
          <v-icon
            :color="appStore.currentSimulator.id"
            :icon="appStore.currentSimulator.id + ':logo'"
            style="background-color: white; border-radius: 4px; opacity: 1"
            size="large"
          />
        </template>
        {{ appStore.currentSimulator.title }}
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="(item, index) in appStore.simulatorItems"
        :key="index"
        :value="item.id"
        :to="'/' + item.id"
      >
        <template #prepend>
          <v-icon :color="item.id" :icon="item.id + ':logo'" size="small" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi:mdi-menu-down"
        class="mx-1px"
        size="x-small"
        v-bind="props"
        variant="text"
      >
        settings
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="(item, index) in settingsItems"
        :key="index"
        :value="item.id"
        @click="item.onClick"
      >
        <template #prepend>
          <v-icon :icon="item.icon" size="small" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <v-list-item :to="{ name: 'settings' }">
        <template #prepend>
          <v-icon icon="mdi:mdi-cogs" size="small" />
        </template>
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-btn :to="{ name: 'about' }" size="x-small" variant="text">about</v-btn>

  <v-btn
    class="mx-1px"
    href="https://nest-desktop.readthedocs.io"
    size="x-small"
    target="_blank"
    variant="text"
    append-icon="mdi:mdi-open-in-new"
  >
    help
  </v-btn>

  <v-divider class="mx-1" vertical />

  <v-btn
    size="x-small"
    :icon="appStore.state.themeIcon"
    variant="text"
    title="Toggle theme"
    @click="appStore.toggleTheme()"
  />

  <v-spacer />

  <v-divider class="mx-1" vertical />

  <v-btn
    v-for="(backend, index) in appStore.currentSimulator.backends"
    :key="index"
    :disabled="!backend.isEnabled"
    :title="backend.URL"
    size="x-small"
    variant="text"
    @click="backend.check()"
  >
    {{ backend.state.name }}
    <v-icon
      :color="
        backend.isEnabled
          ? backend.isOK && backend.isValid
            ? 'green'
            : 'red'
          : ''
      "
      class="mx-1"
      icon="mdi:mdi-circle"
    />
  </v-btn>

  <v-divider class="mx-1" vertical />

  <v-btn
    icon="mdi:mdi-menu-open"
    size="x-small"
    variant="text"
    title="Open request logs"
    @click="appSessionStore.state.logsOpen = !appSessionStore.state.logsOpen"
  />
</template>

<script lang="ts" setup>
// import { DatabaseService } from "@/helpers/common/database";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useAppSessionStore } from "@/stores/appSessionStore";
const appSessionStore = useAppSessionStore();

const settingsItems = [
  {
    icon: "mdi:mdi-cog-refresh-outline",
    id: "clearConfig",
    onClick: () => localStorage.clear(),
    title: "Clear config",
  },
  // {
  //   icon: "mdi:mdi-database-refresh-outline",
  //   id: "destroyDatabase",
  //   title: `Destroy ${appStore.currentSimulator.id} database`,
  //   onClick: () => {
  //     appStore.currentSimulator.databases.forEach((url) => {
  //       const db = new DatabaseService(url);
  //       db.destroy();
  //     });
  //   },
  // },
];
</script>

<style lang="scss">
.mx-1px {
  margin-left: 1px;
  margin-right: 1px;
}
</style>
