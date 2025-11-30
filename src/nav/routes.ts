// routes.ts

import { logger as mainLogger } from "@/utils";

import { useNavStore } from "./navStore";

const logger = mainLogger.getSubLogger({ name: "route" });

/**
 * Before enter home path.
 */
export const homeBeforeEnter = (): void => {
  logger.trace("before enter home route");

  const navStore = useNavStore();
  navStore.state.open = false;
};
