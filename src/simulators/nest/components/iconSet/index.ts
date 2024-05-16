// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconProps } from "vuetify";

import nestIcon from "./NESTIcon.vue";
import copyModelIcon from "./CopyModelIcon.vue";

const nestSvgNameToComponent: { [key: string]: Object } = {
  logo: nestIcon,
  "copy-model": copyModelIcon,
};

export default {
  component: (props: IconProps) =>
    h(nestSvgNameToComponent[props.icon as string]),
};
