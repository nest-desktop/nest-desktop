// appStore.ts

import { ThemeInstance } from "vuetify";
import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import { simulators } from "@/simulators";

export const useAppStore = defineStore(
  "app-store",
  () => {
    let themeInstance: ThemeInstance;

    const state = reactive({
      autoUpdate: false,
      devMode: false,
      filterTag: "",
      loading: false,
      logsOpen: false,
      requestLogs: [] as { date: string; text: string; type: string }[],
      simulator: "nest",
      simulatorVisible: ["nest"],
      theme: "auto", // auto, light, dark
      themeIcon: "mdi:mdi-system",
      webGL: true,
    });

    const clearLogs = () => {
      state.requestLogs = [];
    };

    const currentSimulator = computed(() => simulators[state.simulator]);

    const darkMode = computed((): boolean => {
      const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      return state.theme === "auto"
        ? darkThemeQuery.matches
        : state.theme === "dark";
    });

    const hasSimulator = computed((): boolean => {
      const simulatorIds = Object.keys(simulators);
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
      state.simulator = Object.keys(simulators)[0];
    };

    const simulatorItems = computed(() =>
      state.simulatorVisible.map(
        (simulatorId: string) => simulators[simulatorId]
      )
    );

    const toggleTheme = (): void => {
      const themes = ["light", "dark", "auto"];
      state.theme = themes[(themes.indexOf(state.theme) + 1) % 3];
      updateTheme();
    };

    const updateTheme = (): void => {
      if (themeInstance == null) return;

      state.themeIcon =
        state.theme === "auto"
          ? "mdi:mdi-desktop-tower-monitor"
          : "mdi:mdi-theme-light-dark";

      const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const themeValue =
        state.theme === "auto"
          ? darkThemeQuery.matches
            ? "dark"
            : "light"
          : state.theme;

      if (themeInstance.global) {
        themeInstance.global.name.value = themeValue;
        // @ts-ignore - Property 'window' does not exist on type 'ThemeInstance'.
      } else if (themeInstance.window) {
        // @ts-ignore - Property 'window' does not exist on type 'ThemeInstance'.
        themeInstance.window.name.value = themeValue;
      }

      window.dispatchEvent(new Event("relayout"));
    };

    return {
      clearLogs,
      currentSimulator,
      darkMode,
      hasSimulator,
      init,
      resetSimulator,
      simulatorItems,
      state,
      toggleTheme,
      updateTheme,
    };
  },
  {
    persist: [
      {
        paths: [
          "state.autoUpdate",
          "state.theme",
          "state.themeIcon",
          "state.simulator",
          "state.simulatorVisible",
        ],
        storage: localStorage,
      },
      {
        paths: ["state.devMode", "state.webGL"],
        storage: sessionStorage,
      },
    ],
  }
);
