/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

import { md1, md2, md3 } from "vuetify/blueprints";

import { mdi } from "vuetify/iconsets/mdi";
import { nest } from "@/components/iconsets/nest";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // blueprint: md3,
  defaults: {
    // global: {
    //   ripple: false,
    // },
    VCard: {
      variant: "outlined",
      //   VCardActions: {
      //     VBtn: { size: "small", variant: "outlined", ripple: true },
      //   },
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          "blue-darken-1": "#054766",
          "blue-lighten-1": "#33BEFF",
          "orange-darken-1": "#B33A12",
          "orange-lighten-1": "#FF794D",
          blue: "#1281b3",
          green: "#36B34F",
          orange: "#FF6633",
          pink: "#A93EB3",
          primary: "#424242",
          secondary: "#EEEEEE",
          systembar: "#424242",
          yellow: "#B3AE47",
        },
      },
      dark: {
        colors: {
          "blue-darken-1": "#054766",
          "blue-lighten-1": "#33BEFF",
          "orange-darken-1": "#B33A12",
          "orange-lighten-1": "#FF794D",
          blue: "#1281b3",
          green: "#36B34F",
          orange: "#FF6633",
          pink: "#A93EB3",
          primary: "#EEEEEE",
          secondary: "#424242",
          systembar: "#424242",
          yellow: "#B3AE47",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
      nest,
    },
  },
});
