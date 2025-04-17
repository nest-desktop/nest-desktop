// nodeGraph.ts

import { select } from "d3";

import { TNetworkGraph } from "@/types";
import { NodeGraph } from "@/helpers/nodeGraph/nodeGraph";

import { NESTNetwork } from "../network/network";
import { NESTNetworkGraph } from "../network/networkGraph";

export class NESTNodeGraph extends NodeGraph {
  constructor(networkGraph: TNetworkGraph) {
    super(networkGraph);
  }

  get network(): NESTNetwork {
    return this.networkGraph.network as NESTNetwork;
  }

  get networkGraph(): NESTNetworkGraph {
    return this._networkGraph as NESTNetworkGraph;
  }

  /**
   * Update style of the nodes.
   */
  override updateStyle(): void {
    select("g#nodes").style("pointer-events", () => (this.network.nodes.isWeightRecorderSelected ? "none" : ""));
  }
}
