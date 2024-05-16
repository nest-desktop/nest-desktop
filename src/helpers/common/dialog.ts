// dialog.ts

import {
  notifyError as _notifyError,
  notifyInfo as _notifyInfo,
  notifySuccess as _notifySuccess,
  notifyWarning as _notifyWarning,
} from "vuetify3-dialog";

import { useAppStore } from "@/stores/appStore";

const now = () =>
  new Date().toLocaleString("en-US", {
    month: "numeric",
    year: "2-digit",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

export const notifyError = (text: string) => {
  const appStore = useAppStore();
  appStore.state.requestLogs.unshift({
    date: now(),
    text,
    type: "error",
  });
  _notifyError(text);
};

export const notifyInfo = (text: string) => {
  const appStore = useAppStore();
  appStore.state.requestLogs.unshift({
    date: now(),
    text,
    type: "info",
  });
  _notifyInfo(text);
};

export const notifySuccess = (text: string) => {
  const appStore = useAppStore();
  appStore.state.requestLogs.unshift({
    date: now(),
    text,
    type: "success",
  });
  _notifySuccess(text);
};

export const notifyWarning = (text: string) => {
  const appStore = useAppStore();
  appStore.state.requestLogs.unshift({
    date: now(),
    text,
    type: "warning",
  });
  _notifyWarning(text);
};
