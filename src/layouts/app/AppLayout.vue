<template>
  <v-app>
    <v-system-bar flat color="systembar">
      <app-bar />
    </v-system-bar>

    <v-navigation-drawer permanent rail rail-width="64">
      <app-navigation />

      <template #append>
        <v-row align="center" class="my-1" justify="center" no-gutters>
          <v-btn
            :href="item.href"
            :icon="item.text ? false : item.icon"
            :key="index"
            :prepend-icon="item.text ? item.icon : undefined"
            :size="item.text ? 'x-small' : 'small'"
            :stacked="'text' in item"
            :target="item.href ? '_blank' : ''"
            :text="item.text"
            :title="item.title"
            :to="item.to"
            @click.stop="item.click ? item.click() : undefined"
            rounded="1"
            v-for="(item, index) in items"
            variant="plain"
          />
        </v-row>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();

import AppBar from "./AppBar.vue";
import AppNavigation from "./AppNavigation.vue";

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  appStore.darkMode = theme.global.current.value.dark;

  window.dispatchEvent(new Event("darkmode"));
};

const items = [
  {
    click: toggleTheme,
    icon: "mdi-theme-light-dark",
    id: "theme-light-dark",
    title: "Toggle dark mode",
  },
  {
    icon: "mdi-slide",
    id: "sandbox",
    title: "sandbox",
    to: "/sandbox/",
  },
  // {
  //   icon: "mdi-cogs",
  //   id: "settings",
  //   text: "settings",
  //   title: "settings",
  //   to: "/settings",
  // },
  {
    href: "https://nest-desktop.readthedocs.io",
    icon: "mdi-help-circle-outline",
    id: "help",
    text: "help",
    title: "help",
  },
  {
    icon: "mdi-information-variant",
    id: "about",
    text: "about",
    title: "about",
    to: "/about",
  },
];
</script>
