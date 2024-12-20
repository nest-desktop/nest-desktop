// appStore.ts

import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { ThemeInstance } from "vuetify";

import { workspaces } from "@/workspaces";

export const useAppStore = defineStore(
  "app-store",
  () => {
    let themeInstance: ThemeInstance;

    const state = reactive<{
      autoUpdate: boolean;
      currentWorkspace: string;
      devMode: boolean;
      filterTag: string;
      initialized: boolean;
      loading: boolean;
      loadingText: string;
      logsOpen: boolean;
      requestLogs: { date: string; htmlContent: string; level: string }[];
      workspacesEnabled: string[];
      theme: string;
      themeIcon: string;
    }>({
      autoUpdate: false,
      currentWorkspace: "nest",
      devMode: false,
      filterTag: "",
      initialized: false,
      loading: false,
      loadingText: "Loading... Please wait",
      logsOpen: false,
      requestLogs: [] as { date: string; htmlContent: string; level: string }[],
      workspacesEnabled: ["nest"],
      theme: "auto", // auto, light, dark
      themeIcon: "mdi:mdi-system",
    });

    const clearLogs = () => {
      state.requestLogs = [];
    };

    const currentWorkspace = computed(() => workspaces[state.currentWorkspace]);

    const darkMode = computed((): boolean => {
      const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      return state.theme === "auto" ? darkThemeQuery.matches : state.theme === "dark";
    });

    const hasWorkspace = computed((): boolean => {
      const workspaceIds = Object.keys(workspaces);
      return workspaceIds.includes(state.currentWorkspace);
    });

    const init = (theme: ThemeInstance) => {
      themeInstance = theme;

      const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      colorSchemeQuery.addEventListener("change", updateTheme);

      updateTheme();
    };

    const resetWorkspace = (): void => {
      state.currentWorkspace = Object.keys(workspaces)[0];
    };

    const workspaceItems = computed(() =>
      state.workspacesEnabled.map((workspaceId: string) => workspaces[workspaceId]),
    );

    const toggleTheme = (): void => {
      const themes = ["light", "dark", "auto"];
      state.theme = themes[(themes.indexOf(state.theme) + 1) % 3];
      updateTheme();
    };

    const updateTheme = (): void => {
      if (themeInstance == null) return;

      state.themeIcon = state.theme === "auto" ? "mdi:mdi-desktop-tower-monitor" : "mdi:mdi-theme-light-dark";

      const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const themeValue = state.theme === "auto" ? (darkThemeQuery.matches ? "dark" : "light") : state.theme;

      if (themeInstance.global) {
        themeInstance.global.name.value = themeValue;
        // @ts-expect-error Property 'window' does not exist on type 'ThemeInstance'.
      } else if (themeInstance.window) {
        // @ts-expect-error Property 'window' does not exist on type 'ThemeInstance'.
        themeInstance.window.name.value = themeValue;
      }

      window.dispatchEvent(new Event("relayout"));
    };

    return {
      clearLogs,
      currentWorkspace,
      darkMode,
      hasWorkspace,
      init,
      resetWorkspace,
      workspaceItems,
      state,
      toggleTheme,
      updateTheme,
    };
  },
  {
    persist: [
      {
        pick: [
          "state.autoUpdate",
          "state.theme",
          "state.themeIcon",
          "state.currentWorkspace",
          "state.workspacesEnabled",
        ],
        storage: localStorage,
      },
      {
        pick: ["state.devMode"],
        storage: sessionStorage,
      },
    ],
  },
);

/**
 * Close loading.
 */
export const closeLoading = () => {
  const appStore = useAppStore();

  appStore.state.loading = false;
  setTimeout(() => {
    appStore.state.loadingText = "";
  }, 500);
};

/**
 * Set current workspace.
 * @param name string
 */
export const setCurrentWorkspace = (name: string) => {
  const appStore = useAppStore();

  appStore.state.currentWorkspace = name;
};

/**
 * Open loading.
 */
export const openLoading = (text: string) => {
  const appStore = useAppStore();

  appStore.state.loadingText = text;
  appStore.state.loading = true;
};
