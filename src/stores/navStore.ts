// navStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

export const useNavStore = defineStore(
  "nav-store",
  () => {
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
      setTimeout(() => window.dispatchEvent(new Event("resize")), 400); // TODO: nextTick doesn't work.
    };
    return { state, toggle };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
