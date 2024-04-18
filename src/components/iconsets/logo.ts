// logo.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import ebrainsLogo from "@/assets/img/logo/ebrains-logo.svg";

const customSvgNameToComponent: { [key: string]: any } = {
  ebrainsLogo,
};

const logo: IconSet = {
  component: (props: IconProps) =>
    h(customSvgNameToComponent[props.icon as string]),
};

export { logo };
