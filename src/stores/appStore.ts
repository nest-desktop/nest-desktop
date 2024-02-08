// appStore.ts

import { defineStore } from "pinia";
import { ThemeInstance } from "vuetify";

import { useAppSessionStore } from "./appSessionStore";
import { simulatorItems } from "@/simulators";
import { computed, reactive } from "vue";

export const useAppStore = defineStore(
  "app-store",
  () => {
    let themeInstance: ThemeInstance;

    const state = reactive({
      themeInstance: undefined,
      autoUpdate: false,
      theme: "auto",      // auto, light, dark
      simulator: "nest",
      simulatorVisible: ["nest"],
    });

    const session = useAppSessionStore();

    const currentSimulator = computed(() => simulatorItems[state.simulator]);

    const darkMode = computed((): boolean => {
      const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      return state.theme === "auto"
        ? darkThemeQuery.matches
        : state.theme === "dark";
    });

    const hasSimulator = computed((): boolean => {
      const simulatorIds = Object.keys(simulatorItems);
      return simulatorIds.includes(state.simulator);
    });

    const init = (theme: ThemeInstance) => {
      themeInstance = theme;

      const colorSchemeQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      colorSchemeQuery.addEventListener("change", updateTheme);

      updateTheme();
    };

    const resetSimulator = (): void => {
      state.simulator = Object.keys(simulatorItems)[0];
    };

    const updateTheme = (): void => {
      if (themeInstance == null) return;

      const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const themeValue =
        state.theme === "auto"
          ? darkThemeQuery.matches
            ? "dark"
            : "light"
          : state.theme;

      if (themeInstance.global) {
        themeInstance.global.name.value = themeValue;
        // @ts-ignore
      } else if (theme.window) {
        // @ts-ignore
        themeInstance.window.name.value = themeValue;
      }
    };

    return {
      currentSimulator,
      darkMode,
      hasSimulator,
      init,
      resetSimulator,
      session,
      state,
      updateTheme,
    };
  },
  {
    persist: true,
  }
);
