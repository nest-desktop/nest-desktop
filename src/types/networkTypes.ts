// networkTypes.ts

import { BaseNetwork } from "@/helpers/network/network";
import { NESTNetwork } from "@/simulators/nest/helpers/network/network";
import { NorseNetwork } from "@/simulators/norse/helpers/network/network";

export type Network = BaseNetwork | NESTNetwork | NorseNetwork;

// for network graph
export const NetworkPropTypes = [BaseNetwork, NESTNetwork, NorseNetwork];
