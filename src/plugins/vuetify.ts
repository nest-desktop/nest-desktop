/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// custom
import "./main.scss";

import { IconSet, createVuetify } from "vuetify";
// Composables
import * as components from "vuetify/components";
import { VTreeview } from "vuetify/labs/VTreeview";
import * as directives from "vuetify/directives";
// import { md1, md2, md3 } from "vuetify/blueprints";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import { custom } from "@/components/iconsets/custom";
import { graph } from "@/components/iconsets/graph";

const colors = {
  blue: ["1281b3", "#1F77B4", "#4E79A7"][0], // currentColor, category10, tableau10
  orange: ["ff6633", "#FF7F0E", "#F28E2C"][0],
  green: "#2CA02C",
  red: "#D62728",
  purple: "#9467BD",
  brown: "#8C564B",
  rosa: "#E377C2",
  grey: "#7F7F7F",
  yellow: "#BCBD22",
  cyan: "#17BECF",
  "blue-lighten-1": "#AEC7E8",
  "orange-lighten-1": "#FFBB78",
  "green-lighten-1": "#98DF8A",
  "red-lighten-1": "#FF9896",
  "purple-lighten-1": "#C5B0D5",
  "brown-lighten-1": "#C49C94",
  "rosa-lighten-1": "#F7B6D2",
  "grey-lighten-1": "#C7C7C7",
  "yellow-lighten-1": "#DBDB8D",
  "cyan-lighten-1": "#9EDAE5",
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export const vuetify = createVuetify({
  components: {
    ...components,
    VTreeview,
  },
  // blueprint: md2,
  defaults: {
    // global: {
    //   ripple: false,
    // },
    VBtn: { variant: "outlined" },
    VBtnGroup: { variant: "outlined" },
    VBtnToggle: { variant: "outlined" },
    VCard: {
      // elevation: 0,
      VCardActions: {
        VBtn: { size: "small", variant: "outlined" },
      },
    },
    VChip: { variant: "outlined" },
    VCombobox: { variant: "outlined" },
    VDialog: {
      VCard: {
        VCardTitle: {
          VBtn: {
            variant: "text",
          },
        },
      },
    },
    VMenu: {
      VList: {
        density: "compact",
      },
      transition: "slide-y-transition",
    },
    VSelect: { variant: "outlined" },
    VTextarea: { variant: "outlined" },
    VTextField: { variant: "outlined" },
  },
  directives,
  // theme: false,
  theme: {
    themes: {
      light: {
        colors: {
          ...colors,
          primary: "#424242",
          secondary: "#EEEEEE",
          systembar: "#424242",
          accent: "#808080",
        },
      },
      dark: {
        colors: {
          ...colors,
          primary: "#EEEEEE",
          secondary: "#424242",
          systembar: "#424242",
          accent: "#808080",
        },
      },
    },
  },
  icons: {
    aliases,
    defaultSet: "mdi",
    sets: {
      custom,
      mdi: mdi as IconSet,
      graph,
    },
  },
});

export function addTheme(colors: Record<string, string>): void {
  vuetify.theme.themes.value.light.colors = Object.assign(vuetify.theme.themes.value.light.colors, colors);

  vuetify.theme.themes.value.dark.colors = Object.assign(vuetify.theme.themes.value.dark.colors, colors);
}

export function addIconSet(iconSet: Record<string, object>): void {
  vuetify.icons.sets = Object.assign(vuetify.icons.sets, iconSet);
}
