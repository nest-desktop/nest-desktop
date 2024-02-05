// theme.ts

import { useAppStore } from "@/stores/appStore";

export function currentBackgroundColor(): string {
  return darkMode() ? "#121212" : "white";
}

export function currentColor(): string {
  return darkMode() ? "white" : "#121212";
}

export function darkMode(): boolean {
  const appStore = useAppStore();
  return appStore.darkMode;
}
