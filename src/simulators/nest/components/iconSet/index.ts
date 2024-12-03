// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";

import buildModelsIcon from "./BuildModels.vue";
import copyModelIcon from "./CopyModelIcon.vue";
import installModuleIcon from "./InstallModule.vue";
import nestIcon from "./NESTIcon.vue";

import type { IconProps } from "vuetify";

const nestSvgNameToComponent: Record<string, object> = {
  logo: nestIcon,
  "build-models": buildModelsIcon,
  "copy-model": copyModelIcon,
  "install-module": installModuleIcon,
};

export default {
  component: (props: IconProps) =>
    h(nestSvgNameToComponent[props.icon as string]),
};
