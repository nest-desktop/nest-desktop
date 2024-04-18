// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconProps } from "vuetify";
import pynnIcon from "./PyNNIcon.vue";

const pynnSvgNameToComponent: { [key: string]: Object } = {
  logo: pynnIcon,
};

export default {
  component: (props: IconProps) =>
    h(pynnSvgNameToComponent[props.icon as string]),
};
