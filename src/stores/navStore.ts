// navStore.ts

import { Store, defineStore } from "pinia";
import { nextTick, reactive } from "vue";

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

    const dispatchWindowResize = () => {
      nextTick(() => window.dispatchEvent(new Event("resize")));
    };

    /**
     * Handle mouse move on resizing.
     * @param e MouseEvent from which the x position is taken
     */
    const handleSideNavMouseMove = (e: MouseEvent) => {
      state.width = e.clientX - 64;
      // window.dispatchEvent(new Event("resize"));
    };

    /**
     * Handle mouse up on resizing.
     */
    const handleSideNavMouseUp = () => {
      state.resizing = false;
      window.removeEventListener("mousemove", handleSideNavMouseMove);
      window.removeEventListener("mouseup", handleSideNavMouseUp);
      dispatchWindowResize();
    };

    /**
     * Resize side nav.
     */
    const resizeSideNav = () => {
      state.resizing = true;
      window.addEventListener("mousemove", handleSideNavMouseMove);
      window.addEventListener("mouseup", handleSideNavMouseUp);
    };

    /**
     * Toggle side navigation.
     * @param navItem
     */
    const toggle = (navItem: any) => {
      if (!state.open || state.view === navItem.id) {
        state.open = !state.open;
      }
      state.view = state.open ? navItem.id : "";
    };

    return { dispatchWindowResize, resizeSideNav, state, toggle };
  },
  {
    persist: [
      {
        pick: ["state.open", "state.view", "state.width"],
        storage: sessionStorage,
      },
    ],
  },
);

export const closeNav = () => {
  const navStore = useNavStore();
  navStore.state.open = false;
};
