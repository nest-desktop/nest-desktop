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

import { mdi } from "vuetify/iconsets/mdi";
import { nest } from "@/components/iconsets/nest";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    global: {
      ripple: false,
    },
    VCard: {
      flat: true,
      VCardActions: { VBtn: { size: "small", variant: "outlined", ripple: true } },
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
          project: "#1281b3",
          model: "#ff6633",
          systembar: "#424242",
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
