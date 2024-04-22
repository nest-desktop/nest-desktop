// synapseTypes.ts

import { BaseSynapse, ISynapseProps } from "@/helpers/synapse/synapse";
import {
  INESTSynapseProps,
  NESTSynapse,
} from "@/simulators/nest/helpers/synapse/synapse";

export type TSynapse = BaseSynapse | NESTSynapse;
export type TSynapseProps = ISynapseProps | INESTSynapseProps;
