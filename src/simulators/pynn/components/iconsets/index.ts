// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";
import pynnIcon from "./PyNNIcon.vue"

const pynnSvgNameToComponent: any = {
  logo: pynnIcon,
};

export const pynnIconSet: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(pynnSvgNameToComponent[props.icon]),
};
