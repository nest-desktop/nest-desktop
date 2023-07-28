import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import copyModelIcon from "./CopyModelIcon.vue";
import diceMultipleOutlineIcon from "./DiceMultipleOutlineIcon.vue";
import dotsGridIcon from "./DotsGridIcon.vue";

const customSvgNameToComponent: any = {
  copyModelIcon,
  diceMultipleOutlineIcon,
  dotsGridIcon
};

const custom: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon]),
};

export { custom /* aliases */ };