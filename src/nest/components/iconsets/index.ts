// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import connectionIcon from "./connections/ConnectionIcon.vue";
import nestIcon from "./NESTIcon.vue";
import networkIcon from "./NetworkIcon.vue";
import neuronExcitatoryIcon from "./nodes/NeuronExcitatoryIcon.vue";
import neuronInhibitoryIcon from "./nodes/NeuronInhibitoryIcon.vue";
import neuronIcon from "./nodes/NeuronIcon.vue";
import recorderIcon from "./nodes/RecorderIcon.vue";
import stimulatorIcon from "./nodes/StimulatorIcon.vue";
import synapseExcitatoryIcon from "./connections/SynapseExcitatoryIcon.vue";
import synapseInhibitoryIcon from "./connections/SynapseInhibitoryIcon.vue";
import synapseRecorderIcon from "./connections/SynapseRecorderIcon.vue";

const customSvgNameToComponent: any = {
  "neuron": neuronIcon,
  "neuron-mixed": neuronIcon,
  "neuron-excitatory": neuronExcitatoryIcon,
  "neuron-inhibitory": neuronInhibitoryIcon,
  "synapse-excitatory": synapseExcitatoryIcon,
  "synapse-inhibitory": synapseInhibitoryIcon,
  "synapse-recorder": synapseRecorderIcon,
  connection: connectionIcon,
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
