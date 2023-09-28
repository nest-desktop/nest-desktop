// plugins/nest/iconsets/nest.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import nestIcon from "./NESTIcon.vue";
import networkIcon from "./NetworkIcon.vue";

const customSvgNameToComponent: any = {
  nestIcon,
  networkIcon,
};

const nest: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon]),
};

export { nest /* aliases */ };