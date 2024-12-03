// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";

import pynnIcon from "./PyNNIcon.vue";

import type { IconProps } from "vuetify";
const pynnSvgNameToComponent: Record<string, object> = {
  logo: pynnIcon,
};

export default {
  component: (props: IconProps) => h(pynnSvgNameToComponent[props.icon as string]),
};
