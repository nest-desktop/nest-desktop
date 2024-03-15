// networkTypes.ts

import { BaseNetwork } from "@/helpers/network/network";
import { NESTNetwork } from "@/simulators/nest/helpers/network/network";
import { NorseNetwork } from "@/simulators/norse/helpers/network/network";

export type TNetwork = BaseNetwork | NESTNetwork | NorseNetwork;

// for components
export const TNetworkProps = [BaseNetwork, NESTNetwork, NorseNetwork];
