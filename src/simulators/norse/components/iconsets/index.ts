// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";
import norseIcon from "./NorseIcon.vue"

const norseSvgNameToComponent: any = {
  logo: norseIcon,
};

export const norseIconSet: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(norseSvgNameToComponent[props.icon]),
};
