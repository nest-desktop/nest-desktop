// synapseTypes.ts

import { BaseSynapse } from "@/helpers/synapse/synapse";
import { NESTSynapse } from "@/simulators/nest/helpers/synapse/synapse";

export type Synapse = BaseSynapse | NESTSynapse;

// for synapse spec editor
export const SynapsePropTypes = [BaseSynapse, NESTSynapse];
