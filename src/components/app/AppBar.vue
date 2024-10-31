<template>
  <v-btn
    class="mx-2"
    flat
    icon="mdi:mdi-home"
    size="x-small"
    to="/"
    variant="text"
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
        :key="index"
        :prepend-icon="item.id + ':logo'"
        :to="'/' + item.id"
        :title="item.title"
        :value="item.id"
        v-for="(item, index) in appStore.simulatorItems"
      />
    </v-list>
  </v-menu>

  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi:mdi-menu-down"
        class="mx-1px"
        size="x-small"
        text="settings"
        v-bind="props"
        variant="text"
      />
    </template>

    <v-list density="compact">
      <v-list-item
        :key="index"
        @click="item.onClick"
        v-bind="item"
        v-for="(item, index) in settingsItems"
      />

      <v-list-item :to="{ name: 'settings' }">
        <template #prepend>
          <v-icon icon="mdi:mdi-cogs" size="small" />
        </template>
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-btn :to="{ name: 'about' }" size="x-small" text="about" variant="text" />

  <v-btn
    append-icon="mdi:mdi-open-in-new"
    class="mx-1px"
    href="https://nest-desktop.readthedocs.io"
    size="x-small"
    target="_blank"
    text="help"
    variant="text"
  />

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
    @click="backend.update()"
    size="x-small"
    v-for="(backend, index) in appStore.currentSimulator.backends"
    variant="text"
  >
    {{ backend.state.name }}
    <BackendStatusIcon :backendStore="backend" size="small" />
  </v-btn>

  <v-divider class="mx-1" vertical />

  <v-btn
    @click="appStore.state.logsOpen = !appStore.state.logsOpen"
    icon="mdi:mdi-menu-open"
    size="x-small"
    title="View request logs"
    variant="text"
  />
</template>

<script lang="ts" setup>
// import { DatabaseService } from "@/helpers/common/database";
import BackendStatusIcon from "../iconsets/BackendStatusIcon.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const settingsItems = [
  {
    prependIcon: "mdi:mdi-cog-refresh-outline",
    onClick: () => localStorage.clear(),
    title: "Clear config",
    value: "clearConfig",
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
