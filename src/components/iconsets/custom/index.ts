import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import diceMultipleOutlineIcon from "./DiceMultipleOutlineIcon.vue";
import dotsGridIcon from "./DotsGridIcon.vue";

const customSvgNameToComponent: { [key: string]: any } = {
  diceMultipleOutlineIcon,
  dotsGridIcon,
};

const custom: IconSet = {
  component: (props: IconProps) =>
    h(customSvgNameToComponent[props.icon as string]),
};

export { custom };
