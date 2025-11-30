// theme.ts

import { useAppStore } from "@/app";

export const currentBackgroundColor = (): string => (darkMode() ? "#121212" : "white");

export const currentColor = (): string => (darkMode() ? "white" : "#121212");

export const darkMode = (): boolean => {
  const appStore = useAppStore();
  return appStore.darkMode;
};
