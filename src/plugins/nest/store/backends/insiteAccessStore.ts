// modelStore.ts

import { Backend } from "@/helpers/backend";
import { defineStore } from "pinia";

export const useInsiteAccessStore = defineStore("insite-access-backend", {
  state: () => ({
    backend: new Backend("InsiteAccess", {
      path: "/insite",
      port: 52056,
      versionPath: "/",
    }),
  }),

  actions: {},
});
