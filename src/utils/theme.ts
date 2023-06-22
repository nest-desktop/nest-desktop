// theme.ts

import { useAppStore } from "@/store/appStore";

export function darkMode(): boolean {
  const appStore = useAppStore();
  return appStore.darkMode;
}
