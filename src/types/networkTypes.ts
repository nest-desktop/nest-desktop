// networkTypes.ts

import { BaseNetwork } from "@/components/network/baseNetwork";
import { NESTNetwork } from "@nest/components/network/nestNetwork";
import { NorseNetwork } from "@norse/components/network/norseNetwork";

export type Network = BaseNetwork | NESTNetwork | NorseNetwork;

// for network graph
export const NetworkPropTypes = [BaseNetwork, NESTNetwork, NorseNetwork];
