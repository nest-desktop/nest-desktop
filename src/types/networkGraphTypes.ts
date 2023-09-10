// networkGraphTypes.ts

import { BaseNetworkGraph } from "@/helpers/networkGraph/baseNetworkGraph";
import { NESTNetworkGraph } from "@/simulators/nest/helpers/network/nestNetworkGraph";

export type NetworkGraph = BaseNetworkGraph | NESTNetworkGraph;

export const NetworkGraphTypes = [BaseNetworkGraph, NESTNetworkGraph];
