// networkGraphTypes.ts

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { NESTNetworkGraph } from "@/simulators/nest/helpers/network/networkGraph";

export type TNetworkGraph = BaseNetworkGraph | NESTNetworkGraph;

// for components
export const TNetworkGraphProps = [BaseNetworkGraph, NESTNetworkGraph];
