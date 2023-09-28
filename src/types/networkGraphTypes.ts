// networkGraphTypes.ts

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { NESTNetworkGraph } from "@/simulators/nest/helpers/network/networkGraph";

export type NetworkGraph = BaseNetworkGraph | NESTNetworkGraph;

export const NetworkGraphTypes = [BaseNetworkGraph, NESTNetworkGraph];
