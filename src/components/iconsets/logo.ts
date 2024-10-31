// logo.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";

import ebrainsLogo from "@/assets/img/logo/ebrains-logo.svg";

import type { IconSet, IconProps } from "vuetify";

const customSvgNameToComponent: Record<string, any> = {
  ebrainsLogo,
};

const logo: IconSet = {
  component: (props: IconProps) =>
    h(customSvgNameToComponent[props.icon as string]),
};

export { logo };
