// networkGraphDragline.ts

import { pointer } from "d3";

import { TNetwork } from "@/types";

import { BaseObj } from "../common/base";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { drawPathMouse, drawPathNode } from "../connectionGraph/connectionGraphPath";

export class NetworkGraphDragline extends BaseObj {
  private _workspace: NetworkGraphWorkspace;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    super();

    this._workspace = networkGraphWorkspace;
  }

  get network(): TNetwork | undefined {
    return this._workspace.networkGraph.network;
  }

  /**
   * Initialize drag line.
   * @param event mouse event
   */
  init(event: MouseEvent): void {
    this.logger.trace("init");

    this._workspace.state.dragLine = true;
    this.update(event);
    this._workspace.update();
  }

  /**
   * Update drag line.
   * @param event mouse event
   */
  update(event: MouseEvent): void {
    this.logger.trace("update");

    if (this.network && this.network.connections.state.selectedNode != null) {
      const selectedNode = this.network.connections.state.selectedNode;

      const sourcePosition: { x: number; y: number } = selectedNode.view.position;
      const position: number[] = pointer(event, this._workspace.selector.node());
      const targetPosition: { x: number; y: number } = {
        x: position[0],
        y: position[1],
      };

      this._workspace.selector
        .select(".dragline")
        .select("path")
        .style("opacity", 0.5)
        .style("stroke", selectedNode.view.color)
        .attr("d", drawPathMouse(sourcePosition, targetPosition));
    } else {
      this.logger.warn("No node was selected when dragLine() got executed!");
    }
  }

  /**
   * Draw path of the drag line.
   * @param sourcePos source position
   * @param targetPos target position
   */
  drawPath(sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }): void {
    this.logger.trace("draw path");

    this._workspace.selector
      .select(".dragline")
      .select("path")
      .style("opacity", 1)
      .attr("d", drawPathNode(sourcePos, targetPos));
  }

  /**
   * Hide drag line.
   */
  hide(): void {
    this.logger.trace("hide");

    this._workspace.selector.select(".dragline").select("path").style("opacity", 0).attr("d", "M0,0L0,0");
    this._workspace.state.dragLine = false;
  }
}
