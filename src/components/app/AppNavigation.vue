<template>
  <v-navigation-drawer class="d-print-none" permanent rail>
    <v-tabs :mandatory="false" :model-value="navStore.state.view" color="primary" direction="vertical" stacked>
      <v-tab
        v-for="(item, index) in navItems"
        v-show="item.workspace === appStore.state.currentWorkspace"
        :key="index"
        :ripple="false"
        class="justify-center"
        height="76"
        min-width="0"
        v-bind="item"
        @click.stop="navStore.toggle(item)"
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px">{{ item.title }}</span>
      </v-tab>
    </v-tabs>

    <!-- <v-list
      :model-value="navStore.state.view"
      class="px-0 text-center"
      color="primary"
      density="compact"
    >
      <v-list-item
        :key="index"
        :to="item.to"
        :value="item.id"
        @click.stop="navStore.toggle(item)"
        class="py-3 my-0 justify-center"
        v-for="(item, index) in navItems"
        v-show="item.workspace === appStore.state.currentWorkspace"
      >
        <v-icon :icon="item.icon" size="large" />
        <span class="text-button" style="font-size: 9px !important">
          {{ item.title }}
        </span>
      </v-list-item>
    </v-list> -->

    <!-- <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :color="item.color"
          :icon="item.icon"
          :key="index"
          :title="item.title"
          @click.stop="item.onClick ? item.onClick() : undefined"
          size="small"
          v-for="(item, index) in items"
          variant="plain"
        />
      </v-row>
    </template> -->
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
// import { useTheme } from "vuetify";
// const theme = useTheme();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

defineProps<{
  navItems: {
    id: string;
    icon: string;
    workspace: string;
    title: string;
    to: { name: string };
  }[];
}>();

// const toggleDevMode = () => {
//   appStore.devMode = !appStore.devMode;
// };

// const items: {
//   color?: string;
//   href?: string;
//   icon: string;
//   id: string;
//   onClick?: () => void;
//   title: string;
//   to?: string;
// }[] = [
// {
//   icon: "mdi:mdi-slide",
//   id: "sandbox",
//   title: "sandbox",
//   to: "/sandbox/",
// },
// {
//   color: appStore.devMode ? "green" : "red",
//   icon: "mdi:mdi-developer-board",
//   onClick: toggleDevMode,
//   id: "theme-light-dark",
//   title: "Toggle dev mode",
// },
// {
//   icon: "mdi:mdi-theme-light-dark",
//   id: "theme-light-dark",
//   onClick: () => appStore.toggleDarkMode(theme),
//   title: "Toggle dark mode",
// },
// {
//   icon: "mdi:mdi-cogs",
//   id: "settings",
//   text: "settings",
//   title: "settings",
//   to: "/settings",
// },
// {
//   href: "https://nest-desktop.readthedocs.io",
//   icon: "mdi:mdi-help-circle-outline",
//   id: "help",
//   text: "help",
//   title: "help",
// },
// {
//   icon: "mdi:mdi-information-variant",
//   id: "about",
//   text: "about",
//   title: "about",
//   to: "/about",
// },
// ];
</script>
