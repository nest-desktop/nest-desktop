// navStore.ts

import { Store, defineStore } from "pinia";
import { reactive } from "vue";

interface INavStoreState {
  open: boolean;
  resizing: boolean;
  view: string;
  width: number;
}

export type TNavStore = Store<string, any>;
// { state: INavStoreState; toggle: (navItem: any) => void }

export const useNavStore: TNavStore = defineStore(
  "nav-store",
  () => {
    const state = reactive<INavStoreState>({
      open: false,
      resizing: false,
      view: "",
      width: 320,
    });

    const toggle = (navItem: any) => {
      if (!state.open || state.view === navItem.id) {
        state.open = !state.open;
      }
      state.view = state.open ? navItem.id : "";
    };

    return { state, toggle };
  },
  {
    persist: [
      {
        pick: ["state.open", "state.view", "state.width"],
        storage: sessionStorage,
      },
    ],
  }
);
