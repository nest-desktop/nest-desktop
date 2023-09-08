<template>
  <v-navigation-drawer class="d-print-none" permanent rail rail-width="64">
    <v-tabs
      :model-value="navStore.view"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
      width="64"
    >
      <v-tab
        :key="index"
        :ripple="false"
        :title="item.title"
        :to="item.to"
        @click.stop="navStore.toggle(item)"
        class="justify-center"
        height="72"
        minWidth="0"
        v-for="(item, index) in navItems"
        v-show="item.simulator === appStore.simulator"
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px">{{ item.title }}</span>
      </v-tab>
    </v-tabs>

    <template #append>
      <v-row align="center" class="my-1" justify="center" no-gutters>
        <v-btn
          :color="item.color"
          :icon="item.icon"
          :key="index"
          :title="item.title"
          @click.stop="item.click ? item.click() : undefined"
          size="small"
          v-for="(item, index) in items"
          variant="plain"
        />
      </v-row>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

const appStore = useAppStore();
const navStore = useNavStore();

const props = defineProps(["navItems"]);
const navItems = computed(() => props.navItems);

const toggleDarkMode = () => {
  appStore.darkMode = !theme.global.current.value.dark;
  theme.global.name.value = appStore.darkMode ? "dark" : "light";
  window.dispatchEvent(new Event("darkmode"));
};

const toggleDevMode = () => {
  appStore.session.devMode = !appStore.session.devMode;
};

// const toggleWebGL = () => {
//   appStore.webGL = !appStore.webGL;
//   console.log(appStore.webGL);
// };

const items: {
  click: any;
  color?: string;
  icon: string;
  id: string;
  title: string;
}[] = [
  // {
  //   click: toggleWebGL,
  //   icon: "mdi-google-downasaur",
  //   id: "webgl",
  //   title: `Toggle webGL (${appStore.webGL ? "on" : "off"})`,
  //   color: appStore.webGL ? "green" : "red",
  // },
  // {
  //   icon: "mdi-slide",
  //   id: "sandbox",
  //   title: "sandbox",
  //   to: "/sandbox/",
  // },
  {
    click: toggleDevMode,
    color: appStore.session.devMode ? "green" : "red",
    icon: "mdi-developer-board",
    id: "theme-light-dark",
    title: "Toggle dev mode",
  },
  {
    click: toggleDarkMode,
    icon: "mdi-theme-light-dark",
    id: "theme-light-dark",
    title: "Toggle dark mode",
  },
  // {
  //   icon: "mdi-cogs",
  //   id: "settings",
  //   text: "settings",
  //   title: "settings",
  //   to: "/settings",
  // },
  // {
  //   href: "https://nest-desktop.readthedocs.io",
  //   icon: "mdi-help-circle-outline",
  //   id: "help",
  //   text: "help",
  //   title: "help",
  // },
  // {
  //   icon: "mdi-information-variant",
  //   id: "about",
  //   text: "about",
  //   title: "about",
  //   to: "/about",
  // },
];
</script>
