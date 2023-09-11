// synapseTypes.ts

import { BaseSynapse } from "@/helpers/synapse/synapse";
import { NESTSynapse } from "@/simulators/nest/helpers/synapse/synapse";

export type Synapse = BaseSynapse | NESTSynapse;