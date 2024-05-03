// navStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

export const useNavStore = defineStore("nav-store", () => {
  const state = reactive({
    resizing: false,
    open: false,
    width: 320,
    view: "",
  });

  const toggle = (navItem: any) => {
    if (!state.open || state.view === navItem.id) {
      state.open = !state.open;
    }
    state.view = state.open ? navItem.id : "";
  };

  return { state, toggle };
});
