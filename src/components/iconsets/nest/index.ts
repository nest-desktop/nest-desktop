// plugins/nest/iconsets/nest.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import connectionIcon from "./connections/ConnectionIcon.vue";
import excitatoryNeuronIcon from "./nodes/ExcitatoryNeuronIcon.vue"
import excitatorySynapseIcon from "./connections/ExcitatorySynapseIcon.vue";
import inhibitoryNeuronIcon from "./nodes/InhibitoryNeuronIcon.vue"
import inhibitorySynapseIcon from "./connections/InhibitorySynapseIcon.vue";
import nestIcon from "./NESTIcon.vue";
import networkIcon from "./NetworkIcon.vue";
import recorderIcon from "./nodes/RecorderIcon.vue";
import stimulatorIcon from "./nodes/StimulatorIcon.vue";

const customSvgNameToComponent: any = {
  connection: connectionIcon,
  "excitatory-neuron": excitatoryNeuronIcon,
  "excitatory-synapse": excitatorySynapseIcon,
  "inhibitory-neuron": inhibitoryNeuronIcon,
  "inhibitory-synapse": inhibitorySynapseIcon,
  logo: nestIcon,
  network: networkIcon,
  recorder: recorderIcon,
  stimulator: stimulatorIcon,
};

const nest: IconSet = {
  // @ts-ignore
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon]),
};

export { nest /* aliases */ };
