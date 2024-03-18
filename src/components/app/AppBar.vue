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
        :key="index"
        :value="item.id"
        :to="'/' + item.id"
        v-for="(item, index) in appStore.simulatorItems"
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
        append-icon="mdi-menu-down"
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
          <v-icon icon="mdi-cogs" size="small" />
        </template>
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-btn :to="{ name: 'about' }" size="x-small" variant="text"> about </v-btn>

  <v-btn
    class="mx-1px"
    href="https://nest-desktop.readthedocs.io"
    size="x-small"
    target="_blank"
    variant="text"
    append-icon="mdi-open-in-new"
  >
    help
  </v-btn>

  <v-divider class="mx-1" vertical />

  <v-btn
    @click="appStore.toggleTheme()"
    size="x-small"
    :icon="appStore.state.themeIcon"
    variant="text"
    title="Toggle theme"
  />

  <v-spacer />

  <v-divider class="mx-1" vertical />

  <v-btn
    :disabled="!backend.isEnabled"
    :key="index"
    :title="backend.URL"
    @click="() => backend.check()"
    size="x-small"
    v-for="(backend, index) in appStore.currentSimulator.backends"
    variant="text"
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
      icon="mdi-circle"
    />
  </v-btn>
</template>

<script lang="ts" setup>
// import { DatabaseService } from "@/helpers/common/database";
import { onMounted } from "vue";
import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();

const settingsItems = [
  {
    icon: "mdi-cog-refresh-outline",
    id: "clearConfig",
    onClick: () => localStorage.clear(),
    title: "Clear config",
  },
  // {
  //   icon: "mdi-database-refresh-outline",
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

onMounted(() => {
  Object.values(appStore.currentSimulator.backends).forEach((backend: any) =>
    backend.check()
  );
});
</script>

<style lang="scss">
.mx-1px {
  margin-left: 1px;
  margin-right: 1px;
}
</style>
