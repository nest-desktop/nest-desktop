// networkTypes.ts

import { BaseNetwork } from "@/common/network/baseNetwork";
import { NorseNetwork } from "@norse/components/network/norseNetwork";

export type Network = BaseNetwork | NorseNetwork;
export const NetworkPropTypes = [BaseNetwork, NorseNetwork];
