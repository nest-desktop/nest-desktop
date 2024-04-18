// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconProps } from "vuetify";
import norseIcon from "./NorseIcon.vue";

const norseSvgNameToComponent: { [key: string]: Object } = {
  logo: norseIcon,
};

export default {
  component: (props: IconProps) =>
    h(norseSvgNameToComponent[props.icon as string]),
};
