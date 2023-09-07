// synapseTypes.ts

import { BaseSynapse } from "@/helpers/synapse/baseSynapse";
import { NESTSynapse } from "@/simulators/nest/helpers/synapse/nestSynapse";

export type Synapse = BaseSynapse | NESTSynapse;