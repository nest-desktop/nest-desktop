// synapseTypes.ts

import { BaseSynapse } from "@/helpers/synapse/synapse";
import { NESTSynapse } from "@/simulators/nest/helpers/synapse/synapse";

export type TSynapse = BaseSynapse | NESTSynapse;

// for components
export const TSynapseProps = [BaseSynapse, NESTSynapse];
