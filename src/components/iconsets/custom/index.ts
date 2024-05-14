import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import diceMultipleOutlineIcon from "./DiceMultipleOutlineIcon.vue";
import dotsGridIcon from "./DotsGridIcon.vue";
import sliderIcon from "./SliderIcon.vue";

const customSvgNameToComponent: { [key: string]: any } = {
  diceMultipleOutlineIcon,
  dotsGridIcon,
  sliderIcon,
};

const custom: IconSet = {
  component: (props: IconProps) =>
    h(customSvgNameToComponent[props.icon as string]),
};

export { custom };
