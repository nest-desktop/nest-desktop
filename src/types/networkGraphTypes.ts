// networkGraphTypes.ts

import { BaseNetworkGraph } from "@/components/network/networkGraph/baseNetworkGraph";
import { NESTNetworkGraph } from "@/simulators/nest/components/network/networkGraph/nestNetworkGraph";

export type NetworkGraph = BaseNetworkGraph | NESTNetworkGraph;

export const NetworkGraphTypes = [BaseNetworkGraph, NESTNetworkGraph];
