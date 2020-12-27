import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader

import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "fa"
  },
  theme: {
    themes: {
      light: {
        primary: colors.grey.base,
        secondary: colors.grey.lighten2,
        accent: colors.grey.darken2,
        project: {
          base: "#93b5ad",
          darken1: "#84A29B",
        },
        model: {
          base: "#be6442",
        },
        setting: {
          base: "#ce934a"
        }
      }
    }
  }
});
