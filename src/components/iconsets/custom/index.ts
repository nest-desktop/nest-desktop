import { h } from "vue";

import diceMultipleOutlineIcon from "./DiceMultipleOutlineIcon.vue";
import dotsGridIcon from "./DotsGridIcon.vue";
import sliderIcon from "./SliderIcon.vue";

import type { IconSet, IconProps } from "vuetify";

const customSvgNameToComponent: Record<string, any> = {
  "dice-multiple-outline": diceMultipleOutlineIcon,
  "dots-grid": dotsGridIcon,
  slider: sliderIcon,
};

const custom: IconSet = {
  component: (props: IconProps) =>
    h(customSvgNameToComponent[props.icon as string]),
};

export { custom };
