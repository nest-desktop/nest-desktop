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
            size="large"
            style="background-color: white; border-radius: 4px; opacity: 1"
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
    append-icon="mdi:mdi-open-in-new"
    class="mx-1px"
    href="https://nest-desktop.readthedocs.io"
    size="x-small"
    target="_blank"
    variant="text"
  >
    help
  </v-btn>

  <v-divider class="mx-1" vertical />

  <v-btn
    :icon="appStore.state.themeIcon"
    @click="appStore.toggleTheme()"
    size="x-small"
    title="Toggle theme"
    variant="text"
  />

  <v-spacer />

  <v-divider class="mx-1" vertical />

  <v-btn
    :disabled="!backend.state.enabled"
    :key="index"
    :title="backend.state.url"
    @click="backend.check()"
    size="x-small"
    v-for="(backend, index) in appStore.currentSimulator.backends"
    variant="text"
  >
    {{ backend.state.name }}
    <v-icon
      :color="
        backend.state.enabled
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
    @click="appStore.state.logsOpen = !appStore.state.logsOpen"
    icon="mdi:mdi-menu-open"
    size="x-small"
    title="Open request logs"
    variant="text"
  />
</template>

<script lang="ts" setup>
// import { DatabaseService } from "@/helpers/common/database";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

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
