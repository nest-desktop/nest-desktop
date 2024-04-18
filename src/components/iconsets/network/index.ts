// index.ts
// https://stackoverflow.com/questions/73795753/how-to-import-custom-svg-icons-in-vuetify-3

import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import connection from "./connections/ConnectionIcon.vue";
import networkIcon from "./NetworkIcon.vue";
import neuron from "./nodes/NeuronIcon.vue";
import neuronExcitatory from "./nodes/NeuronExcitatoryIcon.vue";
import neuronInhibitory from "./nodes/NeuronInhibitoryIcon.vue";
import neuronShape from "./nodes/NeuronShapeIcon.vue";
import recorder from "./nodes/RecorderIcon.vue";
import stimulator from "./nodes/StimulatorIcon.vue";
import synapseExcitatory from "./connections/SynapseExcitatoryIcon.vue";
import synapseInhibitory from "./connections/SynapseInhibitoryIcon.vue";
import synapseRecorder from "./connections/SynapseRecorderIcon.vue";

const networkSvgNameToComponent: { [key: string]: any } = {
  neuron,
  "neuron-shape": neuronShape,
  "neuron-mixed": neuron,
  "neuron-excitatory": neuronExcitatory,
  "neuron-inhibitory": neuronInhibitory,
  "synapse-excitatory": synapseExcitatory,
  "synapse-inhibitory": synapseInhibitory,
  "synapse-recorder": synapseRecorder,
  connection,
  network: networkIcon,
  recorder,
  stimulator,
};

const network: IconSet = {
  component: (props: IconProps) =>
    h(networkSvgNameToComponent[props.icon as string]),
};

export { network };
