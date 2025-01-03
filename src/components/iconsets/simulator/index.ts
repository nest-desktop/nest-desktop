import { h } from "vue";

// import arbor from "./ArborIcon.vue";
import nest from "./NESTIcon.vue";
import norse from "./NorseIcon.vue";

import type { IconSet, IconProps } from "vuetify";

// import pynn from "./PyNNIcon.vue";

const simulatorSvgNameToComponent: Record<string, any> = {
  nest,
  norse,
  // pynn,
};

const simulator: IconSet = {
  component: (props: IconProps) => h(simulatorSvgNameToComponent[props.icon as string]),
};

export { simulator };
