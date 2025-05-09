// notification.ts

import { Level, createNotification } from "vuetify3-dialog";

import { useAppStore } from "@/stores/appStore";

const now = () =>
  new Date().toLocaleString("en-US", {
    month: "numeric",
    year: "2-digit",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

const _createNotification = (props: { htmlContent: string; level: Level }) => {
  const appStore = useAppStore();
  appStore.state.requestLogs.unshift({
    date: now(),
    ...props,
  });
  createNotification({ ...props, location: "top right" });
};

export const notifyError = (htmlContent: string) => _createNotification({ htmlContent, level: "error" });

export const notifyInfo = (htmlContent: string) => _createNotification({ htmlContent, level: "info" });

export const notifySuccess = (htmlContent: string) => _createNotification({ htmlContent, level: "success" });

export const notifyWarning = (htmlContent: string) => _createNotification({ htmlContent, level: "warning" });
