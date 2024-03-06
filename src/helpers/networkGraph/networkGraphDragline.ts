// networkGraphDragline.ts

import { pointer } from "d3";

import { Network } from "@/types/networkTypes";
import {
  drawPathMouse,
  drawPathNode,
} from "@/helpers/connectionGraph/connectionGraphPath";
import { logger as mainLogger } from "@/helpers/common/logger";

import { NetworkGraphWorkspace } from "./networkGraphWorkspace";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "network graph drag line",
});

export class NetworkGraphDragline {
  private _workspace: NetworkGraphWorkspace;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    this._workspace = networkGraphWorkspace;
  }

  get network(): Network | undefined {
    return this._workspace.networkGraph.network;
  }

  /**
   * Initialize drag line.
   */
  init(e: MouseEvent): void {
    logger.trace("init");
    this._workspace.state.dragLine = true;
    this.update(e);
    this._workspace.update();
  }

  /**
   * Update drag line.
   */
  update(e: MouseEvent): void {
    logger.trace("update");
    if (this.network && this.network.nodes.state.selectedNode != null) {
      const selectedNode = this.network.nodes.state.selectedNode;
      const sourcePosition: { x: number; y: number } =
        selectedNode.view.state.position;
      const position: number[] = pointer(e, this._workspace.selector.node());
      const targetPosition: { x: number; y: number } = {
        x: position[0],
        y: position[1],
      };

      this._workspace.selector
        .select(".dragline")
        .style("opacity", 0.5)
        .style("stroke", selectedNode.view.color)
        .attr("d", drawPathMouse(sourcePosition, targetPosition));
    } else {
      logger.warn("No node was selected when dragLine() got executed!");
    }
  }

  /**
   * Draw path of the drag line.
   */
  drawPath(
    sourcePos: { x: number; y: number },
    targetPos: { x: number; y: number }
  ): void {
    logger.trace("draw path");
    this._workspace.selector
      .select(".dragline")
      .style("opacity", 1)
      .attr("d", drawPathNode(sourcePos, targetPos));
  }

  /**
   * Hide drag line.
   */
  hide(): void {
    logger.trace("hide");
    this._workspace.selector
      .select(".dragline")
      .style("opacity", 0)
      .attr("d", "M0,0L0,0");
    this._workspace.state.dragLine = false;
  }
}
