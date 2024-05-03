<template>
  <v-navigation-drawer class="d-print-none" permanent rail>
    <v-tabs
      :model-value="navStore.state.view"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        :key="index"
        :ripple="false"
        :title="item.title"
        :to="item.to"
        @click.stop="navStore.toggle(item)"
        class="justify-center"
        height="72"
        min-width="0"
        v-for="(item, index) in navItems"
        v-show="item.simulator === appStore.state.simulator"
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
          @click.stop="item.onClick ? item.onClick() : undefined"
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

// import { useTheme } from "vuetify";
// const theme = useTheme();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const props = defineProps(["navItems"]);
const navItems = computed(() => props.navItems);

// const toggleDevMode = () => {
//   appStore.devMode = !appStore.devMode;
// };

const items: {
  color?: string;
  href?: string;
  icon: string;
  id: string;
  onClick?: () => void;
  title: string;
  to?: string;
}[] = [
  // {
  //   icon: "mdi:mdi-google-downasaur",
  //   id: "webgl",
  //   onClick: toggleWebGL,
  //   title: `Toggle webGL (${appStore.webGL ? "on" : "off"})`,
  //   color: appStore.webGL ? "green" : "red",
  // },
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
];
</script>
