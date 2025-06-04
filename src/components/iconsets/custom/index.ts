// iconsets/custom

import type { IconSet, IconProps } from "vuetify";
import { h } from "vue";

import diceMultipleOutlineIcon from "./DiceMultipleOutlineIcon.vue";
import dotsGridIcon from "./DotsGridIcon.vue";
import sliderIcon from "./SliderIcon.vue";
import DeleteEmptyOutlineIcon from "./DeleteEmptyOutlineIcon.vue";
import MapIcon from "./MapIcon.vue";

const customSvgNameToComponent: Record<string, any> = {
  "dice-multiple-outline": diceMultipleOutlineIcon,
  "delete-empty-outline": DeleteEmptyOutlineIcon,
  "dots-grid": dotsGridIcon,
  map: MapIcon,
  slider: sliderIcon,
};

const custom: IconSet = {
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon as string]),
};

export { custom };
