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
        v-for="(item, index) in appStore.simulatorItems"
        :key="index"
        :prepend-icon="item.id + ':logo'"
        :title="item.title"
        :to="'/' + item.id"
        :value="item.id"
      />
    </v-list>
  </v-menu>

  <v-btn
    size="x-small"
    text="about"
    variant="text"
    @click="openAboutDialog()"
  />

  <v-btn
    append-icon="mdi:mdi-open-in-new"
    class="mx-1px"
    href="https://nest-desktop.readthedocs.io"
    size="x-small"
    target="_blank"
    text="help"
    variant="text"
  />

  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi:mdi-menu-down"
        class="mx-1px"
        size="x-small"
        text="more"
        v-bind="props"
        variant="text"
      />
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="(item, index) in settingsItems"
        v-bind="item"
        :key="index"
        @click="item.onClick"
      />
    </v-list>
  </v-menu>

  <v-divider
    class="mx-1"
    vertical
  />

  <v-btn
    :icon="appStore.state.themeIcon"
    size="x-small"
    title="Toggle theme"
    variant="text"
    @click="appStore.toggleTheme()"
  />

  <v-spacer />

  <v-divider
    class="mx-1"
    vertical
  />

  <v-btn
    v-for="(backend, index) in appStore.currentSimulator.backends"
    :key="index"
    :disabled="!backend.state.enabled"
    :title="backend.state.url"
    size="x-small"
    variant="text"
    @click="backend.update()"
  >
    {{ backend.state.name }}
    <BackendStatusIcon
      :backend-store="backend"
      size="small"
    />
  </v-btn>

  <v-divider
    class="mx-1"
    vertical
  />

  <v-btn
    icon="mdi:mdi-menu-open"
    size="x-small"
    title="View request logs"
    variant="text"
    @click="appStore.state.logsOpen = !appStore.state.logsOpen"
  />
</template>

<script lang="ts" setup>
import { createDialog } from "vuetify3-dialog";

import AboutDialog from "../dialog/AboutDialog.vue";
import BackendStatusIcon from "../iconsets/BackendStatusIcon.vue";
import SettingsDialog from "../dialog/SettingsDialog.vue";
import StoresDialog from "../dialog/StoresDialog.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const settingsItems = [
  {
    prependIcon: "mdi:mdi-cogs",
    onClick: () => createDialog({
      customComponent: {
        component: SettingsDialog,
        props: false
      },
      dialogOptions: {
        width: "400px",
      },
      text: "",
      title: "",
    }),
    title: "Settings",
  },
  {
    prependIcon: "mdi:mdi-database",
    onClick: () => createDialog({
      customComponent: {
        component: StoresDialog,
        props: false
      },
      dialogOptions: {
        width: "400px",
      },
      text: "",
      title: "",
    }),
    title: "Stores",
  }
];

const openAboutDialog = () =>
  createDialog({
    customComponent: {component: AboutDialog, props: false},
    dialogOptions: {
      scrollable: true,
      width: "800px",
      // height: "800px"
    },
    title: "",
    text: "",
})
</script>

<style lang="scss">
.mx-1px {
  margin-left: 1px;
  margin-right: 1px;
}
</style>
