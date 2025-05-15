// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";

import elephantIcon from "./ElephantIcon.vue";

import type { IconProps } from "vuetify";
const elephantSvgNameToComponent: Record<string, object> = {
  logo: elephantIcon,
};

export default {
  component: (props: IconProps) => h(elephantSvgNameToComponent[props.icon as string]),
};
