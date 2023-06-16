import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import arborIcon from "./ArborIcon.vue";
import nestIcon from "./NESTIcon.vue";
import pynnIcon from "./PyNNIcon.vue";

const stimulatorSvgNameToComponent: any = {
  arborIcon,
  nestIcon,
  pynnIcon
};

const stimulator: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(stimulatorSvgNameToComponent[props.icon]),
};

export { stimulator /* aliases */ };