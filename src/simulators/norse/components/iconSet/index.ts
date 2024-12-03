// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";

import norseIcon from "./NorseIcon.vue";

import type { IconProps } from "vuetify";
const norseSvgNameToComponent: Record<string, object> = {
  logo: norseIcon,
};

export default {
  component: (props: IconProps) =>
    h(norseSvgNameToComponent[props.icon as string]),
};
