// nodeGraph.ts

import { select } from "d3";

import { NodeGraph } from "@/networkGraph";

import type { NESTNetworkGraph } from "../networkGraph";

export class NESTNodeGraph extends NodeGraph<NESTNetworkGraph> {
  /**
   * Update style of the nodes.
   */
  override updateStyle(): void {
    select("g#nodes").style("pointer-events", () =>
      this.networkGraph.network.nodes.isWeightRecorderSelected ? "none" : "",
    );
  }
}
