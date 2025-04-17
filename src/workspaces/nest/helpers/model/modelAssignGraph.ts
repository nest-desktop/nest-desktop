// modelAssignGraph.ts

import { Selection, select } from "d3";

import { BaseObj } from "@/helpers/common/base";
import { INetworkGraphWorkspaceState } from "@/helpers/networkGraph/networkGraphWorkspace";
import { drawPathMouse } from "@/helpers/connectionGraph/connectionGraphPath";

import { NESTConnection } from "../connection/connection";
import { NESTCopyModel } from "./copyModel";
import { NESTNetworkGraph } from "../network/networkGraph";
import { NESTNode } from "../node/node";

export class NESTModelAssignGraph extends BaseObj {
  private _networkGraph: NESTNetworkGraph;

  constructor(networkGraph: NESTNetworkGraph) {
    super();
    this._networkGraph = networkGraph;
  }

  get state(): INetworkGraphWorkspaceState {
    return this._networkGraph.workspace.state;
  }

  get strokeWidth(): number {
    return this._networkGraph.config?.localStorage.strokeWidth;
  }

  /**
   * Update connections in network graph.
   * @remarks This function should be called when connections in the network are changed.
   */
  update(): void {
    this.logger.trace("update");

    if (!this._networkGraph.selector) return;

    const models: Selection<any, any, any, any> = this._networkGraph.selector
      .select("g#modelAssigned")
      .selectAll("g.modelAssigned")
      .data(this._networkGraph.network.connections.filterWithWeightRecorder, (c: NESTConnection | unknown) =>
        c instanceof NESTConnection ? c.hash : "",
      );

    models
      .enter()
      .append("g")
      .attr("class", "modelAssigned")
      .attr("idx", (c: NESTConnection) => c.idx)
      .attr("hash", (c: NESTConnection) => c.hash)
      .each((c: NESTConnection, i: number, e) => this.updateConnection(c, i, e));

    models.exit().remove();

    this.render();
  }

  /**
   * Update a connection graph.
   */
  updateConnection(connection: NESTConnection, idx: number, elements: SVGGElement[] | ArrayLike<SVGGElement>): void {
    this.logger.trace("update connection");

    const elem: Selection<any, any, any, any> = select(elements[idx]);

    elem.selectAll("*").remove();

    elem.append("path").style("fill", "none").style("stroke", "black").style("opacity", 0).style("stroke-width", 40);

    elem
      .append("path")
      .attr("class", "color")
      .attr("marker-end", `url(#assigned-${connection.synapse.copyModel.weightRecorder.idx})`)
      .style("fill", "none")
      .style("stroke", "currentColor")
      .style("pointer-events", "none")
      .style("stroke-width", this.strokeWidth);

    elem
      .on("mouseover", () => {
        connection.state.focus();
        this._networkGraph.update();
      })
      .on("mouseout", () => {
        this._networkGraph.network.nodes.unfocusNode();
        this._networkGraph.update();
      });
  }

  /**
   * Render connection graphs.
   */
  render(): void {
    this.logger.silly("render");

    const selector = select("g#modelAssigned").selectAll("g.modelAssigned");
    selector.style("pointer-events", "none");

    // @ts-expect-error Argument of type '(connection: Connection, idx: number, elements: any[]) => void' is not
    // assignable to parameter of type 'ValueFn<BaseType, unknown, void>'.
    selector.each((connection: Connection, idx: number, elements: any[]) => {
      const elem = select(elements[idx]);
      const synapseModel = connection.synapse.copyModel as NESTCopyModel;
      const weightRecorder = synapseModel.weightRecorder as NESTNode;

      if (weightRecorder) {
        elem.attr("color", connection.synapse.copyModel.weightRecorder.view.color);

        elem
          .selectAll("path")
          .attr("d", drawPathMouse(weightRecorder.view.position, connection.view.markerEndPosition))
          .style("stroke-dasharray", 8);
      }
    });
  }
}
