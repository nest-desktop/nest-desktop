// networkTypes.ts

import { BaseNetwork, INetworkProps } from "@/helpers/network/network";
import {
  INESTNetworkProps,
  NESTNetwork,
} from "@/simulators/nest/helpers/network/network";
import {
  INorseNetworkProps,
  NorseNetwork,
} from "@/simulators/norse/helpers/network/network";

export type TNetwork = BaseNetwork | NESTNetwork | NorseNetwork;
export type TNetworkProps =
  | INetworkProps
  | INESTNetworkProps
  | INorseNetworkProps;
