// navStore.ts

import { nextTick, reactive } from "vue";
import { defineStore } from "pinia";

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
      nextTick(() => window.dispatchEvent(new Event("resize")));
    };
    return { state, toggle };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
