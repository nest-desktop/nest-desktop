import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import arbor from "./ArborIcon.vue";
import nest from "./NESTIcon.vue";
import pynn from "./PyNNIcon.vue";

const simulatorSvgNameToComponent: any = {
  arbor,
  nest,
  pynn
};

const simulator: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(simulatorSvgNameToComponent[props.icon]),
};

export { simulator /* aliases */ };