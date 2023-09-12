// index.ts

import router from "@/router";
import { addTheme, addIconSet } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import nestRoute from "./routes";
import { nestIconSet } from "./components/iconsets";

import { useNESTModelDBStore } from "./store/model/modelDBStore";
import { useNESTModelStore } from "./store/model/modelStore";
import { useNESTProjectDBStore } from "./store/project/projectDBStore";
import { useNESTProjectStore } from "./store/project/projectStore";
import { useNESTSessionStore } from "./store/sessionStore";

export default {
  install() {
    router.addRoute("appLayout", nestRoute);

    addTheme({
      nest: "ff6633",
    });

    addIconSet({ nest: nestIconSet });

    simulatorItems.nest = {
      id: "nest",
      title: "NEST",
      routerName: "nestHome",
      icon: "nest:logo",
      color: "nest",
      databases: ["NEST_MODEL_STORE", "NEST_PROJECT_STORE"],
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
  },
};
