// Utilities
import { defineStore } from "pinia";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projectId: "xx",
    view: "edit",
  })
});
