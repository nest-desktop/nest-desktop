// networkTypes.ts

import { BaseNetwork } from "@/helpers/network/baseNetwork";
import { NESTNetwork } from "@nest/helpers/network/nestNetwork";
import { NorseNetwork } from "@norse/helpers/network/norseNetwork";

export type Network = BaseNetwork | NESTNetwork | NorseNetwork;

// for network graph
export const NetworkPropTypes = [BaseNetwork, NESTNetwork, NorseNetwork];
