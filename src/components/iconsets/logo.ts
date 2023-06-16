// logo.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import ebrainsLogo from "@/assets/img/logo/ebrains-logo.svg";

const customSvgNameToComponent: any = {
  ebrainsLogo,
};

const logo: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon]),
};

export { logo /* aliases */ };