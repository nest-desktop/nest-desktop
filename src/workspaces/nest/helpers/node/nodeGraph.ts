// nodeGraph.ts

import { select } from "d3";

import { NodeGraph } from "@/helpers/nodeGraph/nodeGraph";

import { NESTNetwork } from "../network/network";
import { NESTNetworkGraph } from "../network/networkGraph";
import type { NESTNode } from "./node";

export class NESTNodeGraph extends NodeGraph<NESTNode> {
  constructor(networkGraph: NESTNetworkGraph) {
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
