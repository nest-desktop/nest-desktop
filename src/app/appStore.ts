// appStore.ts

import { defineStore } from "pinia";
import { computed, ComputedRef, reactive, UnwrapRef } from "vue";
import type { Anchor, ThemeInstance } from "vuetify";

import { type IWorkspaceProps, workspaces } from "@/workspaces/install";

interface IAppStoreState {
  autoUpdate: boolean;
  currentWorkspace: string;
  devMode: boolean;
  filterTag: string;
  initialized: boolean;
  loading: boolean;
  loadingText: string;
  logsOpen: boolean;
  notificationLocation: Anchor;
  requestLogs: { date: string; htmlContent: string; level: string }[];
  theme: string;
  themeIcon: string;
  workspacesEnabled: string[];
}

interface IAppStore {
  clearLogs: () => void;
  currentWorkspace: ComputedRef<IWorkspaceProps | undefined>;
  darkMode: ComputedRef<boolean>;
  hasWorkspace: ComputedRef<boolean>;
  init: (theme: ThemeInstance) => void;
  resetWorkspace: () => void;
  state: UnwrapRef<IAppStoreState>;
  toggleTheme: () => void;
  updateTheme: () => void;
  workspaceItems: ComputedRef<(IWorkspaceProps | undefined)[]>;
}

export const useAppStore = defineStore(
  "app-store",
  (): IAppStore => {
    let themeInstance: ThemeInstance;

    const state = reactive<IAppStoreState>({
      autoUpdate: false,
      currentWorkspace: "nest",
      devMode: false,
      filterTag: "",
      initialized: false,
      loading: false,
      loadingText: "Loading... Please wait",
      logsOpen: false,
      notificationLocation: "bottom right",
      requestLogs: [] as { date: string; htmlContent: string; level: string }[],
      theme: "auto", // auto, light, dark
      themeIcon: "mdi:mdi-system",
      workspacesEnabled: ["nest"],
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

    const init = (theme: ThemeInstance): void => {
      themeInstance = theme;

      const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      colorSchemeQuery.addEventListener("change", updateTheme);

      updateTheme();
    };

    const resetWorkspace = (): void => {
      state.currentWorkspace = Object.keys(workspaces)[0] as string;
    };

    const workspaceItems = computed(() =>
      state.workspacesEnabled.map((workspaceId: string) => workspaces[workspaceId]),
    );

    const toggleTheme = (): void => {
      const themes = ["light", "dark", "auto"];
      state.theme = themes[(themes.indexOf(state.theme) + 1) % 3] as string;
      updateTheme();
    };

    const updateTheme = (): void => {
      if (themeInstance == null) return;

      state.themeIcon = state.theme === "auto" ? "mdi:mdi-desktop-tower-monitor" : "mdi:mdi-theme-light-dark";

      const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const themeValue = state.theme === "auto" ? (darkThemeQuery.matches ? "dark" : "light") : state.theme;

      themeInstance.change(themeValue);

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
          "state.currentWorkspace",
          "state.notificationLocation",
          "state.theme",
          "state.themeIcon",
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

export const getCurrentDBStore = (name: string) => {
  const appStore = useAppStore();
  return appStore.currentWorkspace?.stores[name + "DBStore"];
};

export const getCurrentStore = (name: string) => {
  const appStore = useAppStore();
  return appStore.currentWorkspace?.stores[name + "Store"];
};

export const getCurrentViewStore = (name: string) => {
  const appStore = useAppStore();
  return appStore.currentWorkspace?.views[name];
};

export const isDevMode = () => {
  const appStore = useAppStore();

  return appStore.state.devMode;
};

/**
 * Open loading.
 */
export const openLoading = (text: string) => {
  const appStore = useAppStore();

  appStore.state.loadingText = text;
  appStore.state.loading = true;
};

/**
 * Set current workspace.
 * @param name string
 */
export const setCurrentWorkspace = (name: string) => {
  const appStore = useAppStore();

  appStore.state.currentWorkspace = name;
};
