// index.ts

import router from "@/router";
import { addTheme, addIconSet } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import nestRoute from "./routes";
import { nestIconSet } from "./components/iconsets";

import { useInsiteAccessStore } from "./store/backends/insiteAccessStore";
import { useNESTModelDBStore } from "./store/model/modelDBStore";
import { useNESTModelStore } from "./store/model/modelStore";
import { useNESTProjectDBStore } from "./store/project/projectDBStore";
import { useNESTProjectStore } from "./store/project/projectStore";
import { useNESTSessionStore } from "./store/sessionStore";
import { useNESTSimulatorStore } from "./store/backends/nestSimulatorStore";

export default {
  install() {
    router.addRoute("appLayout", nestRoute);

    addTheme({
      nest: "ff6633",
    });

    addIconSet({ nest: nestIconSet });

    const nestSimulatorStore = useNESTSimulatorStore();
    // nestSimulatorStore.init();

    const insiteAccessStore = useInsiteAccessStore();
    insiteAccessStore.init();

    simulatorItems.nest = {
      backends: [insiteAccessStore, nestSimulatorStore],
      color: "nest",
      databases: ["NEST_MODEL_STORE", "NEST_PROJECT_STORE"],
      icon: "nest:logo",
      id: "nest",
      routerName: "nestHome",
      title: "NEST",
    };

    const nestSessionStore = useNESTSessionStore();
    const modelDBStore = useNESTModelDBStore();
    const modelStore = useNESTModelStore();
    const projectDBStore = useNESTProjectDBStore();
    const projectStore = useNESTProjectStore();

    Promise.all([modelDBStore.init(), projectDBStore.init()]).then(() => {
      modelStore.init();
      projectStore.init();
      nestSessionStore.loading = false;
    });

    nestSimulatorStore.update = () => {
      // Add token to axios instance header.
      if (nestSimulatorStore.accessToken) {
        nestSimulatorStore.session.instance.defaults.headers.common[
          "NESTServerAuth"
        ] = nestSimulatorStore.accessToken;
      }
      nestSimulatorStore.init();
    };
    nestSimulatorStore.update();
  },
};
