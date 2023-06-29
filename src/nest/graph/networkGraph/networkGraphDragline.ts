// networkGraphDragline.ts

import { pointer } from "d3";
import drawPath from "@/utils/graph/connectionGraphPath";

import { Network } from "@nest/core/network/network";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { logger as mainLogger } from "@/utils/logger";

const logger = mainLogger.getSubLogger({ name: "network graph drag line" });

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
    logger.trace("Init");
    this._workspace.state.dragLine = true;
    this.update(e);
    this._workspace.update();
  }

  /**
   * Update drag line.
   */
  update(e: MouseEvent): void {
    logger.trace("Update");
    if (this.network && this.network.nodes.state.selectedNode != null) {
      const selectedNode = this.network.nodes.state.selectedNode;
      const sourcePosition: any = selectedNode.view.position;
      const position: number[] = pointer(e, this._workspace.selector.node());
      const targetPosition: any = {
        x: position[0],
        y: position[1],
      };

      this._workspace.selector
        .select(".dragline")
        .style("opacity", 0.5)
        .style("stroke", selectedNode.view.color)
        .attr(
          "d",
          drawPath(sourcePosition, targetPosition, {
            isTargetMouse: true,
          })
        );
    } else {
      logger.warn("No node was selected when dragLine() got executed!");
    }
  }

  /**
   * Draw path of the drag line.
   */
  drawPath(
    sourcePos: { x: number; y: number },
    targetPos: { x: number; y: number },
    options: any = {}
  ): void {
    logger.trace("draw path");
    this._workspace.selector
      .select(".dragline")
      .style("opacity", 1)
      .attr("d", drawPath(sourcePos, targetPos, options));
  }

  /**
   * Hide drag line.
   */
  hide(): void {
    this._workspace.selector
      .select(".dragline")
      .style("opacity", 0)
      .attr("d", "M0,0L0,0");
    this._workspace.state.dragLine = false;
  }
}
