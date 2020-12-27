import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);

import { App } from "./app";
import { reactive } from "@vue/composition-api";

const core = reactive({
  app: new App()
});

export default core;
