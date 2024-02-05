// navStore.ts

import { reactive } from "vue";
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
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 400);
    };
    return { state, toggle };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
