// index.ts

import router from "@/router";
import { addIconSet, addTheme } from "@/plugins/vuetify";
import { simulatorItems } from "..";

import norseRoute from "./routes";
import { norseIconSet } from "./components/iconsets";

import { useNorseModelDBStore } from "./store/model/modelDBStore";
import { useNorseModelStore } from "./store/model/modelStore";
import { useNorseProjectDBStore } from "./store/project/projectDBStore";
import { useNorseProjectStore } from "./store/project/projectStore";
import { useNorseSessionStore } from "./store/sessionStore";

export default {
  install() {
    router.addRoute("appLayout", norseRoute);

    addTheme({
      "norse-logo": "#000080",
      norse: "0F9959",
      "norse-accent": "#e6007e",
    });

    addIconSet({ norse: norseIconSet });

    simulatorItems.norse = {
      id: "norse",
      title: "Norse",
      routerName: "norseHome",
      icon: "norse:logo",
      databases: ["NORSE_MODEL_STORE", "NORSE_PROJECT_STORE"],
    };

    const norseSessionStore = useNorseSessionStore();
    const modelDBStore = useNorseModelDBStore();
    const modelStore = useNorseModelStore();
    const projectDBStore = useNorseProjectDBStore();
    const projectStore = useNorseProjectStore();

    Promise.all([modelDBStore.init(), projectDBStore.init()]).then(() => {
      modelStore.init();
      projectStore.init();
      norseSessionStore.loading = false;
    });
  },
};
