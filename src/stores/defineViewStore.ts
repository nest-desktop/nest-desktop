// defineViewStore.ts

import { defineStore } from "pinia";
import { nextTick, reactive } from "vue";

import { logger as mainLogger } from "@/utils/logger";

import { useNavStore } from "./navStore";

export const defineViewStore = (props: { name: string; workspace: string; views: Record<string, string> }) => {
  const logger = mainLogger.getSubLogger({
    minLevel: 3,
    name: props.workspace + " " + props.name + " view store",
  });

  return defineStore(
    props.workspace + "-" + props.name + "-view",
    () => {
      const state = reactive<{
        bottomNav: {
          height: number;
          active: boolean;
        };
        controller: {
          open: boolean;
          width: number;
        };
        simulationEvents: {
          onCheckout: boolean;
          onLoad: boolean;
          onChange: boolean;
        };
        views: Record<string, string>;
      }>({
        bottomNav: {
          height: 200,
          active: false,
        },
        controller: {
          open: false,
          width: 480,
        },
        simulationEvents: {
          onChange: false,
          onCheckout: false,
          onLoad: false,
        },
        views: props.views,
      });

      const dispatchWindowResize = () => {
        nextTick(() => window.dispatchEvent(new Event("resize")));
      };

      /**
       * Handle mouse move on resizing.
       * @param e MouseEvent from which the y position is taken
       */
      const handleBottomNavMouseMove = (e: MouseEvent) => {
        state.bottomNav.height = window.innerHeight - e.clientY;
      };

      /**
       * Handle mouse up on resizing.
       */
      const handleBottomNavMouseUp = () => {
        const navStore = useNavStore();

        navStore.state.resizing = false;
        window.removeEventListener("mousemove", handleBottomNavMouseMove);
        window.removeEventListener("mouseup", handleBottomNavMouseUp);
        navStore.dispatchWindowResize();
      };

      /**
       * Handle mouse move on resizing.
       * @param e MouseEvent from which the x position is taken
       */
      const handleRightNavMouseMove = (e: MouseEvent) => {
        state.controller.width = window.innerWidth - e.clientX - 64;
      };

      /**
       * Handle mouse up on resizing.
       */
      const handleRightNavMouseUp = () => {
        const navStore = useNavStore();

        navStore.state.resizing = false;
        window.removeEventListener("mousemove", handleRightNavMouseMove);
        window.removeEventListener("mouseup", handleRightNavMouseUp);
        navStore.dispatchWindowResize();
      };

      /**
       * Resize bottom nav.
       */
      const resizeBottomNav = () => {
        const navStore = useNavStore();

        navStore.state.resizing = true;
        window.addEventListener("mousemove", handleBottomNavMouseMove);
        window.addEventListener("mouseup", handleBottomNavMouseUp);
      };

      /**
       * Resize side controller.
       */
      const resizeRightNav = () => {
        const navStore = useNavStore();

        navStore.state.resizing = true;
        window.addEventListener("mousemove", handleRightNavMouseMove);
        window.addEventListener("mouseup", handleRightNavMouseUp);
      };

      /**
       * Toggle bottom navigation.
       */
      const toggleBottomNav = () => {
        state.bottomNav.active = !state.bottomNav.active;
      };

      /**
       * Toggle navigation drawer.
       * @param item
       */
      const toggleController = (item: { id: string }): void => {
        logger.trace("toggle controller:", item.id);

        if (!state.controller.open || state.views.controller === item.id) {
          state.controller.open = !state.controller.open;
        }
        state.views.controller = state.controller.open ? item.id : "";
      };

      return {
        dispatchWindowResize,
        resizeBottomNav,
        resizeRightNav,
        state,
        toggleController,
        toggleBottomNav,
      };
    },
    {
      persist: [
        {
          pick: ["state.bottomNav", "state.controller", "state.views"],
          storage: sessionStorage,
        },
        {
          pick: ["state.simulationEvents"],
          storage: localStorage,
        },
      ],
    },
  );
};
